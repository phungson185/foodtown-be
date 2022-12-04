const mongoose = require("mongoose");

const sponsorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      name: {
        type: String,
        trim: true,
      },
      data: {
        type: Buffer,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Sponsor = mongoose.model("Sponsor", sponsorSchema);
module.exports = Sponsor;
