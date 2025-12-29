const validator = require("validator"); 
const validate = (params) => {
    let validation = false;
     console.log(params);
    let Nombre = !validator.isEmpty(params.Nombre || "") &&
        validator.isLength(params.Nombre || "", { min: 3, max: 50 }) &&
        validator.isAlpha(params.Nombre.replace(/\s/g, ""), "es-ES");

    let Descripcion = !validator.isEmpty(params.Descripcion || "") &&
        validator.isLength(params.Descripcion || "", { min: 3, max: 150 });
   
    
    if (!Nombre || !Descripcion) {
        console.log(Nombre, Descripcion);
        throw new Error("No se ha superado la validacion");
    } else {
        console.log("validacion superada");
        validation = true;
    }

    return validation;
}

module.exports = validate;