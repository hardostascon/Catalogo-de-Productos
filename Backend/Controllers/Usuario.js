const validate = require("../helpers/Validar_Usuario");
const GenericSql = require('../Repositories/Generics');
//const user = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("../helpers/jwt");


const register = async (req, res) => { 

     let body = req.body;
     console.log(body);

     try {

          validate(body);

     } catch (error) {

          return res.status(400).json({
               status: "error",
               message: "Validacion de usuario no superada",
               error: error.message

          });

     }

     try { 
          console.log(body.email);
          const existingUser = await GenericSql.findByCampo('Usuarios','Email',body.Email, 1);
            

     } catch (e) {
          console.log(e);
          return res.status(400).json({
               status: "error",
               message: "El usuario ya esta registrado"


          });
     }

     let Password = await bcrypt.hash(body.Password, 10);
     body.Password = Password;
     body.Email = body.Email.toLowerCase();

     try {
          let userToSave = await GenericSql.create('Usuarios',body,{selectFields: [ 'Id', 'Nombre', 'Correo', 'Email', 'Password','FechaCreacion']});  
         
         
     } catch (e) {
          console.log(e);
     }


     return res.status(200).json({
          status: 200,
          message: "Accion Para registrar usuario",
          data: body
     })
}


const login = async (req, res) => {

     let body = req.body;
     if (!body.Email || !body.Password) {
          return res.status(400).json({
               status: "error",
               message: "Falta Datos por enviar"
          });

     }


     try {
          console.log(body.email);
          const User = await GenericSql.findByCampo('Usuarios','Email',body.Email, 2);

          let pwd = bcrypt.compareSync(body.Password, User.Password);

          if (!pwd) {
               return res.status(400).json({
                    status: "error",
                    message: "Contraseña no valida"
               });
          }
          let token = jwt.createToken(User);

          return res.status(200).json({
               status: 200,
               message: "Accion Para Identificar usuario",
               user: {
                    _id: User.Id,
                    name: User.Nombre,
                    email: User.Email
               },
               token
          });


     } catch (e) {
          console.log(e);
          return res.status(400).json({
               status: "error",
               message: "El usuario al buscar el usuario"


          });
     }

}


const profile = async (req, res) => {

     let id = req.params.id;
     try {

          const user = await GenericSql.findByGeneric(id,'Usuarios');
          if (!user) {
               return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
               });
          }

          return res.status(200).json({
               status: "success",
               user: user
          })

     } catch (e) {
          return res.status(404).json({
               success: false,
               message: 'Error al buscar el usuario!!'
          });
     }

}


const update = async (req, res) => {
     try {
          const UserIdentiy = req.user;
          // console.log(req.user);
          let userToUpdate = {
               name: req.body.name.toLowerCase() ?? UserIdentiy.name,
               email: req.body.email.toLowerCase() ?? UserIdentiy.email


          }
          validate(userToUpdate, false);
          const user = await  GenericSql.findByCampo('users','email',userToUpdate.email, 2);

           

          console.log(UserIdentiy);
          console.log("ttt" + UserIdentiy.id + "tttt");
          if (user && user._id != UserIdentiy.id) {
               return res.status(400).json({
                    status: "error",
                    message: "El email ya esta en uso por otro usuario"
               });
          }

          //const userUpdated = await UserRepository.update(user._id, userToUpdate);
           console.log(user);
          const userUpdated = GenericSql.update(UserIdentiy.id,'users', userToUpdate,{selectFields: ['id', 'name', 'email','uperfil']});

          return res.status(200).json({
               status: 200,
               message: "Accion Para actualizar usuario",
               UserIdentiy,
               userToUpdate
          })

     } catch (e) {
          console.log(e);
          return res.status(400).json({
               status: "error",
               message: "Error al actualizar el usuario"
          });
     }


}

const changePassword = async (req, res) => {
     try {
          const UserIdentiy = req.user;

          let userToUpdatePsw = {
               password: req.body.password ?? UserIdentiy.password,
               email: req.body.email.toLowerCase() ?? UserIdentiy.email
          }
          validate(userToUpdatePsw, false, false);
          const user = await GenericSql.findByCampo('users','email',userToUpdatePsw.email, 2)
          console.log(req.body.password);
          console.log(user);

          let pwd = bcrypt.compareSync(req.body.password,  user.password);

          if (!pwd) {
               let password = await bcrypt.hash(userToUpdatePsw.password, 10);
               userToUpdatePsw.password = password;
               
          }

          if (user && user._id != UserIdentiy.id) {
               return res.status(400).json({
                    status: "error",
                    message: "El email ya esta en uso por otro usuario"
               });
          }

             
            // const userChangePswd = await UserRepository.updatepswd(user._id, userToUpdatePsw);

            
             const userChangePswd =  GenericSql.update(user.id,'users', userToUpdatePsw,{selectFields: ['id', 'password']});


          return res.status(200).json({
               status: 200,
               message: "Accion Para actualizar contraseña",
               UserIdentiy,
               userToUpdatePsw
          });




     } catch (e) {
          console.log(e);
          return res.status(400).json({
               status: "error",
               message: "Error al cambiar la contraseña"
          });
     }
}



module.exports = {
     register,
     login,
     profile,
     update,
     changePassword
    




}