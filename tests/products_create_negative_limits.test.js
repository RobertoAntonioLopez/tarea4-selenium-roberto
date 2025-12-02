// tests/products_create_negative_limits.test.js
const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const { BASE_URL, USERNAME, PASSWORD } = require("./config");

describe("Productos - Crear producto (pruebas negativas y límites)", function () {
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

  async function loginYIrANuevoProducto() {
    // Login
    await driver.get(`${BASE_URL}/login`);

    const usernameInput = await driver.findElement(By.id("username"));
    const passwordInput = await driver.findElement(By.id("password"));
    const loginButton   = await driver.findElement(By.id("btnLogin"));

    await usernameInput.sendKeys(USERNAME);
    await passwordInput.sendKeys(PASSWORD);
    await loginButton.click();

    // Dashboard
    await driver.wait(until.elementLocated(By.id("dashboard")), 10000);

    // Ir a productos
    const linkProductos = await driver.findElement(By.id("linkProductos"));
    await linkProductos.click();

    await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

    // Contar filas actuales (para verificar que luego NO aumentan)
    const filasAntes = await driver.findElements(By.css("#productsTable tbody tr"));

    // Ir a "Nuevo producto"
    const btnNuevoProducto = await driver.findElement(By.id("btnNuevoProducto"));
    await btnNuevoProducto.click();

    await driver.wait(until.elementLocated(By.id("formNuevoProducto")), 10000);

    return filasAntes.length;
  }

  it("No debe crear producto con nombre vacío o precio inválido", async () => {
    try {
      const filasAntesCount = await loginYIrANuevoProducto();

      const nameInput  = await driver.findElement(By.id("productName"));
      const priceInput = await driver.findElement(By.id("productPrice"));
      const btnGuardar = await driver.findElement(By.id("btnGuardarProducto"));

      // Caso 1: nombre vacío, precio 0 (inválido)
      await nameInput.clear();
      await priceInput.clear();
      await nameInput.sendKeys("");      // nombre vacío
      await priceInput.sendKeys("0");    // precio inválido (<= 0)
      await btnGuardar.click();

      // Debe redirigir de vuelta a /productos/nuevo con error
      await driver.wait(until.elementLocated(By.id("productError")), 10000);

      const error = await driver.findElement(By.id("productError"));
      expect(await error.isDisplayed()).to.be.true;

      // Volver al listado para verificar que NO se agregó fila
      await driver.get(`${BASE_URL}/productos`);
      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      const filasDespues = await driver.findElements(By.css("#productsTable tbody tr"));
      const filasDespuesCount = filasDespues.length;

      // El número de filas debe ser IGUAL al que teníamos antes
      expect(filasDespuesCount).to.equal(filasAntesCount);

      await takeScreenshot(driver, "productos-crear-negativo-nombre-vacio-precio-invalido");

    } catch (error) {
      await takeScreenshot(driver, "productos-crear-negativo-error");
      throw error;
    }
  });

  it("No debe crear producto con nombre demasiado largo", async () => {
    try {
      const filasAntesCount = await loginYIrANuevoProducto();

      const nameInput  = await driver.findElement(By.id("productName"));
      const priceInput = await driver.findElement(By.id("productPrice"));
      const btnGuardar = await driver.findElement(By.id("btnGuardarProducto"));

      // Generar un nombre de más de 100 caracteres
      const nombreLargo = "X".repeat(120); // 120 caracteres
      const precioValido = "100";

      await nameInput.clear();
      await priceInput.clear();
      await nameInput.sendKeys(nombreLargo);
      await priceInput.sendKeys(precioValido);
      await btnGuardar.click();

      // Debe mostrar error también (por longitud)
      await driver.wait(until.elementLocated(By.id("productError")), 10000);

      const error = await driver.findElement(By.id("productError"));
      expect(await error.isDisplayed()).to.be.true;

      // Volver al listado y verificar que NO se agregó producto nuevo
      await driver.get(`${BASE_URL}/productos`);
      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      const filasDespues = await driver.findElements(By.css("#productsTable tbody tr"));
      const filasDespuesCount = filasDespues.length;

      expect(filasDespuesCount).to.equal(filasAntesCount);

      await takeScreenshot(driver, "productos-crear-negativo-nombre-largo");

    } catch (error) {
      await takeScreenshot(driver, "productos-crear-negativo-nombre-largo-error");
      throw error;
    }
  });
});
