import { HydratedDocument, Types } from "mongoose";
import { InferSchemaType, Schema, model } from "mongoose";

const transaction = new Schema(
  {
    // id of user who initiated the transaction
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    // payment reference - monnify or paystack reference
    reference: {
      type: String,
      required: false,
    },
    // type of transaction
    type: {
      type: String,
      enum: ["deposit", "debit"],
    },
    // status of the transaction
    status: {
      type: String,
      enum: ["failed", "successful"],
    },
    // amount paid
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
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

const TransactionModel = model("Transaction", transaction);

type TTransaction = HydratedDocument<InferSchemaType<typeof transaction>>;

export type { TTransaction };
export default TransactionModel;
