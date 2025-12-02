// tests/login_negative.test.js
const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const { createDriver } = require("../utils/driver");
const { takeScreenshot } = require("../utils/screenshot");
const { BASE_URL } = require("./config");

describe("Login - Pruebas negativas", function () {
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

  it("No debe permitir iniciar sesión con credenciales inválidas", async () => {
    try {
      await driver.get(`${BASE_URL}/login`);

      const usernameInput = await driver.findElement(By.id("username"));
      const passwordInput = await driver.findElement(By.id("password"));
      const loginButton   = await driver.findElement(By.id("btnLogin"));

      // Usamos credenciales incorrectas
      await usernameInput.sendKeys("usuario_malo");
      await passwordInput.sendKeys("clave_mala");

      await loginButton.click();

      // Esperar a que recargue la página de login con el mensaje de error
      await driver.wait(until.elementLocated(By.id("loginError")), 10000);

      const errorMessage = await driver.findElement(By.id("loginError"));
      const text = await errorMessage.getText();

      // Comprobar que el mensaje de error es visible y tiene el texto esperado
      expect(await errorMessage.isDisplayed()).to.be.true;
      expect(text).to.include("Credenciales inválidas");

      await takeScreenshot(driver, "login-negativo-credenciales-invalidas");

    } catch (error) {
      await takeScreenshot(driver, "login-negativo-error");
      throw error;
    }
  });
});
