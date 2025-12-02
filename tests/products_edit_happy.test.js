// tests/products_edit_happy.test.js
const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const { BASE_URL, USERNAME, PASSWORD } = require("./config");

describe("Productos - Editar producto (camino feliz)", function () {
  this.timeout(60000);

  let driver;

  beforeEach(async () => {
    driver = await createDriver();
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("Debe permitir editar un producto existente y mostrar los cambios en el listado", async () => {
    const nuevoNombre = `Producto Editado ${Date.now()}`;
    const nuevoPrecio = "999";

    try {
      // 1. Ir al login e iniciar sesión
      await driver.get(`${BASE_URL}/login`);

      const usernameInput = await driver.findElement(By.id("username"));
      const passwordInput = await driver.findElement(By.id("password"));
      const loginButton   = await driver.findElement(By.id("btnLogin"));

      await usernameInput.sendKeys(USERNAME);
      await passwordInput.sendKeys(PASSWORD);
      await loginButton.click();

      // 2. Esperar el dashboard
      await driver.wait(until.elementLocated(By.id("dashboard")), 10000);

      // 3. Ir al módulo de productos
      const linkProductos = await driver.findElement(By.id("linkProductos"));
      await linkProductos.click();

      // 4. Esperar la tabla de productos
      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      const filas = await driver.findElements(By.css("#productsTable tbody tr"));
      expect(filas.length).to.be.greaterThan(0);

      // 5. Tomar la PRIMERA fila y hacer clic en "Editar"
      const primeraFila = filas[0];
      const btnEditar = await primeraFila.findElement(By.css(".btnEditar"));
      await btnEditar.click();

      // 6. Esperar el formulario de edición
      await driver.wait(until.elementLocated(By.id("formEditarProducto")), 10000);

      const nameInput  = await driver.findElement(By.id("editProductName"));
      const priceInput = await driver.findElement(By.id("editProductPrice"));
      const btnActualizar = await driver.findElement(By.id("btnActualizarProducto"));

      // 7. Limpiar y escribir nuevos datos
      await nameInput.clear();
      await priceInput.clear();
      await nameInput.sendKeys(nuevoNombre);
      await priceInput.sendKeys(nuevoPrecio);

      await btnActualizar.click();

      // 8. De nuevo en el listado, verificar cambios
      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      const filasDespues = await driver.findElements(By.css("#productsTable tbody tr"));
      let encontrado = false;

      for (const fila of filasDespues) {
        const celdas = await fila.findElements(By.css("td"));
        if (celdas.length >= 3) {
          const nombre = await celdas[1].getText();
          const precio = await celdas[2].getText();

          if (nombre === nuevoNombre && precio === nuevoPrecio) {
            encontrado = true;
            break;
          }
        }
      }

      expect(encontrado).to.be.true;

      await takeScreenshot(driver, "productos-editar-camino-feliz");

    } catch (error) {
      await takeScreenshot(driver, "productos-editar-camino-feliz-error");
      throw error;
    }
  });
});
