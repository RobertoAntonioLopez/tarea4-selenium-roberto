// tests/login_happy_path.test.js
const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const { BASE_URL, USERNAME, PASSWORD } = require("./config");

describe("Login - Camino feliz", function () {
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

  it("Debe permitir iniciar sesión con credenciales válidas", async () => {
    try {
      // 1. Ir a la página de login
      await driver.get(`${BASE_URL}/login`);

      // 2. Buscar los elementos del formulario
      const usernameInput = await driver.findElement(By.id("username"));
      const passwordInput = await driver.findElement(By.id("password"));
      const loginButton   = await driver.findElement(By.id("btnLogin"));

      // 3. Escribir usuario y contraseña VÁLIDOS (admin / 1234)
      await usernameInput.sendKeys(USERNAME);
      await passwordInput.sendKeys(PASSWORD);

      // 4. Click en "Iniciar sesión"
      await loginButton.click();

      // 5. Esperar a que aparezca el dashboard
      await driver.wait(until.elementLocated(By.id("dashboard")), 10000);

      const dashboard = await driver.findElement(By.id("dashboard"));
      const isDisplayed = await dashboard.isDisplayed();

      expect(isDisplayed).to.be.true;

      // 6. Screenshot de éxito
      await takeScreenshot(driver, "login-camino-feliz");

    } catch (error) {
      // Si algo falla, tomamos screenshot de error también
      await takeScreenshot(driver, "login-camino-feliz-error");
      throw error;
    }
  });
});
