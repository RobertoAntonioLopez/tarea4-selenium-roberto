Tarea 4 – Pruebas Automatizadas con Selenium (JavaScript)

Este proyecto contiene la automatización de pruebas de una aplicación web desarrollada para la asignación de Pruebas Automatizadas – Tarea 4, utilizando Selenium WebDriver con JavaScript.

Incluye pruebas de login, CRUD de productos, casos positivos, negativos, pruebas de límites, capturas automáticas y reportes HTML.

Tecnologías utilizadas

Node.js

JavaScript

Selenium WebDriver

Mocha

Chai

Mochawesome

Express.js (aplicación de prueba)

Estructura del proyecto

tarea4-selenium/
├── server.js
├── package.json
├── tests/
│ ├── config.js
│ ├── smoke.test.js
│ ├── login_happy_path.test.js
│ ├── login_negative.test.js
│ ├── products_create_happy.test.js
│ ├── products_create_negative_limits.test.js
│ ├── products_edit_happy.test.js
│ ├── products_edit_negative_limits.test.js
│ ├── products_delete_happy.test.js
├── utils/
│ ├── driver.js
│ ├── screenshot.js
├── screenshots/
├── mochawesome-report/
└── README.md

Cómo ejecutar la aplicación

Instalar dependencias
npm install

Iniciar el servidor web
node server.js
El servidor estará disponible en: http://localhost:3000

Ejecutar las pruebas automatizadas
npm test

Esto generará:

Capturas de pantalla en la carpeta screenshots/

Reporte HTML en mochawesome-report/mochawesome.html

Capturas de pantalla

Todas las pruebas generan capturas de pantalla automáticamente, tanto en casos exitosos como errores.
Las capturas se guardan en la carpeta:
screenshots/

Reporte HTML

Después de ejecutar las pruebas, el reporte HTML se encuentra en:
mochawesome-report/mochawesome.html

Este archivo contiene:

Resultados detallados de cada prueba

Consola de ejecución

Estados de éxito o fallo

Capturas asociadas