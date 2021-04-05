const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;
app.use(express.static(__dirname + '/dist/diploma-angular'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/diploma-angular/index.html'));
});
app.listen(port, () =>
  console.log(`Server is running on: http://localhost:${port}`));
