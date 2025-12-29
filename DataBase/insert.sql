SET IDENTITY_INSERT Productos ON;

INSERT INTO Categoria (Nombre, Descripcion)
VALUES
( 'Alimentos', 'Alimentos'),
( 'Bebidas', 'Bebidas'),
( 'Aseo', 'Aseo'),
( 'Tecnología', 'Tecnologia'),
( 'Ropa', 'Ropa');



INSERT INTO Productos (IdProducto, IdCategoria, Nombre, Descripcion, Precio, Stock, Activo, FechaCreacion, FechaModificacion)
VALUES
(1, 1, 'Arroz Diana 1Kg', 'Arroz premium colombiano', 4200, 50, 1, GETDATE(), GETDATE()),
(2, 1, 'Aceite Girasol 1L', 'Aceite comestible vegetal', 9500, 30, 1, GETDATE(), GETDATE()),
(3, 1, 'Frijol Cargamanto 500g', 'Grano seleccion premium', 3800, 40, 1, GETDATE(), GETDATE()),
(4, 1, 'Harina de Trigo 1Kg', 'Ideal para panadería', 3100, 35, 1, GETDATE(), GETDATE()),
(5, 1, 'Atún en Agua 160g', 'Lata de atún premium', 6000, 22, 1, GETDATE(), GETDATE()),
(6, 1, 'Pasta Spaghetti 500g', 'Pasta de trigo duro', 4500, 42, 1, GETDATE(), GETDATE()),
(7, 1, 'Sal Refinada 1Kg', 'Sal para cocina', 2200, 60, 1, GETDATE(), GETDATE()),
(8, 1, 'Azúcar Blanca 1Kg', 'Azúcar premium nacional', 4100, 48, 1, GETDATE(), GETDATE()),
(9, 1, 'Cereal Corn Flakes 300g', 'Desayuno nutritivo', 8500, 25, 1, GETDATE(), GETDATE()),
(10,1, 'Galletas Festival', 'Sabor a vainilla', 3500, 55, 1, GETDATE(), GETDATE()),

(11, 2, 'Gaseosa Coca-Cola 1.5L', 'Bebida carbonatada', 6500, 40, 1, GETDATE(), GETDATE()),
(12, 2, 'Agua Cristal 600ml', 'Agua natural purificada', 2000, 80, 1, GETDATE(), GETDATE()),
(13, 2, 'Jugo Hit Mango 1L', 'Bebida de fruta', 3500, 45, 1, GETDATE(), GETDATE()),
(14, 2, 'Cerveza Poker 330ml', 'Cerveza nacional', 2800, 90, 1, GETDATE(), GETDATE()),
(15, 2, 'Energética Red Bull 250ml', 'Bebida energizante', 9000, 20, 1, GETDATE(), GETDATE()),
(16, 2, 'Leche Alquería 1L', 'Leche entera larga vida', 5200, 50, 1, GETDATE(), GETDATE()),
(17, 2, 'Té Lipton 500ml', 'Té helado sabor limón', 4500, 35, 1, GETDATE(), GETDATE()),
(18, 2, 'Yogurt Griego 150g', 'Yogurt natural cremoso', 4800, 26, 1, GETDATE(), GETDATE()),
(19, 2, 'Agua con Gas 600ml', 'Agua mineral natural', 2300, 60, 1, GETDATE(), GETDATE()),
(20, 2, 'Gatorade Azul 500ml', 'Bebida hidratante', 5200, 32, 1, GETDATE(), GETDATE()),

