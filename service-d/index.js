const express = require("express");
const axios = require("axios");
const app = express();

const PORT = 5000;

 
const SERVICE_B_URL = "http://service-b:3000/hello";

app.get("/hello", async (req, res) => {
    res.send(`Service D says Hi"`);
});
 
app.get("/call-b", async (req, res) => {
  try {
    const response = await axios.get(SERVICE_B_URL);
    res.send(`Service D got response: "${response.data}"`);
  } catch (err) {
    res.status(500).send(`Error calling Service B: ${err.message}`);
  }
});

app.listen(PORT, async () => {
  console.log(`Service D running on port ${PORT}`);
 
});
