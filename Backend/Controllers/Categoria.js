const path = require("path");

const GenericSql = require('../Repositories/Generics');
const validate = require("../helpers/validar-Categoria");
const { search } = require("../Routes/Usuario");
const GuardarCategorias = async (req, res) => {
     let body = req.body;
     try {

          validate(body);



          try {
               let CategoriaToSave = await GenericSql.create('Categoria',body,{selectFields: ['Nombre', 'Descripcion', 'Activo', 'FechaCreacion', 'FechaModificacion']});
               if (!CategoriaToSave) {
                    return res.status(500).json({
                         status: "error",
                         message: "Error al guardar la categoria"
                    });
               } else {
                    return res.status(200).json({
                         status: 200,
                         CategoriaToSave,
                         message: "Categoria guardada correctamente"
                    })
               }
          } catch (e) {
               console.log(e);
          }

     } catch (error) {
          console.log(error);
          return res.status(500).json({
               status: 500,
               message: "Error al guardar la categoria"
          })
     }
    
}

const ListarTodasCategorias = async (req, res) => {
       try{
          const categorias = await GenericSql.findAll('Categoria');
           return res.status(200).json({
                status: 'success',
                data: categorias,
                total: categorias.length
            });
       }
         catch(e){
             console.error('Error en list:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener categorías',
                error: error.message
            });
         }
}

const ListarCategorias = async (req, res) => {
     let page = req.params.page ? parseInt(req.params.page) : 1;
     let limit = req.params.limit ? parseInt(req.params.limit) : 10;
     let sortBy = req.params.sortField ? req.params.sortField : 'FechaCreacion';
     let sortDir = req.params.sortOrder ? req.params.sortOrder : 'DESC';
     let search = req.query.search ? req.query.search : '';
     try {

          const marcas = await GenericSql.findWithPagination(page, limit, sortBy, sortDir, search, null, 'Categoria');
          if (!marcas) {
               return res.status(404).json({
                    status: "error",
                    message: "No se encontraron las categorias"
               });
          } else {
               return res.status(200).json({
                    status: 200,
                    marcas,
                    message: "Categorias listadas correctamente"
               })
          }

     } catch(error){
          console.log(error);
          return res.status(500).json({
               status: 500,
               message: "Error al listar las categorias"
          })
     }
    
}


const ActualizarCategoria = async (req, res) => {
     let body = req.body;
     const id = req.params.id;
     console.log(id);
     try {

          validate(body);


          try {
              
               const existingCategoria = await GenericSql.findByGeneric(id,'Categoria');
               if (!existingCategoria) {

                    return res.status(404).json({
                         status: "error",
                         message: "Categoria no encontrada"
                    });
               }
              
               const updatedCategoria = await GenericSql.update(id,'Categoria', body,{selectFields: ['Nombre', 'Descripcion', 'Activo', 'FechaModificacion']});
                
               if (!updatedCategoria) {

                    return res.status(500).json({
                         status: "error",
                         message: "Error al actualizar la categoria"
                    });
               } else {
                    return res.status(200).json({
                         status: 200,
                         updatedCategoria,
                         message: "datos actualizados correctamente"
                    })
               }

          } catch (error) {

               return res.status(500).json({
                    status: 500,
                    message: "Error al actualizar la marca"
               })
          }

     } catch (error) {
          console.log(error);
          return res.status(500).json({
               status: 500,
               message: "Error al actualizar la categoria"
          })
     }

}


const BorrarCategoria = async (req, res) => {
     const id = req.params.id;
     console.log(id);
     try {
          const existingCategoria = await GenericSql.findByGeneric(id,'Categoria');
          if (!existingCategoria) {

               return res.status(404).json({
                    status: "error",
                    message: "Categoria no encontrada"
               });
          }

          const deletedCategoria =  await GenericSql.delete('Categoria',id);
          if (!deletedCategoria) {
               return res.status(500).json({
                    status: "error",
                    message: "Error al borrar la categoria"
               });
          } else {
               return res.status(200).json({
                    status: 200,
                    message: "Categoria borrarda correctamente"
               })
          }

     }
     catch (error) {
          console.log(error);
          return res.status(500).json({
               status: 500,
               message: "Error al borrar la categoria"
          })
     }


}


const BuscarCategoria = async (req, res) => {
      let page = req.params.page ? parseInt(req.params.page) : 1;
      let limit = req.params.limit ? parseInt(req.params.limit) : 10;
      let word = req.params.search ? req.params.search : '-1';
     try{
            campos = ['IdCategoria', 'Nombre', 'Descripcion', 'Activo', 'FechaCreacion', 'FechaModificacion'];
            const categorias = await GenericSql.findWithPaginationWord(page, limit,'Categoria',word,campos);
          if (!categorias) {
               return res.status(404).json({
                    status: "error",
                    message: "No se encontraron categorias"
               });
          } else {
               return res.status(200).json({
                    status: 200,
                    categorias,
                    message: "Categorias listadas correctamente"
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
     GuardarCategorias,
     ListarCategorias,
     ActualizarCategoria,
     BorrarCategoria,
     BuscarCategoria,
     ListarTodasCategorias
    
}