import mongoose from "mongoose";
import "dotenv.config";
import { app } from "./app.js";

// dotenv.config();

let db_host: string;
if (process.env.DB_HOST) {
  db_host = process.env.DB_HOST;
  console.log(db_host);
} else {
  throw new Error("DB_HOST is not set");
}

console.log("test");

const testing = "Testing";

console.log(testing);

// app.listen(4000, () => {
//   console.log("server started");
// });

//uWC46JklRXm0zUuS pass to MongoDB Softycat
//login Volodymyr
//5nP*x2puWVSkRyc

// const DB_HOST =
//   "mongodb+srv://Volodymyr:uWC46JklRXm0zUuS@cluster0.umeqkvv.mongodb.net/cat_society?retryWrites=true&w=majority";

mongoose
  .connect(db_host)
  .then(() => {
    console.log("cat_society success connection");
    app.listen(4000, () => {
      console.log("server started");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
