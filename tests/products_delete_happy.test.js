// tests/products_delete_happy.test.js
const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const { BASE_URL, USERNAME, PASSWORD } = require("./config");

describe("Productos - Eliminar producto (camino feliz)", function () {
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

  it("Debe permitir eliminar un producto del listado", async () => {
    try {
      // 1. Login
      await driver.get(`${BASE_URL}/login`);

      const usernameInput = await driver.findElement(By.id("username"));
      const passwordInput = await driver.findElement(By.id("password"));
      const loginButton   = await driver.findElement(By.id("btnLogin"));

      await usernameInput.sendKeys(USERNAME);
      await passwordInput.sendKeys(PASSWORD);
      await loginButton.click();

      // 2. Dashboard
      await driver.wait(until.elementLocated(By.id("dashboard")), 10000);

      // 3. Ir a productos
      const linkProductos = await driver.findElement(By.id("linkProductos"));
      await linkProductos.click();

      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      // 4. Contar filas antes de eliminar
      let filasAntes = await driver.findElements(By.css("#productsTable tbody tr"));
      expect(filasAntes.length).to.be.greaterThan(0);

      const filasAntesCount = filasAntes.length;

      // 5. Tomar la primera fila y usar el FORM para eliminar
      const primeraFila = filasAntes[0];

      // Seleccionar el FORM, no el botón
      const formEliminar = await primeraFila.findElement(By.css("form"));
      await formEliminar.submit();

      // 6. Esperar a que recargue el listado
      await driver.wait(until.elementLocated(By.id("productsTable")), 10000);

      // Esperar un poquito extra para estabilidad
      await driver.sleep(500);

      const filasDespues = await driver.findElements(By.css("#productsTable tbody tr"));
      const filasDespuesCount = filasDespues.length;

      // 7. Verificar que ahora hay menos filas
      expect(filasDespuesCount).to.be.lessThan(filasAntesCount);

      await takeScreenshot(driver, "productos-eliminar-camino-feliz");

    } catch (error) {
      await takeScreenshot(driver, "productos-eliminar-camino-feliz-error");
      throw error;
    }
  });
});
