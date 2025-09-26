const express = require('express');
const app = express();

const PORT = 3000;

app.get('/hello', (req, res) => {
  res.send('Hello from Service B!');
});

app.listen(PORT, () => {
  console.log(`Service B running on port ${PORT}`);
});
