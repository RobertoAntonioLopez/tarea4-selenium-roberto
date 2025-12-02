// utils/driver.js
const { Builder } = require("selenium-webdriver");

async function createDriver() {
  const driver = await new Builder().forBrowser("chrome").build();
  return driver;
}

module.exports = { createDriver };
