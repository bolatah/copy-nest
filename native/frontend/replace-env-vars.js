const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src/environments');
const apiUrl = process.env.API_URL || 'http://localhost:8080/api/nests';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
};

const envProd = `
export const environment = {
  production: true,
   apiUrl: '${apiUrl}',
  firebaseConfig: ${JSON.stringify(firebaseConfig, null, 2)}
};
`;

const envDev = `
export const environment = {
  production: false,
   apiUrl: '${apiUrl}',
  firebaseConfig: ${JSON.stringify(firebaseConfig, null, 2)}
};
`;

fs.mkdirSync(baseDir, { recursive: true });
fs.writeFileSync(path.join(baseDir, 'environment.prod.ts'), envProd);
fs.writeFileSync(path.join(baseDir, 'environment.ts'), envDev);