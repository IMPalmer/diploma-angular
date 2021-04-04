const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;
app.use(express.static('src'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src', 'index.html'));
});
app.listen(port, () =>
  console.log(`Server is running on: http://localhost:${port}`));
