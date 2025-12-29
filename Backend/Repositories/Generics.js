const connection = require("../Database/connection");
const sql = require('mssql');

class GenericSql {

    static ALLOWED_TABLES = {
        'Categoria': ['IdCategoria', 'Nombre', 'Descripcion', 'Activo', 'FechaCreacion', 'FechaModificacion'],
        'Productos': ['IdProducto', 'IdCategoria', 'Nombre', 'Descripcion', 'Precio', 'Stock', 'Activo', 'FechaCreacion', 'FechaModificacion'],
        'Usuarios': ['Id', 'Nombre', 'Email', 'Password','FechaCreacion']
    };

    static validateTable(tableName) {
        if (!this.ALLOWED_TABLES[tableName]) {
            throw new Error('Tabla no permitida');
        }
        return tableName;
    }

    static validateFields(tableName, fields) {
        const allowedFields = this.ALLOWED_TABLES[tableName];
        const invalidFields = fields.filter(f => !allowedFields.includes(f));
        
        if (invalidFields.length > 0) {
            throw new Error(`Campos no permitidos: ${invalidFields.join(', ')}`);
        }
    }


    static async findAll(tableName) {
    try {
        this.validateTable(tableName); 
        
        const pool = await connection.getConnection();
        
        const query = `
            SELECT * FROM ${tableName}
            WHERE Activo = 1
            ORDER BY FechaCreacion DESC
        `;
        
        const result = await pool.request().query(query);
        
        return result.recordset;
        
    } catch (error) {
        console.error('Error en findAll:', error);
        throw error;
    }
}

