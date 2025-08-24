import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    signedCurr: {
      type: String,
      required: true,
    },
    currentCurr: {
      type: String,
      required: true,
    },
    refreshTokens: [{ type: String }],
  },
  { timestampes: true }
);

const Users = mongoose.model("user", userSchema);

export default Users;
