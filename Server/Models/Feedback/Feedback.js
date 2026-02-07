import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const FeedbackSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Feedback", FeedbackSchema);