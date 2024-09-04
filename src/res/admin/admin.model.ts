import { HydratedDocument, Types } from "mongoose";
import { InferSchemaType, Schema, model } from "mongoose";

const AdminSchema = new Schema(
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

const AdminModel = model("Admin", AdminSchema);

type TAdmin = HydratedDocument<InferSchemaType<typeof AdminSchema>>;

export type { TAdmin };
export default AdminModel;
