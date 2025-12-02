// server.js
const express = require("express");

const app = express();
const PORT = 3000;

// Credenciales fijas para el login
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "1234";

// "Base de datos" en memoria para productos
let products = [
  { id: 1, name: "Producto demo", price: 100 }
];

function getNextProductId() {
  if (products.length === 0) return 1;
  return Math.max(...products.map(p => p.id)) + 1;
}

// Para leer datos de formularios (POST)
app.use(express.urlencoded({ extended: true }));

// ================== PÁGINA PRINCIPAL ==================
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Tarea 4 - Inicio</title>
    </head>
    <body>
      <h1>Bienvenido a la Tarea 4</h1>
      <p><a href="/login">Ir al login</a></p>
    </body>
    </html>
  `);
});

// ================== LOGIN ==================
app.get("/login", (req, res) => {
  const showError = req.query.error === "1";

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Login</title>
    </head>
    <body>
      <h1>Inicio de sesión</h1>

      ${showError ? '<p id="loginError" style="color:red;">Credenciales inválidas</p>' : ""}

      <form method="POST" action="/login">
        <div>
          <label for="username">Usuario</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label for="password">Contraseña</label>
          <input type="password" id="password" name="password" />
        </div>
        <button id="btnLogin" type="submit">Iniciar sesión</button>
      </form>
    </body>
    </html>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login?error=1");
  }
});

// ================== DASHBOARD ==================
app.get("/dashboard", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Dashboard</title>
    </head>
    <body>
      <h1>Dashboard</h1>
      <div id="dashboard">
        Panel principal de la Tarea 4
      </div>
      <p><a id="linkProductos" href="/productos">Ir al módulo de productos</a></p>
    </body>
    </html>
  `);
});

// ================== CRUD DE PRODUCTOS ==================

// Listar productos
app.get("/productos", (req, res) => {
  const rows = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>
        <a href="/productos/editar/${p.id}" class="btnEditar">Editar</a>
        <form method="POST" action="/productos/eliminar/${p.id}" style="display:inline;">
          <button type="submit" class="btnEliminar">Eliminar</button>
        </form>
      </td>
    </tr>
  `).join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Productos</title>
    </head>
    <body>
      <h1>Listado de productos</h1>
      <p><a href="/dashboard">Volver al dashboard</a></p>
      <p><a id="btnNuevoProducto" href="/productos/nuevo">Nuevo producto</a></p>

      <table border="1" id="productsTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="4">No hay productos</td></tr>`}
        </tbody>
      </table>
    </body>
    </html>
  `);
});

// Formulario para crear producto
app.get("/productos/nuevo", (req, res) => {
  const showError = req.query.error === "1";

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Nuevo producto</title>
    </head>
    <body>
      <h1>Nuevo producto</h1>
      <p><a href="/productos">Volver al listado</a></p>

      ${showError ? '<p id="productError" style="color:red;">Datos inválidos. Verifique nombre y precio.</p>' : ""}

      <form id="formNuevoProducto" method="POST" action="/productos/nuevo">
        <div>
          <label for="productName">Nombre</label>
          <input type="text" id="productName" name="name" />
        </div>
        <div>
          <label for="productPrice">Precio</label>
          <input type="number" id="productPrice" name="price" />
        </div>
        <button id="btnGuardarProducto" type="submit">Guardar</button>
      </form>
    </body>
    </html>
  `);
});

// Guardar producto nuevo (CREATE)
app.post("/productos/nuevo", (req, res) => {
  const { name, price } = req.body;

  const numericPrice = Number(price);

  if (!name || name.length > 100 || isNaN(numericPrice) || numericPrice <= 0) {
    return res.redirect("/productos/nuevo?error=1");
  }

  const newProduct = {
    id: getNextProductId(),
    name,
    price: numericPrice
  };

  products.push(newProduct);
  res.redirect("/productos");
});

// Formulario para editar producto
app.get("/productos/editar/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).send("Producto no encontrado");
  }

  const showError = req.query.error === "1";

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Editar producto</title>
    </head>
    <body>
      <h1>Editar producto</h1>
      <p><a href="/productos">Volver al listado</a></p>

      ${showError ? '<p id="productEditError" style="color:red;">Datos inválidos al editar.</p>' : ""}

      <form id="formEditarProducto" method="POST" action="/productos/editar/${product.id}">
        <div>
          <label for="editProductName">Nombre</label>
          <input type="text" id="editProductName" name="name" value="${product.name}" />
        </div>
        <div>
          <label for="editProductPrice">Precio</label>
          <input type="number" id="editProductPrice" name="price" value="${product.price}" />
        </div>
        <button id="btnActualizarProducto" type="submit">Actualizar</button>
      </form>
    </body>
    </html>
  `);
});

// Actualizar producto (UPDATE)
app.post("/productos/editar/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).send("Producto no encontrado");
  }

  const { name, price } = req.body;
  const numericPrice = Number(price);

  if (!name || name.length > 100 || isNaN(numericPrice) || numericPrice <= 0) {
    return res.redirect(`/productos/editar/${id}?error=1`);
  }

  product.name = name;
  product.price = numericPrice;

  res.redirect("/productos");
});

// Eliminar producto (DELETE)
app.post("/productos/eliminar/:id", (req, res) => {
  const id = Number(req.params.id);
  products = products.filter(p => p.id !== id);
  res.redirect("/productos");
});

// ================== INICIAR SERVIDOR ==================
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
