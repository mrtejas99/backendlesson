import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = mongoose.Schema(
  {
    videoFile: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      index: true
    },
    title: {
      type: String,
      required: true,
      index: true
    },
    duration: {
      type: Number,
      required: true
    },
    views: {
      type: Number,
      required: true,
      default: 0
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true }
)

videoSchema.plugin(mongooseAggregatePaginate)
const Video = mongoose.model("Video", videoSchema)

export default Video
