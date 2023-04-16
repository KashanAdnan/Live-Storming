const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const conectDataBase = (url) => {
  mongoose
    .connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then((data) => {
      console.log(`MongoDB Connected With Server ${data.connection.host}`);
    });
};

module.exports = conectDataBase;
