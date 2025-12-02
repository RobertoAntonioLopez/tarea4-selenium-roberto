// utils/screenshot.js
const fs = require("fs");
const path = require("path");

async function takeScreenshot(driver, name) {
  const image = await driver.takeScreenshot();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${timestamp}-${name}.png`;
  const filePath = path.join(__dirname, "..", "screenshots", fileName);

  fs.writeFileSync(filePath, image, "base64");
  console.log("Screenshot guardado en:", filePath);
}

module.exports = { takeScreenshot };
