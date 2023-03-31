const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connect to database success");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
module.exports = connectDB;
