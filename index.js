import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { request } from "express";
dotenv.config();

// console.log(process.env.MONGO_URL);

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

// const MONGO_URL = "mongodb://127.0.0.1";

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo DB connected to server 😎😍");
  return client;
}

const client = await createConnection();

// Creating a server to get a details on Mongodb (Method-GET)
 
app.get("/", async (request, response) => {

  response.send("Welcome to Rentify App 📷 💻");
});

app.get("/products/:productType", async (request, response) => {
  const { productType } = request.params;

  const produ = await client
    .db("equipments")
    .collection("products")
    .find({ productType: productType })
    .toArray();

  response.send(produ);
});

// Creating a server to get all products on Mongodb (Method-GET)

app.get("/products", async (request, response) => {
  const product = await client
    .db("equipments")
    .collection("products")
    .find()
    .toArray();
  response.send(product);
});

// Creating a server to get a details by ID on MongoDb(Method-GET)

app.get("/products/details/:id", async (request, response) => {
  const { id } = request.params;

  const product = await client
    .db("equipments")
    .collection("products")
    .findOne({ id: id });
  console.log(request.params);
  response.send(product);
});

// Creating a server to create the data on collection (Method-POST)
app.post("/products", async (request, response) => {
  // const data = request.body
  const data = request.body;

  const products = await client
    .db("equipments")
    .collection("products")
    .insertOne(data);

  response.send(products);
});

// Creating a server to creating a multiple collections(method-POST)

app.post("/products/many", async (request, response) => {
  const data = request.body;

  const many = await client
    .db("equipments")
    .collection("products")
    .insertMany(data);

  response.send(many);
});

// Creating a server to edit an individualDatas (Method-PUT)
app.put("/products/details/:id", async (request, response) => {
  const { id } = request.params;
  // const change = {"rental":"6000"}
  const change = request.body;

  const create = await client
    .db("equipments")
    .collection("products")
    .updateOne({ id: id }, { $set: change });
  response.send(create);
});

// Creating a server to edit an Multiple Datas (Method-PUT)

app.put("/products/detail/:productType", async (request, response) => {
  const { productType } = request.params;
  const change = request.body;
  const create = await client
    .db("equipments")
    .collection("products")
    .updateMany({ productType: productType }, { $set: change });
  response.send(create);
});

// Creating a server to delete an individualDatas (Method-DELETE)

app.delete("/products/:id", async (request, response) => {
  const { id } = request.params;

  const del = await client
    .db("equipments")
    .collection("products")
    .deleteOne({ id: id });

  response.send(del);
});

// Creating a server to edit an Multiple Datas (Method-DELETE)

app.delete("/products/details/:productType", async (request, response) => {
  const { productType } = request.params;

  const delMany = await client
    .db("equipments")
    .collection("products")
    .deleteMany({ productType: productType });

  response.send(delMany);
});

app.listen(PORT, () => console.log(`server is started ${PORT}`));
