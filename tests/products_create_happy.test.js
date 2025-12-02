// tests/products_create_happy.test.js
const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const { BASE_URL, USERNAME, PASSWORD } = require("./config");

describe("Productos - Crear producto (camino feliz)", function () {
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

  it("Debe crear un producto válido y mostrarlo en el listado", async () => {
    const nombreProducto = `Producto Selenium ${Date.now()}`;
    const precioProducto = "250";

    try {
      // 1. Ir al login
      await driver.get(`${BASE_URL}/login`);

      // 2. Login correcto
      const usernameInput = await driver.findElement(By.id("username"));
      const passwordInput = await driver.findElement(By.id("password"));
      const loginButton   = await driver.findElement(By.id("btnLogin"));

      await usernameInput.sendKeys(USERNAME);
      await passwordInput.sendKeys(PASSWORD);
      await loginButton.click();

      // 3. Esperar el dashboard
      await driver.wait(until.elementLocated(By.id("dashboard")), 10000);

      // 4. Ir al módulo de productos
      const linkProductos = await driver.findElement(By.id("linkProductos"));
      await linkProductos.click();

      // 5. Esperar la tabla de productos
      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      // 6. Ir al formulario de "Nuevo producto"
      const btnNuevoProducto = await driver.findElement(By.id("btnNuevoProducto"));
      await btnNuevoProducto.click();

      // 7. Esperar el formulario de nuevo producto
      await driver.wait(until.elementLocated(By.id("formNuevoProducto")), 10000);

      const nameInput  = await driver.findElement(By.id("productName"));
      const priceInput = await driver.findElement(By.id("productPrice"));
      const btnGuardar = await driver.findElement(By.id("btnGuardarProducto"));

      await nameInput.sendKeys(nombreProducto);
      await priceInput.sendKeys(precioProducto);
      await btnGuardar.click();

      // 8. Volver al listado y verificar que el producto aparece
      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      const filas = await driver.findElements(By.css("#productsTable tbody tr"));
      expect(filas.length).to.be.greaterThan(0);

      let encontrado = false;
      for (const fila of filas) {
        const celdas = await fila.findElements(By.css("td"));
        if (celdas.length >= 3) {
          const nombre = await celdas[1].getText();
          const precio = await celdas[2].getText();

          if (nombre === nombreProducto && precio === precioProducto) {
            encontrado = true;
            break;
          }
        }
      }

      expect(encontrado).to.be.true;

      await takeScreenshot(driver, "productos-crear-camino-feliz");

    } catch (error) {
      await takeScreenshot(driver, "productos-crear-camino-feliz-error");
      throw error;
    }
  });
});
