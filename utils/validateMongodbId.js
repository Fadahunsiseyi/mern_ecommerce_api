const mongoose = require("mongoose");

const validateId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("The id is invalid, or does not exist");
};

module.exports = validateId;
