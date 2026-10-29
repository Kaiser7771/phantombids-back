👻 PhantomBids Backend

PhantomBids es una API de backend completa y temática de terror, diseñada para gestionar subastas de casas embrujadas, objetos malditos, reputación de usuarios y control de acceso basado en roles (RBAC).

Este proyecto está construido con Node.js, Express y MongoDB (Mongoose), siguiendo una arquitectura limpia y modular adaptada para entornos de producción basados en Linux (como Render).

🚀 Características

RBAC Global y por Casa: Autorización de doble capa que soporta roles globales del sistema (user, admin) y roles específicos dentro de las casas embrujadas (Head Haunter, Senior Spook, Spirit, Poltergeist).

Operaciones CRUD Completas: Endpoints completos para la gestión de usuarios, casas embrujadas, objetos malditos y subastas fantasmales mediante los métodos seguros PUT, POST, GET y DELETE.

Autenticación Segura: Autenticación basada en JSON Web Tokens (JWT) con hashing automático de contraseñas mediante bcryptjs.

Arquitectura Modular: Clara separación de responsabilidades en controladores, middlewares, modelos y rutas.

Manejo Robusto de Errores: Middleware centralizado para el manejo de errores que garantiza respuestas JSON consistentes.

🛠️ Tecnologías Utilizadas

Entorno de ejecución: Node.js

Framework: Express.js

Base de datos: MongoDB & Mongoose Atlas

Autenticación: JSON Web Tokens (JWT) & bcryptjs

Despliegue: Render

📁 Estructura del Proyecto

phantombids-back/
├── controllers/          # Controladores con la lógica de negocio
├── middleware/           # Middlewares de autenticación y validación de roles
├── models/               # Esquemas de Mongoose (User, HauntHouse, CursedObject, etc.)
├── routes/               # Enrutadores modulares de Express (auth, houses, auctions, objects, etc.)
├── .env                  # Variables de entorno (no se suben al repositorio)
├── app.js                # Configuración de la aplicación Express y middlewares
├── index.js              # Punto de entrada del servidor y conexión a la base de datos
└── package.json          # Dependencias y scripts del proyecto


⚙️ Primeros Pasos (Instalación Local)

Prerrequisitos

Node.js (versión 18+ recomendada)

Una cuenta en MongoDB Atlas o una instancia local de MongoDB

1. Clonar el repositorio

git clone https://github.com/Kaiser7771/phantombids-back.git
cd phantombids-back


2. Instalar las dependencias

npm install


3. Configurar las variables de entorno

Crea un archivo .env en la raíz del proyecto y añade las siguientes variables:

PORT=5000
MONGODB_URI=mongodb+srv://caiser7771_db_user:ZDqsY7cTtpXCNQGa@phantombids.azfw6gb.mongodb.net/phantombids?appName=PhantomBids
JWT_SECRET=tu_clave_secreta_jwt_muy_segura


4. Ejecutar el servidor

Para desarrollo (con reinicio automático):

npm run dev


Para producción:

npm start


El servidor se iniciará en http://localhost:5000.

🌐 Referencia de Endpoints de la API

Autenticación (/api/auth)

POST /api/auth/register - Registrar un nuevo usuario

POST /api/auth/login - Iniciar sesión y obtener un token JWT

Casas Embrujadas (/api/houses)

GET /api/houses - Obtener todas las casas embrujadas

GET /api/houses/:id - Obtener una casa embrujada por ID

POST /api/houses - Crear una nueva casa (Protegido)

PUT /api/houses/:id - Actualizar una casa (Protegido - Solo Head Haunter / Admin)

DELETE /api/houses/:id - Eliminar una casa (Protegido - Solo Head Haunter / Admin)

Objetos Malditos (/api/objects)

GET /api/objects - Obtener todos los objetos malditos

GET /api/objects/:id - Obtener un objeto maldito por ID

POST /api/objects - Crear un nuevo objeto maldito (Protegido)

PUT /api/objects/:id - Actualizar un objeto maldito (Protegido)

DELETE /api/objects/:id - Eliminar un objeto maldito (Protegido)

Subastas y Pujas (/api/auctions)

GET /api/auctions/:id - Obtener detalles de una subasta

POST /api/auctions - Crear una subasta fantasmal (Protegido)

POST /api/auctions/:id/bid - Realizar una puja en una subasta activa (Protegido)

POST /api/auctions/:id/close - Cerrar una subasta (Protegido)

🚀 Despliegue

Este backend está desplegado y alojado en vivo en Render.

Enlace de la API en producción: https://phantombids-back-3aod.onrender.com 

📝 Licencia

Este proyecto se ha desarrollado con fines académicos para el curso de Ingenieria Web.