    // CREATE
    static async create(tableName, data) {
        try {
            this.validateTable(tableName);
            
            const pool = await connection.getConnection();
            const request = pool.request();
            
            const columns = Object.keys(data);
            this.validateFields(tableName, columns);
            
            // Agregar FechaCreacion
            columns.push('FechaCreacion');
            data.FechaCreacion = new Date();
            
            // Crear parámetros
            const paramNames = columns.map((col, i) => `@param${i}`);
            const paramPlaceholders = paramNames.join(', ');
            const columnNames = columns.join(', ');
            
            // Agregar valores como parámetros
            columns.forEach((col, i) => {
                request.input(`param${i}`, data[col]);
            });
            
            const query = `
                INSERT INTO ${tableName} (${columnNames}) 
                OUTPUT INSERTED.*
                VALUES (${paramPlaceholders})
            `;
            
            const result = await request.query(query);
            return result.recordset[0];
            
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    // FIND BY ID
    static async findByGeneric(codigo, tabla) {
        try {
            this.validateTable(tabla);
            
            const pool = await connection.getConnection();
            const request = pool.request();
            
            // Determinar columna ID según tabla
            let idColumn = 'Id';
            if (tabla === 'Categoria') idColumn = 'IdCategoria';
            if (tabla === 'Productos') idColumn = 'IdProducto';
            
            request.input('id', sql.Int, codigo);
            
            const query = `SELECT * FROM ${tabla} WHERE ${idColumn} = @id`;
            const result = await request.query(query);
            
            return result.recordset[0] || null;
            
        } catch (error) {
            console.error('Error en findByGeneric:', error);
            throw error;
        }
    }

    // UPDATE
    static async update(id, tableName, data) {
        try {
            this.validateTable(tableName);
            
            const pool = await connection.getConnection();
            const request = pool.request();
            
            const columns = Object.keys(data);
            this.validateFields(tableName, columns);
            
            // Agregar FechaModificacion
            columns.push('FechaModificacion');
            data.FechaModificacion = new Date();
            
            // Crear SET clause
            const setClause = columns.map((col, i) => {
                request.input(`param${i}`, data[col]);
                return `${col} = @param${i}`;
            }).join(', ');
            
            // Determinar columna ID
            let idColumn = 'Id';
            if (tableName === 'Categoria') idColumn = 'IdCategoria';
            if (tableName === 'Productos') idColumn = 'IdProducto';
            
            request.input('id', sql.Int, id);
            
            const query = `
                UPDATE ${tableName}
                SET ${setClause}
                OUTPUT INSERTED.*
                WHERE ${idColumn} = @id
            `;
            
            const result = await request.query(query);
            return result.recordset[0];
            
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    // DELETE
    static async delete(tabla, id) {
        try {
            this.validateTable(tabla);
            
            const pool = await connection.getConnection();
            const request = pool.request();
            
            // Determinar columna ID
            let idColumn = 'Id';
            if (tabla === 'Categoria') idColumn = 'IdCategoria';
            if (tabla === 'Productos') idColumn = 'IdProducto';
            
            request.input('id', sql.Int, id);
            
            const query = `DELETE FROM ${tabla} WHERE ${idColumn} = @id`;
            const result = await request.query(query);
            
            return result.rowsAffected[0] > 0;
            
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    // PAGINACIÓN
    static async findWithPagination(page = 1, limit = 10,sortBy, sortDir, search='',filtros = {}, tabla) {
        try {
            this.validateTable(tabla);
            var joinCondition = '';
            let selectClause = '*';
            let orderByClause = '';
            let whereClause = '';
            let countWhereClause = '';
            
           if (sortBy && sortBy.length > 0 && sortDir && sortDir.length > 0) {
           
            const validSortDir = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            const allowedSortFields = ['FechaCreacion', 'Nombre', 'Precio', 'Stock', 'IdProducto'];
            if (allowedSortFields.includes(sortBy)) {
                orderByClause = `ORDER BY ${sortBy} ${validSortDir}`;
            } else {
                orderByClause = 'ORDER BY FechaCreacion DESC';
            }
        } else {
            orderByClause = 'ORDER BY FechaCreacion DESC';
        }
            let countWhere = 'WHERE Activo = 1';
            if(tabla ==='Productos'){
                joinCondition = 'INNER JOIN Categoria C ON P.IdCategoria = C.IdCategoria';
                selectClause = 'P.*, C.Nombre AS CategoriaNombre, C.IdCategoria AS CatId';
                countWhere = 'INNER JOIN Categoria C ON Productos.IdCategoria = C.IdCategoria WHERE P.Activo = 1';
                 if (search && search.length > 0) {
                      whereClause += ` AND (
                    P.Nombre LIKE @search OR 
                    P.Descripcion LIKE @search OR 
                    P.IdProducto LIKE @search OR
                    C.Nombre LIKE @search
                )`;
                 countWhereClause = `INNER JOIN Categoria C ON Productos.IdCategoria = C.IdCategoria 
                                    WHERE Productos.Activo = 1 
                                    AND (
                                        Productos.Nombre LIKE @search OR 
                                        Productos.Descripcion LIKE @search OR 
                                        Productos.IdProducto LIKE @search OR
                                        C.Nombre LIKE @search
                                    )`;
                 } else {
                    countWhereClause = 'INNER JOIN Categoria C ON Productos.IdCategoria = C.IdCategoria WHERE Productos.Activo = 1';
                }
           
            }else{
                if (search && search.length > 0) {
                whereClause += ` AND (P.Nombre LIKE @search OR P.Descripcion LIKE @search)`;
                countWhereClause += ` AND (Nombre LIKE @search OR Descripcion LIKE @search)`;
            }
            }
            console.log('whereClause:', whereClause);
            console.log('countWhereClause:', countWhereClause);
            const pool = await connection.getConnection();
            const offset = (page - 1) * limit;
            
            // Query de datos
            const dataRequest = pool.request();
            const countRequest = pool.request();
             if (tabla === 'Productos' && filtros) {
                if (filtros.nombre && filtros.nombre.length > 0) {
                whereClause += ` AND P.Nombre LIKE @nombre`;
                countWhereClause += ` AND Productos.Nombre LIKE @nombre`;
                dataRequest.input('nombre', sql.NVarChar, `%${filtros.nombre}%`);
                countRequest.input('nombre', sql.NVarChar, `%${filtros.nombre}%`);
            }
            
            // Filtro por precio mínimo
            if (filtros.precioMin !== null && !isNaN(filtros.precioMin)) {
                whereClause += ` AND P.Precio >= @precioMin`;
                countWhereClause += ` AND Productos.Precio >= @precioMin`;
                dataRequest.input('precioMin', sql.Decimal(10, 2), filtros.precioMin);
                countRequest.input('precioMin', sql.Decimal(10, 2), filtros.precioMin);
            }
            
            // Filtro por precio máximo
            if (filtros.precioMax !== null && !isNaN(filtros.precioMax)) {
                whereClause += ` AND P.Precio <= @precioMax`;
                countWhereClause += ` AND Productos.Precio <= @precioMax`;
                dataRequest.input('precioMax', sql.Decimal(10, 2), filtros.precioMax);
                countRequest.input('precioMax', sql.Decimal(10, 2), filtros.precioMax);
            }
            
            // Filtro por categoría
            if (filtros.idCategoria !== null && !isNaN(filtros.idCategoria)) {
                whereClause += ` AND P.IdCategoria = @idCategoria`;
                countWhereClause += ` AND Productos.IdCategoria = @idCategoria`;
                dataRequest.input('idCategoria', sql.Int, filtros.idCategoria);
                countRequest.input('idCategoria', sql.Int, filtros.idCategoria);
            }
             }

            dataRequest.input('limit', sql.Int, limit);
            dataRequest.input('offset', sql.Int, offset);
             if (search && search.length > 0) {
                dataRequest.input('search', sql.NVarChar, `%${search}%`);
                }
            

            const dataQuery = `
            SELECT ${selectClause} FROM ${tabla} P
            ${joinCondition}
            ${whereClause}
            ${orderByClause}
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `;
        
            console.log('Data Query:', dataQuery);
            console.log('Search Term:', search);
            console.log(dataQuery);

             
            
            // Query de conteo
            const countQuery = `SELECT COUNT(*) as total FROM ${tabla} ${countWhere.replace('P.Activo', 'Productos.Activo')}`;
            
            const [dataResult, countResult] = await Promise.all([
                dataRequest.query(dataQuery),
                pool.request().query(countQuery)
            ]);
            
            const total = countResult.recordset[0].total;
            const totalPages = Math.ceil(total / limit);
            
            return {
                data: dataResult.recordset,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalRecords: total,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
            
        } catch (error) {
            console.error('Error en findWithPagination:', error);
            throw error;
        }
    }

    // BÚSQUEDA CON LIKE
    static async findWithPaginationWord(page = 1, limit = 10, tabla, word, campos = []) {
        try {
            this.validateTable(tabla);
            this.validateFields(tabla, campos);
            
            const pool = await connection.getConnection();
            const offset = (page - 1) * limit;
            
            // Crear condiciones OR con LIKE
            const conditions = campos.map((campo, i) => {
                return `${campo} LIKE @search${i}`;
            }).join(' OR ');
            
            // Query de datos
            const dataRequest = pool.request();
            dataRequest.input('limit', sql.Int, limit);
            dataRequest.input('offset', sql.Int, offset);
            
            // Agregar parámetros de búsqueda
            campos.forEach((campo, i) => {
                dataRequest.input(`search${i}`, sql.NVarChar, `%${word}%`);
            });
            
            const dataQuery = `
                SELECT * FROM ${tabla}
                WHERE (${conditions}) AND Activo = 1
                ORDER BY FechaCreacion DESC
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY
            `;
            
            // Query de conteo
            const countRequest = pool.request();
            campos.forEach((campo, i) => {
                countRequest.input(`search${i}`, sql.NVarChar, `%${word}%`);
            });
            
            const countQuery = `
                SELECT COUNT(*) as total FROM ${tabla} 
                WHERE (${conditions}) AND Activo = 1
            `;
            
            const [dataResult, countResult] = await Promise.all([
                dataRequest.query(dataQuery),
                countRequest.query(countQuery)
            ]);
            
            const total = countResult.recordset[0].total;
            const totalPages = Math.ceil(total / limit);
            
            return {
                data: dataResult.recordset,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalRecords: total,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
            
        } catch (error) {
            console.error('Error en findWithPaginationWord:', error);
            throw error;
        }
    }

    // FIND BY CAMPO
    static async findByCampo(tabla, campo, valor, tipovalidacion) {
        try {
            this.validateTable(tabla);
            this.validateFields(tabla, [campo]);
            
            const pool = await connection.getConnection();
            const request = pool.request();
            
            request.input('valor', valor);
            
            const query = `SELECT * FROM ${tabla} WHERE ${campo} = @valor`;
            const result = await request.query(query);
            
            const registro = result.recordset[0];
            
            if (tipovalidacion == 1) {
                // Validar que NO exista
                if (registro) {
                    throw new Error(`Ya existe un registro con ${campo} = ${valor}`);
                }
                return null;
            } else if (tipovalidacion == 2) {
                // Validar que SÍ exista
                if (!registro) {
                    throw new Error(`No se encontró registro con ${campo} = ${valor}`);
                }
                return registro;
            }
            
            return registro || null;
            
        } catch (error) {
            console.error('Error en findByCampo:', error);
            throw error;
        }
    }


    static async findWithFilters(tableName, filters = {}) {
    try {
        this.validateTable(tableName);
        
        const pool = await connection.getConnection();
        const request = pool.request();
        
        // Parámetros de paginación
        const page = filters.page || 1;
        const pageSize = filters.pageSize || 10;
        const offset = (page - 1) * pageSize;
        
        // Construir condiciones WHERE
        let whereConditions = [];
        
        // Filtro de búsqueda (search)
        if (filters.search) {
            const searchFields = this.getSearchFields(tableName);
            const searchConditions = searchFields.map((field, index) => {
                request.input(`search${index}`, sql.NVarChar, `%${filters.search}%`);
                return `${field} LIKE @search${index}`;
            });
            whereConditions.push(`(${searchConditions.join(' OR ')})`);
        }
        
        // Filtro por categoría
        if (filters.idCategoria) {
            request.input('idCategoria', sql.Int, parseInt(filters.idCategoria));
            whereConditions.push('IdCategoria = @idCategoria');
        }
        
        // Filtro de precio mínimo
        if (filters.precioMin) {
            request.input('precioMin', sql.Decimal(10, 2), parseFloat(filters.precioMin));
            whereConditions.push('Precio >= @precioMin');
        }
        
        // Filtro de precio máximo
        if (filters.precioMax) {
            request.input('precioMax', sql.Decimal(10, 2), parseFloat(filters.precioMax));
            whereConditions.push('Precio <= @precioMax');
        }
        
        // Filtro de activo
        if (filters.activo !== undefined) {
            const activoValue = filters.activo === 'true' || filters.activo === true || filters.activo === 1 ? 1 : 0;
            request.input('activo', sql.Bit, activoValue);
            whereConditions.push('Activo = @activo');
        }
        
        // Construir cláusula WHERE
        const whereClause = whereConditions.length > 0 
            ? `WHERE ${whereConditions.join(' AND ')}` 
            : '';
        
        // Ordenamiento
        const sortBy = filters.sortBy || 'FechaCreacion';
        const sortDir = filters.sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        // Validar campo de ordenamiento
        if (sortBy !== 'FechaCreacion' && sortBy !== 'FechaModificacion') {
            this.validateFields(tableName, [sortBy]);
        }
        
        // Query principal con paginación
        request.input('pageSize', sql.Int, pageSize);
        request.input('offset', sql.Int, offset);
        
        const dataQuery = `
            SELECT * FROM ${tableName}
            ${whereClause}
            ORDER BY ${sortBy} ${sortDir}
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `;
        
        // Query de conteo
        const countQuery = `
            SELECT COUNT(*) as total FROM ${tableName}
            ${whereClause}
        `;
        
        // Ejecutar ambas queries
        const [dataResult, countResult] = await Promise.all([
            request.query(dataQuery),
            // Crear nuevo request para el conteo con los mismos parámetros
            this.executeCountQuery(pool, countQuery, filters)
        ]);
        
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / pageSize);
        
        return {
            data: dataResult.recordset,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalPages: totalPages,
                totalRecords: total,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            filters: filters
        };
        
    } catch (error) {
        console.error('Error en findWithFilters:', error);
        throw error;
    }
}

static async executeCountQuery(pool, countQuery, filters) {
    const countRequest = pool.request();
    
    // Agregar los mismos parámetros que en la query principal
    if (filters.search) {
        const searchFields = this.getSearchFields(filters.tableName || 'Productos');
        searchFields.forEach((field, index) => {
            countRequest.input(`search${index}`, sql.NVarChar, `%${filters.search}%`);
        });
    }
    
    if (filters.idCategoria) {
        countRequest.input('idCategoria', sql.Int, parseInt(filters.idCategoria));
    }
    
    if (filters.precioMin) {
        countRequest.input('precioMin', sql.Decimal(10, 2), parseFloat(filters.precioMin));
    }
    
    if (filters.precioMax) {
        countRequest.input('precioMax', sql.Decimal(10, 2), parseFloat(filters.precioMax));
    }
    
    if (filters.activo !== undefined) {
        const activoValue = filters.activo === 'true' || filters.activo === true || filters.activo === 1 ? 1 : 0;
        countRequest.input('activo', sql.Bit, activoValue);
    }
    
    return await countRequest.query(countQuery);
}

static getSearchFields(tableName) {
    const searchFieldsMap = {
        'Productos': ['Nombre', 'Descripcion'],
        'Categoria': ['Nombre', 'Descripcion'],
        'Usuarios': ['Nombre', 'Email', 'Correo']
    };
    
    return searchFieldsMap[tableName] || ['Nombre'];
}

}

module.exports = GenericSql;