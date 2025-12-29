const csv = require('csv-parser');
const fs = require('fs');
const connection = require('../Database/connection');
const sql = require('mssql');

class CsvService {
    
    // Procesar CSV y cargar a base de datos
    static async processCsv(filePath, tableName, columnMapping = null) {
        const results = [];
        const errors = [];
        
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv({
                    separator: ';',
                    skipEmptyLines: true,
                    trim: true
                }))
                .on('data', (row) => {
                    console.log('📋 Fila leída del CSV:', row);
                    
                    // Mapear columnas si se proporciona un mapping
                    const mappedRow = columnMapping 
                        ? this.mapColumns(row, columnMapping) 
                        : row;
                    
                    console.log('🔄 Fila después del mapeo:', mappedRow);
                    
                    // Validar que la fila tiene datos
                    if (Object.keys(mappedRow).length > 0) {
                        results.push(mappedRow);
                    } else {
                        console.warn('⚠️ Fila vacía después del mapeo, se omite');
                    }
                })
                .on('end', async () => {
                    try {
                        console.log(`✅ CSV procesado. Total de filas: ${results.length}`);
                        
                        if (results.length === 0) {
                            fs.unlinkSync(filePath);
                            reject(new Error('No se encontraron datos válidos en el CSV'));
                            return;
                        }
                        
                        // Eliminar archivo temporal
                        fs.unlinkSync(filePath);
                        
                        // Insertar en base de datos
                        const inserted = await this.bulkInsert(tableName, results);
                        
                        resolve({
                            success: true,
                            totalRows: results.length,
                            insertedRows: inserted,
                            errors: errors
                        });
                    } catch (error) {
                        console.error('❌ Error al finalizar procesamiento:', error);
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    console.error('❌ Error al leer CSV:', error);
                    reject(error);
                });
        });
    }
    
    // Mapear columnas del CSV a columnas de la BD
    static mapColumns(row, mapping) {
        const mapped = {};
        
        console.log('🗺️ Mapping definido:', mapping);
        console.log('📝 Columnas en el CSV:', Object.keys(row));
        console.log('🔍 Mapeando fila:', row);
        
        for (const [csvColumn, dbColumn] of Object.entries(mapping)) {
            // Buscar la columna de forma case-insensitive y sin espacios
            const actualColumn = Object.keys(row).find(key => 
                key.trim().toLowerCase() === csvColumn.trim().toLowerCase()
            );
            
            if (actualColumn && row[actualColumn] !== undefined && row[actualColumn] !== '') {
                mapped[dbColumn] = row[actualColumn].trim();
                console.log(`✓ Mapeado: ${csvColumn} (${actualColumn}) → ${dbColumn} = "${mapped[dbColumn]}"`);
            } else {
                console.warn(`⚠️ Columna "${csvColumn}" no encontrada en CSV o vacía`);
            }
        }
        
        return mapped;
    }
    
    // Inserción masiva (bulk insert)
    static async bulkInsert(tableName, data) {
        try {
            const pool = await connection.getConnection();
            let insertedCount = 0;
            
            console.log(`📊 Iniciando inserción masiva en tabla: ${tableName}`);
            console.log(`📦 Total de registros a insertar: ${data.length}`);
            
            for (const row of data) {
                try {
                    const columns = Object.keys(row).filter(col => row[col] !== undefined);
                    
                    if (columns.length === 0) {
                        console.warn('⚠️ Fila sin columnas válidas, se omite');
                        continue;
                    }
                    
                    const request = pool.request();
                    
                    // Crear parámetros
                    const paramNames = columns.map((col, i) => `@param${i}`);
                    const paramPlaceholders = paramNames.join(', ');
                    const columnNames = columns.join(', ');
                    
                    // Agregar valores con tipo de dato apropiado
                    columns.forEach((col, i) => {
                        const value = row[col];
                        
                        // Detectar tipo de dato
                        if (value === null || value === undefined || value === '') {
                            request.input(`param${i}`, sql.NVarChar, null);
                        } else if (!isNaN(value) && value !== '') {
                            if (Number.isInteger(Number(value))) {
                                request.input(`param${i}`, sql.Int, parseInt(value));
                            } else {
                                request.input(`param${i}`, sql.Float, parseFloat(value));
                            }
                        } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                            request.input(`param${i}`, sql.Bit, value.toLowerCase() === 'true' ? 1 : 0);
                        } else {
                            request.input(`param${i}`, sql.NVarChar, value);
                        }
                    });
                    
                    const query = `
                        INSERT INTO ${tableName} (${columnNames}) 
                        VALUES (${paramPlaceholders})
                    `;

                    console.log(`💾 Query: ${query}`);
                    console.log(`📝 Valores:`, row);
                    
                    await request.query(query);
                    insertedCount++;
                    console.log(`✅ Registro ${insertedCount} insertado correctamente`);
                    
                } catch (error) {
                    console.error('❌ Error insertando fila:', error.message);
                    console.error('Fila con error:', row);
                    // Continuar con la siguiente fila
                }
            }
            
            console.log(`🎉 Inserción completada. Total insertado: ${insertedCount}/${data.length}`);
            return insertedCount;
            
        } catch (error) {
            console.error('❌ Error en bulkInsert:', error);
            throw error;
        }
    }
    
    // Inserción con Table-Valued Parameters (más eficiente)
    static async bulkInsertOptimized(tableName, data) {
        try {
            const pool = await connection.getConnection();
            
            if (data.length === 0) {
                return 0;
            }
            
            console.log(`📊 Inserción optimizada en tabla: ${tableName}`);
            
            // Crear tabla temporal
            const table = new sql.Table(tableName);
            table.create = false; // No crear tabla, usar existente
            
            // Definir columnas según los datos
            const firstRow = data[0];
            Object.keys(firstRow).forEach(column => {
                const value = firstRow[column];
                let sqlType = sql.NVarChar(255);
                
                // Detectar tipo de dato automáticamente
                if (value !== null && value !== undefined && value !== '') {
                    if (!isNaN(value)) {
                        if (Number.isInteger(Number(value))) {
                            sqlType = sql.Int;
                        } else {
                            sqlType = sql.Float;
                        }
                    } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                        sqlType = sql.Bit;
                    }
                }
                
                table.columns.add(column, sqlType, { nullable: true });
            });
            
            // Agregar filas
            data.forEach(row => {
                const values = Object.keys(firstRow).map(key => {
                    const value = row[key];
                    
                    // Convertir valores según el tipo
                    if (value === null || value === undefined || value === '') {
                        return null;
                    }
                    
                    if (!isNaN(value) && value !== '') {
                        return Number(value);
                    }
                    
                    if (value.toLowerCase() === 'true') return 1;
                    if (value.toLowerCase() === 'false') return 0;
                    
                    return value;
                });
                
                table.rows.add(...values);
            });
            
            // Ejecutar bulk insert
            const request = pool.request();
            await request.bulk(table);
            
            console.log(`✅ ${data.length} registros insertados correctamente`);
            return data.length;
            
        } catch (error) {
            console.error('❌ Error en bulkInsertOptimized:', error);
            throw error;
        }
    }
}

module.exports = CsvService;