// generate-config.js
require("dotenv").config();
const fs = require("fs");

const env = {
  NOMOR_MALIK: process.env.NOMOR_MALIK || ""
};

fs.writeFileSync(
  "config.js",
  `window.__ENV = ${JSON.stringify(env, null, 2)};`,
  "utf8"
);

console.log("✅ config.js berhasil dibuat!");
