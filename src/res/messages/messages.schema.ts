import { z } from "zod";

const sendMessageSchema = z.object({
  body: z.object(
    {
      // recipients: z.string({ required_error: "Recipients are required" }),
      recipients: z.array(
        z
          .string()
          .regex(new RegExp(/^0|(\+234)\d{10}$/gm), "Invalid phone number"),
        { required_error: "Recipients are required" }
      ),
      message: z
        .string({ required_error: "Message is required" })
        .min(1, "Message is required"),
      // from: z.string({ required_error: "Your identifier is required" }),
    },
    { required_error: "Message details is required" }
  ),
  query: z.object(
    {
      api_key: z.string({ required_error: "API key is required" }),
    },
    { required_error: "API key is required" }
  ),
});

export { sendMessageSchema };

export type SMSRouter = {
  Send: z.infer<typeof sendMessageSchema>;
};
