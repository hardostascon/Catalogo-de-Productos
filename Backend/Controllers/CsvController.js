const CsvService = require('../Services/CsvService');

class CsvController {
    
    // Cargar productos desde CSV
    static async uploadProductos(req, res) {
        try {
            const products = JSON.parse(req.body.products)
            const file = req.file // <-- Aquí llega el CSV

             console.log("📦 Productos recibidos:", products)
             console.log("📂 Nombre archivo:", file.originalname)
            if (!req.file) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se proporcionó archivo'
                });
            }
            
            const filePath = req.file.path;
            
            // Mapeo de columnas CSV a columnas de BD
            const columnMapping = {
                'Nombre': 'Nombre',
                'Descripcion': 'Descripcion',
                'idCategoria': 'idCategoria',
                'Precio': 'Precio',
                'stock': 'stock'
            };
            
            const result = await CsvService.processCsv(
                filePath, 
                'Productos', 
                columnMapping
            );
            
            return res.status(200).json({
                status: 'success',
                message: 'Archivo procesado correctamente',
                data: result
            });
            
        } catch (error) {
            console.error('Error en uploadProductos:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al procesar archivo',
                error: error.message
            });
        }
    }
    
    // Cargar categorías desde CSV
    static async uploadCategorias(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se proporcionó archivo'
                });
            }
            
            const filePath = req.file.path;
            
            const columnMapping = {
                'nombre': 'Nombre',
                'descripcion': 'Descripcion'
            };
            
            const result = await CsvService.processCsv(
                filePath, 
                'Categoria', 
                columnMapping
            );
            
            return res.status(200).json({
                status: 'success',
                message: 'Categorías cargadas correctamente',
                data: result
            });
            
        } catch (error) {
            console.error('Error en uploadCategorias:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al procesar archivo',
                error: error.message
            });
        }
    }
}

module.exports = CsvController;