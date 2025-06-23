import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  code: { type: String, default: "" },
});

export default mongoose.model("Code", CodeSchema);
