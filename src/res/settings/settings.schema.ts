import { z } from "zod";

const updateSettingsSchema = z.object(
  {
    body: z.object(
      {
        costPerPage: z.number().optional(),
      },
      { required_error: "No settings provided" }
    ),
  },
  { required_error: "No settings provided" }
);

export { updateSettingsSchema };

export type SettingsRouter = {
  Update: z.infer<typeof updateSettingsSchema>;
};
