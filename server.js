const path = require('path');
const express = require('express');

const app = express();
const distFolder = path.join(__dirname, 'dist/copy-nest/browser');

app.use(express.static(distFolder));

app.get('/{*any}', (req, res) => {
  console.log(`Serving route: ${req.method} ${req.originalUrl}`);
  res.red(path.join(distFolder, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
