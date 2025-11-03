<h1 align="center">🛍️ E-Commerce Sellospro</h1>

<p align="center">
  <strong>Un proyecto Full-Stack de e-commerce para un negocio de sellos personalizados.</strong>
  <br />
  Construido con <strong>React.js</strong> en el frontend y <strong>Node.js/Express</strong> en el backend.
  <br />
  Integrado completamente con <strong>MercadoPago</strong> para pagos y <strong>SendGrid</strong> para correos transaccionales.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Mercado_Pago-009EE3?style=for-the-badge&logo=mercado-pago&logoColor=white" alt="Mercado Pago" />
  <img src="https://img.shields.io/badge/SendGrid-1A1A1A?style=for-the-badge&logo=sendgrid&logoColor=00A0DB" alt="SendGrid" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 📋 Descripción del Proyecto

**Sellospro E-Commerce** es una solución web completa diseñada para gestionar la venta de sellos personalizados. A diferencia de un e-commerce estándar, este proyecto maneja múltiples y complejos flujos de personalización de productos:

1.  **Productos Estándar (Automáticos, Escolares):** El cliente personaliza el producto directamente en la página (texto, color, fuente, etc.) y lo añade al carrito.
2.  **Productos de Cotización (Kits con Logo):** El cliente selecciona un tamaño de kit, sube su propio logo y envía una "Solicitud de Presupuesto". El backend recibe esta solicitud (con el logo adjunto) y notifica al administrador por correo para que pueda realizar una cotización manual.

El proyecto gestiona todo el ciclo de vida del pago a través de **MercadoPago**, desde la creación de la preferencia hasta la confirmación final del pedido mediante **Webhooks**. Los pedidos confirmados se guardan localmente en el servidor y se envía un correo de confirmación detallado al cliente y al administrador usando **SendGrid**.

## ✨ Características Principales

### Frontend (React)

- **Catálogo y Filtros:** Página de catálogo con carga de productos, filtros por categoría y ordenamiento por precio o nombre.
- **Búsqueda Rápida:** Componente `Header` con barra de búsqueda y previsualización de resultados en vivo.
- **Página de Producto Dinámica:** Renderiza condicionalmente **3 tipos de personalizadores** (`Personalizer`, `PersonalizerLogo`, `PersonalizerSchool`) según la categoría del producto.
- **Modo "Edición de Carrito":** Al hacer clic en un ítem del carrito, el usuario es llevado a la `ProductPage` con todas sus personalizaciones precargadas, listo para editar.
- **Carrito de Compras Persistente:** Estado global manejado con `React Context` y persistido en `localStorage`. El carrito agrupa productos idénticos (mismo ID + misma personalización).
- **Flujo de Checkout:** Formulario de cliente con validación en vivo.
- **Páginas de Estado (Post-Pago):** Páginas de `/success`, `/failure` y `/pending` para manejar los retornos de MercadoPago. La página de éxito limpia el carrito automáticamente.
- **Página de Estado de Pedido:** Una ruta `/order/:orderId` (enlazada en el email de confirmación) que consulta al backend y muestra el estado del pedido.
- **Totalmente Responsive:** Diseñado con Tailwind CSS para una experiencia fluida en móviles y escritorio.

### Backend (Node.js)

- **API RESTful:** Endpoints para servir productos y pedidos.
- **Gestión de Pagos:** Integración con la API de MercadoPago para crear preferencias de pago.
- **Webhooks de MercadoPago:** Un endpoint (`/api/webhook`) que escucha la confirmación de pago (`"type": "payment"`).
- **Persistencia de Pedidos:** Al recibir un webhook de pago aprobado, el backend guarda un archivo `.json` detallado del pedido en la carpeta `/orders`.
- **Correos Transaccionales (SendGrid):**
  - **Confirmación de Compra:** Al procesar el webhook, envía un email de confirmación detallado (con todos los ítems y personalizaciones) al cliente y al administrador.
  - **Solicitud de Presupuesto:** Maneja un endpoint separado (`/api/request-budget`) que recibe un formulario (`FormData`) con el logo (usando `Multer`) y los datos de contacto, y lo envía por correo al administrador.

## 🚀 Stack de Tecnologías

### 🖥️ Frontend

