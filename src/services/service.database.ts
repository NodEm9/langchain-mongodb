import 'dotenv/config';
import { MongoClient } from "mongodb";
import { MONGO_URI } from '../constants/env';


const client = new MongoClient(MONGO_URI);

export const main = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  client.close();
}

main().catch(console.error);