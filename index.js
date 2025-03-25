const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uomr8.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    // DATABASE+COLLECTIONS
    const productCollection = client.db('EmaJohnDB').collection('productsCollection');

    //**************APIs ********************/ 
    app.get('/products', async(req, res) => {
      // const query=req.query
      // console.log("QUERY=>",query);
      const page=parseInt(req.query.page)
      const size=parseInt(req.query.size)

      const result = await productCollection.find()
      .skip(page*size)
      .limit(size)
      .toArray();
      res.send(result);
    })

    app.post('/productsByIds',async(req,res)=>{
      const productIds=req.body;
      const ids=productIds.map(prod=>new ObjectId(prod))
      // console.log(ids);
      const query={_id:{$in:ids}}
      const products=await productCollection.find(query).toArray()
      // console.log(productIds);
      // console.log(products);
      res.send(products)
    })

    app.get('/productsCount',async(req,res)=>{
      const productsCount=await productCollection.estimatedDocumentCount()
      // console.log(productsCount);
      res.send({productsCount})
    })




    //*************************************/ 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('john is busy shopping')
})

app.listen(port, () =>{
    console.log(`ema john server is running on port: ${port}`);
})
