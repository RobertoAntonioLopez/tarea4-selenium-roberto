// tests/smoke.test.js
const { By } = require("selenium-webdriver");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const { BASE_URL } = require("./config");

describe("Smoke test - Cargar página principal", function () {
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

  it("Debe cargar la página principal sin errores", async () => {
    try {
      await driver.get(BASE_URL);

      // Espera un poco para que cargue
      await driver.sleep(2000);

      // Sacar un screenshot para confirmar que todo abre
      await takeScreenshot(driver, "smoke-home");

      // Ejemplo de verificación muy simple:
      const title = await driver.getTitle();
      console.log("Título de la página:", title);

      // Solo comprobamos que el título sea una cadena (más adelante haremos asserts más específicos)
      expect(title).to.be.a("string");

    } catch (error) {
      await takeScreenshot(driver, "smoke-home-error");
      throw error;
    }
  });
});
