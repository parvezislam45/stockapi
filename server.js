const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
const cron = require('node-cron');

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://parvezislam:WZs4JvcRJ4hNqquw@cluster0.hvtlpip.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run (){
    try{
        await client.connect();
        const apiCollection = client.db("apiCollection").collection("collection");
        app.get("/api", async (req, res) => {
          const query = {};
          const cursor = apiCollection.find(query);
          const api = await cursor.toArray();
          res.send(api);
        });

        cron.schedule('* * * * * *', async () => {
          try {
            const apiCollection = client.db('apiCollection').collection('collection');
            const allDocuments = await apiCollection.find({}).toArray();
            const randomSelect = randomItem(allDocuments);
            for (let i = 0; i < 3; i++) {
              const document = randomSelect[i];
              const newPrice = generateRandomPrice();
              const query = { _id: document._id }; 
              const update = { $set: { price: newPrice } };
    
              await apiCollection.updateOne(query, update);
            }
    
            console.log('Prices updated successfully');
          } catch (error) {
            console.error('Error updating prices:', error);
          }
        });  }
    finally{}
}

function generateRandomPrice() {
  
  const minPrice = 70;
  const maxPrice = 200;
  return Math.floor(Math.random() * (maxPrice - minPrice + 1) + minPrice);
}

function randomItem(array) {
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("Alhamdulliah Your server is Running");
  });
  app.listen(port, () => {
    console.log("Alhamdullilah Your server is Start");
  });