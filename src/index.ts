import mongoose from "mongoose";
import "dotenv/config";
import { app } from "./app.js";

let db_host: string;
let port: string;
if (process.env.DB_HOST && process.env.PORT) {
  db_host = process.env.DB_HOST;
  port = process.env.PORT;
} else {
  throw new Error("DB_HOST,PORT are not set");
}

console.log("test");

//uWC46JklRXm0zUuS pass to MongoDB Softycat
//login Volodymyr
//5nP*x2puWVSkRyc

mongoose
  .connect(db_host)
  .then(() => {
    console.log("cat_society success connection");
    app.listen(port, () => {
      console.log("server started");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

const error = new Error();

console.log(error);
