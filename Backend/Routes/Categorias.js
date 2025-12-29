

const express = require("express");

const router = express.Router();
const {auth} =require("../middelwares/auth.js");
const CategoriaController = require("../Controllers/Categoria");

router.post("/categorias",auth,CategoriaController.GuardarCategorias);
router.get("/categorias/",auth,CategoriaController.ListarTodasCategorias);
//router.get("/categorias/buscar/:page?/:limit?/:search?",auth,CategoriaController.BuscarCategoria);
router.put("/categorias/:id",auth,CategoriaController.ActualizarCategoria);
router.delete("/categorias/:id",auth,CategoriaController.BorrarCategoria);
router.get("/categorias/:page/:limit/:search", CategoriaController.BuscarCategoria);




module.exports = router;
