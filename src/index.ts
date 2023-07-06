import mongoose from "mongoose";
import { app } from "./app.ts";

console.log("test");

const testing = "Testing";

console.log(testing);

// app.listen(4000, () => {
//   console.log("server started");
// });

//uWC46JklRXm0zUuS pass to MongoDB Softycat
//login Volodymyr
//5nP*x2puWVSkRyc

const DB_HOST =
  "mongodb+srv://Volodymyr:uWC46JklRXm0zUuS@cluster0.umeqkvv.mongodb.net/cat_society?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
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
