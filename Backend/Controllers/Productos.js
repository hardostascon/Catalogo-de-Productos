const path = require("path");

const GenericSql = require('../Repositories/Generics');
const validate = require("../helpers/validate-Producto");
const GuardarProductos = async (req, res) => {
     let body = req.body;
     try {

          validate(body);



          try {
               let ProductoToSave = await GenericSql.create('Productos',body,{selectFields: ['IdCategoria', 'Nombre', 'Descripcion', 'Precio', 'Stock', 'Activo', 'FechaCreacion', 'FechaModificacion']});
               if (!ProductoToSave) {
                    return res.status(500).json({
                         status: "error",
                         message: "Error al guardar los productos"
                    });
               } else {
                    return res.status(200).json({
                         status: 200,
                         ProductoToSave,
                         message: "Producto guardado correctamente"
                    })
               }
          } catch (e) {
               console.log(e);
          }

     } catch (error) {
          console.log(error);
          return res.status(500).json({
               status: 500,
               message: "Error al guardar el producto"
          })
     }
    
}

 const ListarConFiltros = async (req, res) =>  {
        try {
            const filters = {
                page: parseInt(req.query.page) || 1,
                pageSize: parseInt(req.query.pageSize) || 10,
                search: req.query.search,
                idCategoria: req.query.idCategoria,
                precioMin: req.query.precioMin,
                precioMax: req.query.precioMax,
                activo: req.query.activo,
                sortBy: req.query.sortBy || 'FechaCreacion',
                sortDir: req.query.sortDir || 'DESC',
                tableName: 'Productos' // Para el helper
            };
            
            const result = await GenericSql.findWithFilters('Productos', filters);
            
            return res.status(200).json({
                status: 'success',
                ...result
            });
            
        } catch (error) {
            console.error('Error en listWithFilters:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener productos',
                error: error.message
            });
        }
    }


const ListarProductos = async (req, res) => {
    /*let page = req.params.page ? parseInt(req.params.page) : 1;
     let limit = req.params.limit ? parseInt(req.params.limit) : 10;
     let sortBy = req.params.sortField ? req.params.sortField : 'FechaCreacion';
     let sortDir = req.params.sortOrder ? req.params.sortOrder : 'DESC';
     console.log(req);*/
     let page = req.query.page ? parseInt(req.query.page) : 1;
     let limit = req.query.limit ? parseInt(req.query.limit) : 10;
     let sortBy = req.query.sortField ? req.query.sortField : 'FechaCreacion';
     let sortDir = req.query.sortOrder ? req.query.sortOrder : 'DESC';
     let search = req.query.search ? req.query.search.trim() : '';
     let filtros = {
          nombre: req.query.nombre ? req.query.nombre.trim() : '',
          precioMin: req.query.precioMin ? parseFloat(req.query.precioMin) : null,
          precioMax: req.query.precioMax ? parseFloat(req.query.precioMax) : null,
          idCategoria: req.query.idCategoria ? parseInt(req.query.idCategoria) : null
     };
     console.log(filtros);
     
     try {
          
          const Productos = await GenericSql.findWithPagination(page, limit, sortBy, sortDir, search, filtros, 'Productos');
          console.log(Productos.pagination);
          if (!Productos) {
               return res.status(404).json({
                    status: "error",
                    message: "No se encontraron los productos"
               });
          } else {
               return res.status(200).json({
                    status: 200,
                    data: Productos.data,
                    pagination: Productos.pagination,
                    message: "Productos listados correctamente"
               })
          }

     } catch(error){
          console.log(error);
          return res.status(500).json({
               status: 500,
               message: "Error al listar los productos"
          })
     }
    
}


const ActualizarProducto = async (req, res) => {
     let body = req.body;
     const id = req.params.id;
     try {

          validate(body);


          try {
              
               const existingProducto = await GenericSql.findByGeneric(id,'Productos');
               if (!existingProducto) {

                    return res.status(404).json({
                         status: "error",
                         message: "Producto no encontrado"
                    });
               }
              
               const updatedProducto = await GenericSql.update(id,'Productos', body,{selectFields: [ 'Nombre', 'Descripcion', 'Precio', 'Stock', 'Activo', 'FechaModificacion']});

               if (!updatedProducto) {

                    return res.status(500).json({
                         status: "error",
                         message: "Error al actualizar el producto"
                    });
               } else {
                    return res.status(200).json({
                         status: 200,
                         updatedProducto,
                         message: "datos actualizados correctamente"
                    })
               }

          } catch (error) {

               return res.status(500).json({
                    status: 500,
                    message: "Error al actualizar el producto"
               })
          }

     } catch (error) {
          console.log(error);
          return res.status(500).json({
               status: 500,
               message: "Error al actualizar el producto"
          })
     }

}


const BorrarProducto = async (req, res) => {
     const id = req.params.id;
     console.log(id);
     try {
          const existingProducto = await GenericSql.findByGeneric(id,'Productos');
          if (!existingProducto) {

               return res.status(404).json({
                    status: "error",
                    message: "Producto no encontrado"
               });
          }

          const deletedProducto =  await GenericSql.delete('Productos',id);
          if (!deletedProducto) {
               return res.status(500).json({
                    status: "error",
                    message: "Error al borrar el producto"
               });
          } else {
               return res.status(200).json({
                    status: 200,
                    message: "Producto borrado correctamente"
               })
          }

     }
     catch (error) {
          console.log(error);
          return res.status(500).json({
               status: 500,
               message: "Error al borrar el producto"
          })
     }


}


const BuscarProducto = async (req, res) => {
      let page = req.params.page ? parseInt(req.params.page) : 1;
      let limit = req.params.limit ? parseInt(req.params.limit) : 10;
      let word = req.params.search ? req.params.search : '-1';
     try{
            campos = ['IdProducto', 'IdCategoria', 'Nombre', 'Descripcion', 'Precio', 'Stock', 'Activo', 'FechaCreacion', 'FechaModificacion'];
            const productos = await GenericSql.findWithPaginationWord(page, limit,'Productos',word,campos);
          if (!productos) {
               return res.status(404).json({
                    status: "error",
                    message: "No se encontraron productos"
               });
          } else {
               return res.status(200).json({
                    status: 200,
                    productos,
                    message: "Productos listados correctamente"
               })
          }

     }catch(e){
           console.log(e);
           return res.status(500).json({
               status: 500,
               message: "Error al generar La consulta"
          })
     }

     
}




module.exports = {
     GuardarProductos,
     ListarProductos,
     ActualizarProducto,
     BorrarProducto,
     BuscarProducto,
     ListarConFiltros
    
}