const { CosmosClient } = require("@azure/cosmos");

// Use real Cosmos DB account info

const COSMOS_KEY = process.env.COSMOS_KEY;
const DATABASE_ID = process.env.COSMOS_DB;
const CONTAINER_ID = process.env.COSMOS_CONTAINER;

// Cosmos DB endpoint
const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;

const cosmosClient = new CosmosClient({
  endpoint: COSMOS_ENDPOINT,
  key: COSMOS_KEY,
});

const database = cosmosClient.database(DATABASE_ID);
const container = database.container(CONTAINER_ID);
 

/**
 * Saves an event with a timestamp into Cosmos DB
 * @param {string} eventMessage
 */
async function saveEvent(eventMessage) {
  try {
    console.log("Saving event to Cosmos DB...");

    const item = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`, // unique ID
      event: eventMessage,
      timestamp: new Date().toISOString(),
    };

    const { resource } = await container.items.create(item);
    console.log(`Event inserted with id: ${resource.id}`);
    return resource.id;
  } catch (err) {
    console.error("Error saving event:", err);
    throw err;
  }
}

module.exports = { saveEvent };
