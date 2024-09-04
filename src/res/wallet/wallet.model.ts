import {
  HydratedDocument,
  InferSchemaType,
  Schema,
  Types,
  model,
} from "mongoose";

const wallet = new Schema(
  {
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
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
  }
);

const WalletModel = model("Wallet", wallet);

type TWallet = HydratedDocument<InferSchemaType<typeof wallet>>;

export type { TWallet };
export default WalletModel;
