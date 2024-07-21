import mongoose from "mongoose"

//there is a channel which has subscribers
//also, a channel can subscribe to another channel
const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.type.ObjectId,
      ref: "User"
    },
    channel: {
      type: mongoose.Schema.type.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

const Subscription = mongoose.model("Subscription", subscriptionSchema)
