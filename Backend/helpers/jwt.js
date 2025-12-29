const jwt = require("jwt-simple");

const secret = "Clave de mi backend de Node usando Postgres";

const  createToken = (user) =>{
    let now = Math.floor(Date.now()/1000);
    let expiration = now +30*24*60*60;
    let payLoad = {
        id : user._id,
        name: user.name, 
        email:user.email, 
        iat: now, 
        exp: expiration
    };

    return  jwt.encode(payLoad,secret);
}

module.exports={
    createToken,
    secret
}