const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
  }
);

// This function will run *before* a new user is saved
userSchema.pre('save', async function (next) {
  // 'this' refers to the user being saved
  // Only hash the password if it's new or has been modified
  if (!this.isModified('password')) {
    return next();
  }

  // 'genSalt' creates a "salt" to make the hash secure
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// Add a method to the user schema to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password stored in the database
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
