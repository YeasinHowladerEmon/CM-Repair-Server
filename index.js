
const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId, } = require('bson');
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3xzol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('error', err)
  const serviceCollection = client.db("repiarData").collection("service");
  const bookingCollection = client.db("repiarData").collection("booking");
  const reviewCollection = client.db("repiarData").collection("review");
  const adminCollection = client.db("repiarData").collection("admin");

  app.get('/services', (req, res) =>{
    serviceCollection.find()
    .toArray((err, items) =>{
      res.send(items);
    })
  })

app.post('/addService', (req, res) =>{
  const newService = req.body;
  console.log('add hoise ', newService)
  serviceCollection.insertOne(newService)
  .then(result =>{
    console.log('inserted count', insertedCount);
    res.send(result.insertedCount > 0)
  })

})
app.post('/addReview', (req, res) =>{
  const newReview = req.body;
  console.log('add hoise ', newReview)
  reviewCollection.insertOne(newReview)
  .then(result =>{
    console.log('inserted count', insertedCount>0);
    res.send(result.insertedCount > 0)
  })
})

app.get('/review', (req, res) =>{
  reviewCollection.find()
  .toArray((err, items) =>{
    res.send(items);
  })
})

app.get('/service/:id', (req, res) =>{
  serviceCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, document) =>{
    res.send(document)
  })
})

app.post('/addBook', (req, res) =>{
  const order = req.body;
  console.log('add ', order)
  bookingCollection.insertOne(order)
  .then(result =>{
    console.log('inserted count', result.insertedCount);
    res.send(result.insertedCount > 0)
  })
})

app.get('/orderList', (req, res) => {
  // console.log(req.query.email)
  bookingCollection.find()
  .toArray((err, documents) => {
    console.log(documents)
    res.send(documents)
  })
})


app.get('/bookList', (req, res) => {
  // console.log(req.query.email)
  bookingCollection.find({email: req.query.email})
  .toArray((err, documents) => {
    console.log(documents)
    res.send(documents)
  })
})

app.post('/createAdmin', (req, res) =>{
  const admin = req.body;
  adminCollection.insertOne(admin)
  .then(result => {
    console.log('insertedCount', insertedCount)
    res.send(result.insertedCount > 0)
  })
})

app.get('/isAdmin', (req, res) =>{
  const adminEmail = req.body;
  console.log(adminEmail)
  adminCollection.find({email: req.body.email})
  .toArray((err, admin) =>{
    res.send(admin.length > 0)
   res.send(admin.email === adminEmail)
    })
})
app.delete('/deleteService/:id', (req, res) =>{
  const id = ObjectId(req.params.id)
  console.log("delete this", id)
  serviceCollection.deleteOne({_id: id})
  .then( result => {
    console.log(result);
      });
  })


});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})