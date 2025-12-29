/*GET
/api/productos?page=1&pageSize=10&search=teclado&idCategoria=3&precioMin=100
&precioMax=500&activo=true&sortBy=precio&sortDir=asc
• GET /api/productos/{id}
• POST /api/productos
• POST /api/productosMasivo
• PUT /api/productos/{id}*/


const express = require("express");

const router = express.Router();
const {auth} =require("../middelwares/auth.js");
const ProductoController = require("../Controllers/Productos");

router.get('/', 
    auth,ProductoController.ListarConFiltros
);

router.post("/productos",auth,ProductoController.GuardarProductos);
router.get("/productos/",auth,ProductoController.ListarProductos);

router.put("/productos/:id",auth,ProductoController.ActualizarProducto);
router.delete("/productos/:id",auth,ProductoController.BorrarProducto);
router.get("/productos/:page/:limit/:search", ProductoController.BuscarProducto);




module.exports = router;