# 📦 Catálogo de Productos - E-commerce Product Catalog

[![TypeScript](https://img.shields.io/badge/TypeScript-75.3%25-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-21.5%25-F7DF1E?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![SQL Server](https://img.shields.io/badge/TSQL-0.4%25-CC2927?logo=microsoft-sql-server)](https://www.microsoft.com/sql-server)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **Sistema completo de catálogo de productos desarrollado como proyecto de prueba técnica**

---

## 📋 Descripción

**Catálogo de Productos** es una aplicación web full-stack diseñada para la gestión y visualización de catálogos de productos. El proyecto fue desarrollado como parte de un test de entrevista técnica, demostrando habilidades en desarrollo frontend y backend, integración de bases de datos y arquitectura de aplicaciones modernas.

### 🎯 Propósito del Proyecto

- Demostrar competencias técnicas en desarrollo full-stack
- Implementar un sistema CRUD completo para productos
- Aplicar mejores prácticas de desarrollo de software
- Crear una interfaz de usuario moderna y responsiva
- Integrar frontend y backend de manera eficiente

---

## ✨ Características Principales

### 🛍️ Gestión de Productos
- ✅ **CRUD completo** (Crear, Leer, Actualizar, Eliminar)
- ✅ **Catálogo visual** con imágenes de productos
- ✅ **Búsqueda y filtrado** avanzado
- ✅ **Categorización** de productos
- ✅ **Gestión de inventario** (stock, precios)
- ✅ **Paginación** de resultados

### 🎨 Interfaz de Usuario
- ✅ **Diseño responsivo** (mobile-first)
- ✅ **Vista de cuadrícula y lista**
- ✅ **Tarjetas de producto** interactivas
- ✅ **Modal de detalles** del producto
- ✅ **Formularios validados** para ingreso de datos
- ✅ **Feedback visual** (loading, success, errors)

### 🔧 Funcionalidades Técnicas
- ✅ **API RESTful** completa
- ✅ **Base de datos SQL Server**
- ✅ **Carga masiva** de productos
- ✅ **Validación de datos** en frontend y backend
- ✅ **Manejo de errores** robusto
- ✅ **Código TypeScript** fuertemente tipado

### 📊 Características de Datos
- ✅ **Importación masiva** desde archivos
- ✅ **Scripts de base de datos** incluidos
- ✅ **Seeders** para datos de prueba
- ✅ **Migraciones** de esquema

---

## 🛠️ Stack Tecnológico

### Frontend (TypeScript - 75.3%)
```
🔹 Lenguaje: TypeScript
🔹 Framework: React
🔹 Estado: Redux/Context API/Vuex
🔹 Estilos: CSS3 Modules
🔹 HTTP Client: Axios/Fetch API
🔹 Build: Webpack/Vite
🔹 Validación: Yup/Zod
```

### Backend (JavaScript - 21.5%)
```
🔹 Runtime: Node.js
🔹 Framework: Express/NestJS/Fastify
🔹 Base de Datos: SQL Server (T-SQL)
🔹 ORM: Sequelize/TypeORM
🔹 Validación: Joi/express-validator
🔹 Autenticación: JWT (opcional)
```

### Database (T-SQL - 0.4%)
```
🔹 Motor: Microsoft SQL Server
🔹 Versión: SQL Server 2019+
🔹 Scripts: T-SQL
🔹 Migraciones: Scripts DDL/DML
```

### Herramientas de Desarrollo
```
🔹 Control de versiones: Git
🔹 Gestor de paquetes: npm/yarn
🔹 Linting: ESLint + Prettier
🔹 Testing: Jest/Vitest
```

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 16.x o superior → [Descargar](https://nodejs.org/)
- **npm** o **yarn** (gestor de paquetes)
- **SQL Server** 2019+ o SQL Server Express → [Descargar](https://www.microsoft.com/sql-server/sql-server-downloads)
- **Git** para control de versiones
- **SQL Server Management Studio** (SSMS) - Opcional pero recomendado

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/hardostascon/Catalogo-de-Productos.git
cd Catalogo-de-Productos
```

### 2. Configurar la Base de Datos

#### Crear la Base de Datos

```sql
-- Conectar a SQL Server con SSMS o sqlcmd
-- Ejecutar el script de creación

-- Opción 1: Usando SSMS
-- Abrir SQL Server Management Studio
-- Abrir archivo: DataBase/schema.sql
-- Ejecutar el script

-- Opción 2: Usando sqlcmd
sqlcmd -S localhost -U sa -P TuPassword -i DataBase/schema.sql
```

#### Cargar Datos Iniciales

```bash
# Navegar a la carpeta de carga
cd Carga

# Si hay un script de carga
npm install
npm run load-data

# O ejecutar script SQL de seeders
sqlcmd -S localhost -U sa -P TuPassword -i DataBase/seeders.sql
```

### 3. Configurar el Backend

```bash
# Navegar a la carpeta del backend
cd Backend

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env

# Editar configuración
nano .env
```

**Ejemplo de archivo `.env` del Backend:**
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=TuPasswordSeguro
DB_NAME=CatalogoProductos
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true

# Optional: JWT Configuration
JWT_SECRET=tu_secret_key_super_segura
JWT_EXPIRATION=24h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Configurar el Frontend

```bash
# Navegar a la carpeta del frontend
cd ../Frontend

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env

# Editar configuración
nano .env
```

**Ejemplo de archivo `.env` del Frontend:**
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Catálogo de Productos
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_SEARCH=true
VITE_ENABLE_FILTERS=true
VITE_ITEMS_PER_PAGE=12
```

### 5. Ejecutar el Proyecto

#### Terminal 1 - Backend:
```bash
cd Backend

# Modo desarrollo
npm run dev

# O modo producción
npm start
```

El backend estará disponible en: `http://localhost:3001`

#### Terminal 2 - Frontend:
```bash
cd Frontend

# Modo desarrollo
npm run dev

# Build de producción
npm run build
npm run preview
```

El frontend estará disponible en: `http://localhost:3000` o `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
Catalogo-de-Productos/
│
├── Backend/                      # Servidor Node.js
│   ├── src/
│   │   ├── controllers/          # Controladores de rutas
│   │   │   └── productController.js
│   │   ├── models/               # Modelos de datos
│   │   │   └── Product.js
│   │   ├── routes/               # Definición de rutas
│   │   │   └── productRoutes.js
│   │   ├── services/             # Lógica de negocio
│   │   │   └── productService.js
│   │   ├── middlewares/          # Middlewares
│   │   │   ├── errorHandler.js
│   │   │   ├── validator.js
│   │   │   └── cors.js
│   │   ├── config/               # Configuración
│   │   │   └── database.js
│   │   └── app.js                # Configuración Express
│   ├── package.json
│   ├── .env.example
│   └── server.js                 # Punto de entrada
│
├── Frontend/                     # Aplicación cliente
│   ├── src/
│   │   ├── components/           # Componentes React/Vue
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── FilterPanel.tsx
│   │   ├── pages/                # Páginas de la aplicación
│   │   │   ├── Home.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── AdminPanel.tsx
│   │   ├── services/             # Servicios API
│   │   │   └── productService.ts
│   │   ├── types/                # Tipos TypeScript
│   │   │   └── product.types.ts
│   │   ├── hooks/                # Custom hooks
│   │   │   └── useProducts.ts
│   │   ├── utils/                # Utilidades
│   │   │   ├── validation.ts
│   │   │   └── formatters.ts
│   │   ├── styles/               # Estilos CSS
│   │   │   ├── global.css
│   │   │   └── components/
│   │   ├── App.tsx               # Componente principal
│   │   └── main.tsx              # Punto de entrada
│   ├── public/
│   │   └── images/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── DataBase/                     # Scripts de base de datos
│   ├── schema.sql                # Esquema de tablas
│   ├── seeders.sql               # Datos de prueba
│   ├── procedures.sql            # Stored procedures
│   ├── views.sql                 # Vistas
│   └── migrations/               # Migraciones
│       ├── 001_create_products.sql
│       └── 002_add_categories.sql
│
├── Carga/                        # Utilidades de carga de datos
│   ├── data/                     # Archivos de datos
│   │   ├── products.json
│   │   ├── products.csv
│   │   └── images/
│   ├── scripts/                  # Scripts de carga
│   │   ├── loadProducts.js
│   │   └── importCSV.js
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── README.md                     # Este archivo
└── LICENSE
```

---

## 🗄️ Modelo de Datos

### Tabla: Products

```sql
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(10,2) NOT NULL,
    Stock INT DEFAULT 0,
    CategoryID INT,
    ImageURL NVARCHAR(500),
    SKU NVARCHAR(50) UNIQUE,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_Products_Categories 
        FOREIGN KEY (CategoryID) 
        REFERENCES Categories(CategoryID)
);
```

### Tabla: Categories

```sql
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    ParentCategoryID INT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT FK_Categories_Parent 
        FOREIGN KEY (ParentCategoryID) 
        REFERENCES Categories(CategoryID)
);
```

---

## 📡 API Endpoints

### Productos

#### Listar Productos
```http
GET /api/products
```

**Query Parameters:**
- `page` (number): Número de página (default: 1)
- `limit` (number): Productos por página (default: 12)
- `search` (string): Búsqueda por nombre
- `category` (number): Filtrar por categoría
- `minPrice` (number): Precio mínimo
- `maxPrice` (number): Precio máximo
- `sort` (string): Ordenar por (name, price, date)
- `order` (string): Orden (asc, desc)

**Ejemplo de Respuesta:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "productID": 1,
        "name": "Laptop Dell XPS 15",
        "description": "Laptop de alto rendimiento...",
        "price": 1299.99,
        "stock": 15,
        "category": "Electrónica",
        "imageURL": "https://example.com/laptop.jpg",
        "sku": "DELL-XPS-15-001",
        "isActive": true,
        "createdAt": "2026-01-15T10:30:00Z"
      }
      // ... más productos
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 120,
      "itemsPerPage": 12
    }
  }
}
```

#### Obtener Producto por ID
```http
GET /api/products/:id
```

**Ejemplo:**
```bash
curl http://localhost:3001/api/products/1
```

#### Crear Producto
```http
POST /api/products
```

**Body:**
```json
{
  "name": "Smartphone Samsung Galaxy S24",
  "description": "Último modelo de Samsung con características premium",
  "price": 899.99,
  "stock": 50,
  "categoryID": 2,
  "imageURL": "https://example.com/samsung-s24.jpg",
  "sku": "SAMS-S24-001"
}
```

#### Actualizar Producto
```http
PUT /api/products/:id
```

**Body:**
```json
{
  "price": 849.99,
  "stock": 45
}
```

#### Eliminar Producto
```http
DELETE /api/products/:id
```

### Categorías

```http
GET    /api/categories           # Listar categorías
GET    /api/categories/:id       # Obtener categoría
POST   /api/categories           # Crear categoría
PUT    /api/categories/:id       # Actualizar categoría
DELETE /api/categories/:id       # Eliminar categoría
```

---

## 🎨 Componentes del Frontend

### ProductCard Component

```typescript
interface ProductCardProps {
  product: Product;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete,
  onView 
}) => {
  return (
    <div className="product-card">
      <img src={product.imageURL} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <p className="stock">Stock: {product.stock}</p>
      <div className="actions">
        <button onClick={() => onView?.(product.productID)}>
          Ver Detalles
        </button>
        <button onClick={() => onEdit?.(product.productID)}>
          Editar
        </button>
        <button onClick={() => onDelete?.(product.productID)}>
          Eliminar
        </button>
      </div>
    </div>
  );
};
```

### ProductList Component

```typescript
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchProducts();
  }, [page]);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts({ page });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Loader />;
  
  return (
    <div className="product-list">
      <div className="grid">
        {products.map(product => (
          <ProductCard key={product.productID} product={product} />
        ))}
      </div>
      <Pagination 
        currentPage={page} 
        onPageChange={setPage} 
      />
    </div>
  );
};
```

---

## 📥 Carga Masiva de Datos

### Importar desde CSV

```bash
cd Carga