(21, 3, 'Jabón Rey', 'Jabón para ropa', 2200, 100, 1, GETDATE(), GETDATE()),
(22, 3, 'Detergente Ariel 1Kg', 'Detergente en polvo', 9800, 45, 1, GETDATE(), GETDATE()),
(23, 3, 'Shampoo Savital 350ml', 'Control caída', 6500, 38, 1, GETDATE(), GETDATE()),
(24, 3, 'Crema Dental Colgate 100ml', 'Protección total', 4800, 60, 1, GETDATE(), GETDATE()),
(25, 3, 'Toallas Húmedas Huggies', 'Cuidado infantil', 9500, 28, 1, GETDATE(), GETDATE()),
(26, 3, 'Papel Higiénico Familia 12u', 'Ultra suave', 16000, 30, 1, GETDATE(), GETDATE()),
(27, 3, 'Lavaloza Axion 500ml', 'Desengrasa fácil', 5300, 50, 1, GETDATE(), GETDATE()),
(28, 3, 'Jabón Líquido Protex 250ml', 'Antibacterial', 8300, 25, 1, GETDATE(), GETDATE()),
(29, 3, 'Ambientador Glade', 'Aroma lavanda', 9900, 20, 1, GETDATE(), GETDATE()),
(30, 3, 'Cloro 1L', 'Desinfectante multiusos', 4100, 50, 1, GETDATE(), GETDATE()),

(31, 4, 'Smartphone Samsung A15', 'Teléfono inteligente Android', 850000, 10, 1, GETDATE(), GETDATE()),
(32, 4, 'Audífonos Bluetooth Xiaomi', 'Auriculares inalámbricos', 65000, 35, 1, GETDATE(), GETDATE()),
(33, 4, 'Teclado Logitech', 'Teclado USB', 50000, 20, 1, GETDATE(), GETDATE()),
(34, 4, 'Mouse Inalámbrico Genius', 'Mouse óptico inalámbrico', 36000, 28, 1, GETDATE(), GETDATE()),
(35, 4, 'Memoria USB 32GB Kingston', 'Almacenamiento portátil', 28000, 60, 1, GETDATE(), GETDATE()),
(36, 4, 'Monitor LG 24"', 'Pantalla LED Full HD', 580000, 8, 1, GETDATE(), GETDATE()),
(37, 4, 'Laptop HP 15"', 'Portátil para oficina', 2100000, 6, 1, GETDATE(), GETDATE()),
(38, 4, 'Disco Duro 1TB WD', 'HDD externo', 230000, 15, 1, GETDATE(), GETDATE()),
(39, 4, 'Cable HDMI 2m', 'Cable de video digital', 15000, 50, 1, GETDATE(), GETDATE()),
(40, 4, 'Router TP-Link', 'Router WiFi 2.4Ghz', 98000, 12, 1, GETDATE(), GETDATE()),

(41, 5, 'Camisa Hombre Talla M', 'Camisa formal manga larga', 45000, 20, 1, GETDATE(), GETDATE()),
(42, 5, 'Jean Mujer Skinny', 'Tela stretch', 82000, 15, 1, GETDATE(), GETDATE()),
(43, 5, 'Camiseta Deportiva Unisex', 'Tela transpirable', 38000, 30, 1, GETDATE(), GETDATE()),
(44, 5, 'Chaqueta Impermeable', 'Para clima frío', 150000, 8, 1, GETDATE(), GETDATE()),
(45, 5, 'Zapatos Deportivos Nike', 'Running básicos', 240000, 10, 1, GETDATE(), GETDATE()),
(46, 5, 'Gorra Negra Adidas', 'Unisex', 45000, 25, 1, GETDATE(), GETDATE()),
(47, 5, 'Sudadera Jogger', 'Algodón suave', 69000, 18, 1, GETDATE(), GETDATE()),
(48, 5, 'Medias Deportivas 6 Pares', 'Algodón reforzado', 27000, 40, 1, GETDATE(), GETDATE()),
(49, 5, 'Pantaloneta Deportiva', 'Secado rápido', 39000, 22, 1, GETDATE(), GETDATE()),
(50, 5, 'Reloj Casio', 'Resistente al agua', 120000, 12, 1, GETDATE(), GETDATE())


SET IDENTITY_INSERT Productos OFF;