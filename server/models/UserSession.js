var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: ""
  },
  timeStamp: {
    type: Date,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = Session = mongoose.model("UserSession", UserSessionSchema);
