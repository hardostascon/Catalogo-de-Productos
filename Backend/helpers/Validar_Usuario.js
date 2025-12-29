const validator = require("validator");

const validate = (params,withPassword=true ,withName=true) => {
    let validation = false;
    let name = true;
    
      if(withPassword){
        let name = !validator.isEmpty(params.Nombre) &&
        validator.isLength(params.Nombre, { min: 3, max: 50 }) &&
        validator.isAlpha(params.Nombre, "es-ES");
        console.log(params);
      }
    
   // console.log("params", params.email);
    let email = !validator.isEmpty(params.Email) &&
        validator.isEmail(params.Email);

    let Password = true;
    if(withPassword){
    let password = !validator.isEmpty(params.Password) &&
        validator.isLength(params.Password, { min: 6, max: 150 }) 
        ;
    }


    if (!name || !email || !Password) {
        throw new Error("No se ha superado la validacion");

    } else {
        console.log("validacion superada");
        validation = true;
    }

    return validate;
}



module.exports = validate;