const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/registrationformData2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection successfull...");
  })
  .catch((err) => {
    console.log(`not connected ${err}`);
  });
