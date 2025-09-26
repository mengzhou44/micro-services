const { Kafka } = require('kafkajs');

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
      const msg = message.value?.toString(); 
      console.log(`Service C received message [${topic}]: ${msg}`);
    },
  });
}

start().catch((err) => {
  console.error('Error in Service C Kafka consumer:', err);
  process.exit(1);
});
