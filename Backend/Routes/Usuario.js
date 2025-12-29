const express = require("express");

const router = express.Router();

const UserController = require("../Controllers/Usuario");
const {auth} =require("../middelwares/auth.js");

router.post("/register",UserController.register);
router.post("/login",UserController.login);

router.get("/profile/:id",auth,UserController.profile);
//router.put("/update",auth,UserController.update);
//router.put("/changepsw",auth,UserController.changePassword);



module.exports = router;