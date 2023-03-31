const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: String
    ,
    withlist: [{
      type: mongoose.Types.ObjectId,
      req: "Product"
    }],
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product"
        },
        quantity: Number,
        color: String
      }
    ],
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000
    return resetToken;
  }
};

//Export the model
module.exports = mongoose.model("User", userSchema);