- **Framework:** React 18
- **Enrutamiento:** React Router DOM v6
- **Manejo de Estado:** React Context API (`useCart`, `useProducts`)
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **Cliente HTTP:** `fetch` API

### 📡 Backend

- **Framework:** Node.js, Express
- **Pagos:** `mercadopago` (SDK Oficial)
- **Correos:** `@sendgrid/mail` (SDK Oficial)
- **Subida de Archivos:** `multer` (para los logos de cotización)
- **Variables de Entorno:** `dotenv`
- **CORS:** `cors`

---

## ⚙️ Instalación y Configuración Local

Para ejecutar este proyecto localmente, necesitarás clonar el repositorio y configurar tanto el backend como el frontend por separado.

### Requisitos Previos

- Node.js (v18 o superior)
- npm / yarn / pnpm
- Una cuenta de [MercadoPago](https://mercadopago.com) (para obtener el Access Token).
- Una cuenta de [SendGrid](https://sendgrid.com) (para la API Key y un email verificado).
- [Ngrok](https://ngrok.com) (o un servicio similar) para exponer tu backend local a internet y poder probar los Webhooks de MercadoPago.

### 1. Configuración del Backend

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en la raíz de la carpeta `backend` y añade las siguientes variables:

    ```ini
    # Claves de la API (¡Secretas!)
    MP_ACCESS_TOKEN=TU_ACCESS_TOKEN_DE_MERCADOPAGO
    SENDGRID_API_KEY=TU_API_KEY_DE_SENDGRID

    # Configuración de SendGrid
    EMAIL_FROM=tu_email_verificado@dominio.com

    # Configuración del servidor
    PORT=8080
    CORS_ORIGIN=http://localhost:5173

    # URL pública para Webhooks (¡Importante!)
    # Al correr localmente, usa Ngrok: `ngrok http 8080`
    PUBLIC_BACKEND_URL=https://TU_URL_DE_NGROK.ngrok.io
    ```

4.  Crea un archivo `products.json` en la raíz de la carpeta `backend` con la estructura de tus productos.
5.  Inicia el servidor de backend:
    ```bash
    npm run dev
    ```
    El servidor estará corriendo en `http://localhost:8080`.

### 2. Configuración del Frontend

1.  Navega a la carpeta del frontend (asumiendo que está en la raíz):
    ```bash
    # (Desde la raíz del proyecto)
    cd frontend
    # O si está en la raíz:
    # cd .
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en la raíz de la carpeta del frontend y añade la siguiente variable:

    ```ini
    # Apunta a tu servidor de backend local
    VITE_API_URL=http://localhost:8080/api
    ```

4.  Inicia el servidor de desarrollo de React (Vite):
    ```bash
    npm run dev
    ```
    Tu aplicación estará disponible en `http://localhost:5173`.

---

## 🗺️ API Endpoints del Backend

A continuación se detallan los endpoints clave de la API del backend:

### Productos y Pedidos

- `GET /api/products`: Devuelve el contenido completo de `products.json`.
- `GET /api/order/:orderId`: Busca y devuelve los datos de un pedido confirmado desde la carpeta `/orders`.

### Flujo de Pago

- `POST /api/create-preference`:

  - **Descripción:** Recibe el carrito, los datos del comprador y el método de envío.
  - **Payload:** `{ cart, buyer, deliveryMethod, address, total }`
  - **Respuesta:** Crea una preferencia en MercadoPago y devuelve el `init_point` (URL de pago).
  - **Clave:** Guarda el payload completo en la `metadata` de MercadoPago.

- `POST /api/webhook`:
  - **Descripción:** Endpoint público para recibir notificaciones de MercadoPago.
  - **Acción:** Si `type` es `payment` y el pago está `approved`, lee la `metadata` del pago, guarda el pedido como `SP-TIMESTAMP.json` en `/orders` y dispara el email de confirmación de SendGrid.

### Flujo de Cotización

- `POST /api/request-budget`:
  - **Descripción:** Recibe la solicitud de presupuesto para productos "Kit".
  - **Payload:** `multipart/form-data` (¡No JSON!)
    - `logoFile`: El archivo de imagen (manejado por `multer`).
    - `product`: String JSON
    - `customization`: String JSON
    - `quantity`: String
    - `buyer`: String JSON
  - **Acción:** Envía un email al administrador (`EMAIL_FROM`) con todos los datos y el logo del cliente como archivo adjunto.