# Instalar dependencias
npm install

# Ejecutar script de importación
npm run import -- --file=data/products.csv

# Con opciones adicionales
npm run import -- --file=data/products.csv --category=1 --clearFirst
```

### Formato del CSV

```csv
Name,Description,Price,Stock,CategoryID,ImageURL,SKU
"Laptop Dell XPS 15","Laptop de alto rendimiento",1299.99,15,1,"https://example.com/laptop.jpg","DELL-XPS-15-001"
"iPhone 15 Pro","Último modelo de Apple",999.99,30,2,"https://example.com/iphone.jpg","APPL-IP15-001"
```

### Script de Carga Manual

```javascript
// Carga/scripts/loadProducts.js
const sql = require('mssql');
const csv = require('csv-parser');
const fs = require('fs');

const config = {
  server: 'localhost',
  database: 'CatalogoProductos',
  user: 'sa',
  password: 'TuPassword',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function loadProducts(csvFile) {
  const pool = await sql.connect(config);
  const products = [];
  
  fs.createReadStream(csvFile)
    .pipe(csv())
    .on('data', (row) => {
      products.push(row);
    })
    .on('end', async () => {
      for (const product of products) {
        await pool.request()
          .input('name', sql.NVarChar, product.Name)
          .input('description', sql.NVarChar, product.Description)
          .input('price', sql.Decimal(10, 2), product.Price)
          .input('stock', sql.Int, product.Stock)
          .input('categoryID', sql.Int, product.CategoryID)
          .input('imageURL', sql.NVarChar, product.ImageURL)
          .input('sku', sql.NVarChar, product.SKU)
          .query(`
            INSERT INTO Products (Name, Description, Price, Stock, CategoryID, ImageURL, SKU)
            VALUES (@name, @description, @price, @stock, @categoryID, @imageURL, @sku)
          `);
      }
      console.log(`${products.length} productos importados exitosamente`);
      await pool.close();
    });
}

loadProducts('./data/products.csv');
```

---

## 🧪 Testing

### Backend Tests

```bash
cd Backend

# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Frontend Tests

```bash
cd Frontend

# Ejecutar tests unitarios
npm test

# Tests con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e
```

---

## 🔧 Características del Código

### Validación de Datos

**Backend (Express Validator):**
```javascript
// Backend/src/middlewares/validator.js
const { body, validationResult } = require('express-validator');

const productValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 3, max: 200 })
      .withMessage('El nombre debe tener entre 3 y 200 caracteres'),
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('El precio debe ser mayor a 0'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('El stock debe ser un número positivo'),
    body('categoryID')
      .isInt()
      .withMessage('La categoría es requerida')
  ];
};
```

**Frontend (TypeScript):**
```typescript
// Frontend/src/utils/validation.ts
export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryID: number;
  imageURL?: string;
  sku?: string;
}

export const validateProduct = (data: ProductFormData): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  }
  
  if (data.price <= 0) {
    errors.push('El precio debe ser mayor a 0');
  }
  
  if (data.stock < 0) {
    errors.push('El stock no puede ser negativo');
  }
  
  if (!data.categoryID) {
    errors.push('Debe seleccionar una categoría');
  }
  
  return errors;
};
```

---

## 🚀 Despliegue

### Backend en Producción

```bash
cd Backend

# Build (si es TypeScript)
npm run build

# Iniciar en producción
NODE_ENV=production npm start
```

### Frontend en Producción

```bash
cd Frontend

# Build de producción
npm run build

# Los archivos estarán en /dist
# Servir con un servidor web (nginx, apache, etc.)
```

### Variables de Entorno en Producción

**Backend:**
```env
NODE_ENV=production
PORT=3001
DB_SERVER=sql-server-production.database.windows.net
DB_NAME=CatalogoProd
DB_ENCRYPT=true
```

**Frontend:**
```env
VITE_API_URL=https://api.tudominio.com
VITE_ENVIRONMENT=production
```

---

## 📚 Contexto del Proyecto

Este proyecto fue desarrollado como parte de un **proceso de entrevista técnica** para demostrar:

### Habilidades Técnicas Demostradas

✅ **Full-Stack Development**
- Desarrollo de frontend en TypeScript
- Backend con Node.js y Express
- Integración completa frontend-backend

✅ **Base de Datos**
- Diseño de esquemas relacionales
- Consultas T-SQL optimizadas
- Stored procedures y vistas

✅ **Arquitectura de Software**
- Separación de responsabilidades
- Patrón MVC/MVP
- API RESTful

✅ **Mejores Prácticas**
- Código limpio y mantenible
- Validación de datos
- Manejo de errores
- TypeScript para type safety

✅ **DevOps Básico**
- Configuración con variables de entorno
- Scripts de carga de datos
- Documentación completa

---

## 🎯 Criterios de Evaluación Cubiertos

Este proyecto cubre típicamente los siguientes aspectos evaluados en pruebas técnicas:

- [x] Funcionalidad completa del CRUD
- [x] Interfaz de usuario responsiva y atractiva
- [x] Código limpio y bien estructurado
- [x] Manejo apropiado de errores
- [x] Validación de datos robusta
- [x] Uso de TypeScript
- [x] Documentación clara
- [x] Buenas prácticas de desarrollo

---

## 🤝 Contribuciones

Aunque este es un proyecto de prueba técnica, las sugerencias de mejora son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'feat: Agregar mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

---

## 📈 Posibles Mejoras Futuras

- [ ] Autenticación y autorización de usuarios
- [ ] Sistema de comentarios y calificaciones
- [ ] Carrito de compras
- [ ] Procesamiento de pagos
- [ ] Panel de administración avanzado
- [ ] Generación de reportes en PDF
- [ ] Notificaciones por email
- [ ] Sistema de cupones y descuentos
- [ ] Multi-idioma (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Tests automatizados completos
- [ ] CI/CD pipeline

---

## 🐛 Problemas Conocidos

No se han identificado problemas críticos. Para reportar bugs:

1. Revisa [Issues existentes](https://github.com/hardostascon/Catalogo-de-Productos/issues)
2. [Crea un nuevo Issue](https://github.com/hardostascon/Catalogo-de-Productos/issues/new)

---

## 📊 Estadísticas del Proyecto

![GitHub last commit](https://img.shields.io/github/last-commit/hardostascon/Catalogo-de-Productos)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/hardostascon/Catalogo-de-Productos)

**Composición del Código:**
- TypeScript: 75.3%
- JavaScript: 21.5%
- CSS: 2.8%
- T-SQL: 0.4%

---

## 👨‍💻 Autor

**hardostascon**

- GitHub: [@hardostascon](https://github.com/hardostascon)
- Email: hardos34@hotmail.com
- LinkedIn: [hardostascon](https://www.linkedin.com/in/hardostaz/)

---

## 🙏 Agradecimientos

- A la empresa que proporcionó esta prueba técnica
- A la comunidad de desarrolladores por las herramientas open source
- A los recursos educativos que hicieron posible este proyecto

---


---

## 📞 Contacto

Para preguntas sobre este proyecto:

- **Email:** hardos34@hotmail.com
- **LinkedIn:** [Perfil profesional](https://www.linkedin.com/in/hardostaz/)

---

## 💡 Notas Técnicas

### Consideraciones de Seguridad

- Las contraseñas nunca deben estar en el código
- Usar variables de entorno para información sensible
- Validar todas las entradas del usuario
- Implementar rate limiting en producción
- Usar HTTPS en producción

### Optimizaciones

- Implementar caché para consultas frecuentes
- Optimizar imágenes antes de subirlas
- Usar paginación en lugar de cargar todos los productos
- Implementar lazy loading de imágenes
- Minificar y comprimir assets en producción

---

<div align="center">

### ⭐ Si te gustó este proyecto, considera darle una estrella ⭐

**[⬆ Volver arriba](#-catálogo-de-productos---e-commerce-product-catalog)**

---

**Desarrollado con 💻 para demostrar habilidades técnicas**

**Última actualización:** Febrero 2026

</div>
