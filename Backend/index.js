const express = require("express");
const cors = require("cors");
const connection= require("./Database/connection");

const userRoutes= require("../Backend/Routes/Usuario");
const csvRoutes = require("./Routes/Csv");
const CategoriaRoutes = require("../Backend/Routes/Categorias");
const ProductosRoutes = require("../Backend/Routes/Productos");
const app= express();

const fs = require('fs');
const port = 3899;
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Tu Next.js
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};


app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use("/api/user",userRoutes);
app.use("/api/", csvRoutes);
app.use("/api",CategoriaRoutes);
app.use("/api",ProductosRoutes);


if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}



connection.conectar()
    .then(() => {
        app.listen(port, () => {
            console.log(`✓ Servidor corriendo en http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar:', err);
    });

//connection.conectar();
//diagnosticar.diagnosticar();