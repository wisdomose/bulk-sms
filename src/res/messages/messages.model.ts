import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    ownerId: {
      type: String,
      ref: "user",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    failed: {
      type: Number,
      required: true,
    },

    successful: {
      type: Number,
      required: true,
    },

    cost: {
      type: Number,
      required: true,
    },

    pagesPerMessage: {
      type: Number,
      required: true,
    },

    recipients: {
      type: [String],
      required: true,
    },
  },
  {
    strict: true,
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    virtuals: {
      owner: {
        options: {
          ref: "User",
          localField: "ownerId",
          foreignField: "_id",
          justOne: true,
        },
      },
    },
  }
);

const MessageModel = model("message", MessageSchema);

type TMessage = HydratedDocument<InferSchemaType<typeof MessageSchema>>;

export type { TMessage };
export default MessageModel;
