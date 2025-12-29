# Sistema de Gestión con API REST

Aplicación administrativa con autenticación JWT, gestión de categorías y productos usando Ant Design y React.

## Características

- **Autenticación**: Sistema de login con JWT y localStorage
- **Dashboard**: Interfaz administrativa con sidebar colapsable
- **Categorías**: CRUD completo de categorías
- **Productos**: CRUD de productos con importación masiva vía CSV
- **Diseño**: Interfaz moderna con Ant Design

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Reemplaza `http://localhost:3000/api` con la URL de tu API REST.

### 2. Estructura de la API

Tu API debe implementar los siguientes endpoints:

#### Autenticación
- `POST /auth/login` - Login con email y password
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string, user: { email: string } }`
  
- `GET /auth/me` - Obtener usuario actual
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ email: string }`

#### Categorías
- `GET /categories` - Listar categorías
- `POST /categories` - Crear categoría
  - Body: `{ name: string, description?: string }`
- `PUT /categories/:id` - Actualizar categoría
  - Body: `{ name: string, description?: string }`
- `DELETE /categories/:id` - Eliminar categoría

#### Productos
- `GET /products` - Listar productos (puede incluir relación con categorías)
- `POST /products` - Crear producto
  - Body: `{ name: string, description?: string, price: number, stock: number, category_id?: string }`
- `PUT /products/:id` - Actualizar producto
  - Body: `{ name: string, description?: string, price: number, stock: number, category_id?: string }`
- `DELETE /products/:id` - Eliminar producto
- `POST /products/bulk` - Crear múltiples productos
  - Body: `{ products: Array<{...}> }`

### 3. Autenticación JWT

La aplicación espera que tu API:
- Devuelva un token JWT en el endpoint `/auth/login`
- Acepte el token en el header `Authorization: Bearer {token}` para endpoints protegidos
- Devuelva un error 401 cuando el token sea inválido o haya expirado

### 4. Instalación

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
├── app/
│   ├── dashboard/
│   │   ├── categories/     # Página de categorías
│   │   ├── products/       # Página de productos
│   │   └── layout.tsx      # Layout del dashboard
│   ├── login/              # Página de login
│   └── layout.tsx          # Layout principal con AuthProvider
├── components/
│   └── dashboard-layout.tsx # Componente de layout del dashboard
├── contexts/
│   └── auth-context.tsx    # Contexto de autenticación
├── lib/
│   └── api-client.ts       # Cliente para comunicación con API REST
└── README.md
```

## Importación de Productos CSV

La aplicación permite importar productos masivamente desde archivos CSV. El formato esperado es:

```csv
name,description,price,stock,category_id
Producto 1,Descripción del producto,99.99,10,uuid-categoria
Producto 2,Otra descripción,49.99,5,
```

**Columnas requeridas**: `name`, `price`, `stock`
**Columnas opcionales**: `description`, `category_id`

Puedes descargar una plantilla CSV desde la aplicación.

## Tecnologías

- **Next.js 16** - Framework React
- **Ant Design** - Biblioteca de componentes UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios

## Notas Importantes

- El token JWT se almacena en `localStorage`
- La aplicación redirige automáticamente al login si el token expira
- Todas las peticiones a la API incluyen el token en los headers
- Los endpoints deben seguir el patrón RESTful estándar
