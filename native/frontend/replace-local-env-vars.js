// replace-env-vars.js
const fs = require('fs');
const path = require('path');

const configDir = path.resolve(__dirname, '..', 'config-files');  // one level up
const envDir = path.resolve(__dirname, 'src', 'environments');

const files = ['environment.ts', 'environment.prod.ts'];

files.forEach((file) => {
  const from = path.join(configDir, file);
  const to = path.join(envDir, file);

  if (fs.existsSync(from)) {
    fs.copyFileSync(from, to);
    console.log(`✅ Replaced ${file} from config-files/`);
  } else {
    console.warn(`⚠️  ${file} not found in config-files/. Using default.`);
  }
});
