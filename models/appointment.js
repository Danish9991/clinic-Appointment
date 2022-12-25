const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 const appointSchema = new Schema({
    contact: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
      }

 });

 module.exports = mongoose.model("Appointment", appointSchema);