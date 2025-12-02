// tests/products_edit_negative_limits.test.js
const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const { BASE_URL, USERNAME, PASSWORD } = require("./config");

describe("Productos - Editar producto (pruebas negativas y límites)", function () {
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

  async function loginYEntrarAEditarObteniendoValores() {
    // Login
    await driver.get(`${BASE_URL}/login`);

    const usernameInput = await driver.findElement(By.id("username"));
    const passwordInput = await driver.findElement(By.id("password"));
    const loginButton   = await driver.findElement(By.id("btnLogin"));

    await usernameInput.sendKeys(USERNAME);
    await passwordInput.sendKeys(PASSWORD);
    await loginButton.click();

    await driver.wait(until.elementLocated(By.id("dashboard")), 10000);

    // Ir a productos
    const linkProductos = await driver.findElement(By.id("linkProductos"));
    await linkProductos.click();

    await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

    // Tomar PRIMERA fila y leer sus valores ANTES de editar
    const filas = await driver.findElements(By.css("#productsTable tbody tr"));
    expect(filas.length).to.be.greaterThan(0);

    const primeraFila = filas[0];
    const celdas = await primeraFila.findElements(By.css("td"));

    const nombreAntes = await celdas[1].getText();
    const precioAntes = await celdas[2].getText();

    // Ahora sí, hacer clic en Editar
    const btnEditar = await primeraFila.findElement(By.css(".btnEditar"));
    await btnEditar.click();

    // Esperar form de edición
    await driver.wait(until.elementLocated(By.id("formEditarProducto")), 10000);

    // Devolvemos solo los VALORES, no el elemento
    return { nombreAntes, precioAntes };
  }

  it("No debe permitir editar con nombre vacío y precio inválido", async () => {
    try {
      const { nombreAntes, precioAntes } = await loginYEntrarAEditarObteniendoValores();

      const nameInput  = await driver.findElement(By.id("editProductName"));
      const priceInput = await driver.findElement(By.id("editProductPrice"));
      const btnActualizar = await driver.findElement(By.id("btnActualizarProducto"));

      // Datos inválidos
      await nameInput.clear();
      await priceInput.clear();

      await nameInput.sendKeys("");   // nombre vacío
      await priceInput.sendKeys("0"); // precio inválido

      await btnActualizar.click();

      // Debe mostrar error
      await driver.wait(until.elementLocated(By.id("productEditError")), 10000);

      const error = await driver.findElement(By.id("productEditError"));
      expect(await error.isDisplayed()).to.be.true;

      // Volver al listado
      await driver.get(`${BASE_URL}/productos`);
      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      // Verificar que NO se guardaron cambios
      const filas = await driver.findElements(By.css("#productsTable tbody tr"));
      const celdas = await filas[0].findElements(By.css("td"));

      const nombreDespues = await celdas[1].getText();
      const precioDespues = await celdas[2].getText();

      expect(nombreDespues).to.equal(nombreAntes);
      expect(precioDespues).to.equal(precioAntes);

      await takeScreenshot(driver, "productos-editar-negativo-nombre-vacio-precio-invalido");

    } catch (error) {
      await takeScreenshot(driver, "productos-editar-negativo-error");
      throw error;
    }
  });

  it("No debe permitir editar con nombre demasiado largo", async () => {
    try {
      const { nombreAntes, precioAntes } = await loginYEntrarAEditarObteniendoValores();

      const nameInput  = await driver.findElement(By.id("editProductName"));
      const priceInput = await driver.findElement(By.id("editProductPrice"));
      const btnActualizar = await driver.findElement(By.id("btnActualizarProducto"));

      const nombreLargo = "X".repeat(150); // límite excedido

      await nameInput.clear();
      await priceInput.clear();

      await nameInput.sendKeys(nombreLargo);
      await priceInput.sendKeys("100");

      await btnActualizar.click();

      // Mensaje de error
      await driver.wait(until.elementLocated(By.id("productEditError")), 10000);

      const error = await driver.findElement(By.id("productEditError"));
      expect(await error.isDisplayed()).to.be.true;

      // Volver al listado
      await driver.get(`${BASE_URL}/productos`);
      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      // Verificar que NO cambió nada
      const filas = await driver.findElements(By.css("#productsTable tbody tr"));
      const celdas = await filas[0].findElements(By.css("td"));

      const nombreDespues = await celdas[1].getText();
      const precioDespues = await celdas[2].getText();

      expect(nombreDespues).to.equal(nombreAntes);
      expect(precioDespues).to.equal(precioAntes);

      await takeScreenshot(driver, "productos-editar-negativo-nombre-largo");

    } catch (error) {
      await takeScreenshot(driver, "productos-editar-negativo-nombre-largo-error");
      throw error;
    }
  });
});
