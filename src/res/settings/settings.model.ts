import { InferSchemaType, Schema, model } from "mongoose";

const SettingsSchema = new Schema(
  {
    costPerPage: {
      type: Number,
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

const SettingsModel = model("Setting", SettingsSchema);

type TSettings = InferSchemaType<typeof SettingsSchema>;

export type { TSettings };
export default SettingsModel;
