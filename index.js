require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 5000;


// middle ware
app.use(cors());
app.use(express.json());




const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const nebsCollection = client.db('nebsTaskDb').collection('publishNotice');
    
// all notice
    app.get("/notices", async (req, res) => {
      const result = await nebsCollection.find().toArray();
      res.send(result);
    })

    // single notice 
    app.get("/notices/:id", async (req, res) => {
      const {id} = req.params;
      const filter = {_id: new ObjectId(id)};
      const result = await nebsCollection.findOne(filter);
      res.send(result);
    })

    // notice update
    app.patch("/notices/:id", async (req, res) => {
      const {id} = req.params;
      const filter = {_id: new ObjectId(id)};
      const data = req.body;
      const updateDoc = {
        $set: data
      }

      const result = await nebsCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.post("/notices", async (req, res) => {
      const data = req.body;
      const result = await nebsCollection.insertOne(data);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
