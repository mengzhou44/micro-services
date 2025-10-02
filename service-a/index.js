const express = require("express");
const axios = require("axios");
const { Kafka } = require("kafkajs");

const prometheusClient = require('prom-client');
prometheusClient.collectDefaultMetrics();

// create a custom counter
const requestCounter = new prometheusClient.Counter({
  name: 'service_a_requests_total',
  help: 'Total requests to service A'
});


const app = express();

// increment in request handler
app.use((req, res, next) => {
  requestCounter.inc();
  next();
});

// expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheusClient.register.contentType);
  res.end(await prometheusClient.register.metrics());
});

app.get('/config', async (req, res) => {
    res.send({apiKey: process.env.API_KEY, secret: process.env.CLIENT_SECRET})
});



const PORT = 4000;

// Service B URL via ClusterIP (Kubernetes service name)
const SERVICE_B_URL = "http://service-b-service-b:3000/hello";

const kafka = new Kafka({
  clientId: "service-a",
  brokers: ["host.docker.internal:9092"],
});

const producer = kafka.producer();

async function initKafka() {
  await producer.connect();
  console.log("Service A connected to Kafka");
}

app.get("/notify-c", async (req, res) => {
  try {
    const message = "hello";

    await producer.send({
      topic: "hello-topic",
      messages: [
        { value: "Hello World" }, // single message inside an array
      ],
    });

    res.send("hello message is published to Kafka for Service C!");
  } catch (err) {
    console.error("Kafka publish error:", err);
    res.status(500).send(`Error publishing message: ${err.message}`);
  }
});

app.get("/call-b", async (req, res) => {
  try {
    const response = await axios.get(SERVICE_B_URL);
    res.send(`Service A got response: "${response.data}"`);
  } catch (err) {
    res.status(500).send(`Error calling Service B: ${err.message}`);
  }
});

app.listen(PORT, async () => {
  console.log(`Service A running on port ${PORT}`);
  await initKafka();
});
