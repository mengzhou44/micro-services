require('dotenv').config();
const { Kafka } = require('kafkajs');
const { saveEvent } = require("./save-event");

const kafka = new Kafka({
  clientId: 'service-c',
  brokers: ['host.docker.internal:9092'],
});

const consumer = kafka.consumer({ groupId: 'service-c-group' });

async function start() {
  await consumer.connect();
  console.log('Service C connected to Kafka');

  await consumer.subscribe({
    topic: 'hello-topic',
    fromBeginning: true,   // you’ll get all past events
  });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    try {
      const msg = message.value?.toString();
      console.log(`Hi, Service C received message [${topic}]: ${msg}`);

      const eventId = await saveEvent(msg);
      console.log(`Event ${eventId} is inserted into comsobs db`)

    } catch (err) {
      console.error(`Error processing message [${topic}]`, {
        partition,
        message: message.value?.toString(),
        error: err.message,
        stack: err.stack,
      });
    }
  },
});
}

start().catch((err) => {
  console.error('Error in Service C Kafka consumer:', err);
  process.exit(1);
});
