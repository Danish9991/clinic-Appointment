const mongoose = require("mongoose");

 const doctorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      name:String,
      image:String,
      specialization:String,
      description:String,
 });

 module.exports = mongoose.model("Doctor", doctorSchema);