const mongoose = require("mongoose");

 const notificationSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
      },
      create: {
          type:Date,
          default:Date.now
       },
 });

 module.exports = mongoose.model("Notification", notificationSchema);