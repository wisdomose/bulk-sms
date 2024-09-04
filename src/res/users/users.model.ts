import { HydratedDocument, Types } from "mongoose";
import { InferSchemaType, Schema, model } from "mongoose";

const UsersSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      lowercase: true,
    },
    apiKey: {
      type: String,
      unique: true,
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
  }
);

const UserModel = model("User", UsersSchema);

type TUser = HydratedDocument<InferSchemaType<typeof UsersSchema>>;

export type { TUser };
export default UserModel;
