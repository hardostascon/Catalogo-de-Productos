const sql = require('mssql');

// Configuración de la conexión
const config = {
    user: 'Hardos',
    password: '12345', 
    server: 'HARDOS', 
    database: 'Catalgo',
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};
 
let poolConnection = null;
// Conectar 
async function conectar() {
    try {
        if (poolConnection) {
            console.log('Ya existe una conexión activa');
            return poolConnection;
        }
        
        poolConnection = await sql.connect(config);
        console.log('✓ Conectado a SQL Server');
        return poolConnection;
        
    } catch (err) {
        console.error('✗ Error de conexión:', err);
        throw err;
    }
}

// Obtener la conexión (esta es la función que falta)
async function getConnection() {
    if (!poolConnection) {
        await conectar();
    }
    return poolConnection;
}

// Cerrar conexión
async function cerrarConexion() {
    try {
        if (poolConnection) {
            await poolConnection.close();
            poolConnection = null;
            console.log('Conexión cerrada');
        }
    } catch (err) {
        console.error('Error al cerrar conexión:', err);
    }
}

module.exports = {
    conectar,
    getConnection, // ← Esta es la función que necesitas
    cerrarConexion,
    sql
};
