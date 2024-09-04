import { extendApi } from "@anatine/zod-openapi";
import { z } from "zod";

const page = z
  .string()
  .transform((val, ctx) => {
    const parsed = parseInt(val);
    if (!val) return 1;
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Page must be a number",
      });
      return z.NEVER;
    }
    if (parsed < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid page",
      });
      return z.NEVER;
    }

    return parsed;
  })
  .optional();

const perPage = z
  .string()
  .transform((val, ctx) => {
    const parsed = parseInt(val);
    if (!val) return 1;
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Page must be a number",
      });
      return z.NEVER;
    }
    if (parsed < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid page",
      });
      return z.NEVER;
    }

    return parsed;
  })
  .optional();

const loginSchema = z.object({
  body: z.object(
    {
      username: extendApi(
        z
          .string({ required_error: "Username is required" })
          .email("Invalid email or phone number"),
        {
          title: "username",
          description: "User email",
        }
      ),
      password: extendApi(
        z
          .string({ required_error: "Password is required" })
          .min(6, "Password should be a minimum of 6 characters"),
        {
          title: "password",
          description: "Account password",
        }
      ),
    },
    { required_error: "Account credentials is requred" }
  ),
});

export { page, perPage, loginSchema };

export type GlobalSchema = {
  Login: z.infer<typeof loginSchema>;
  Page: z.infer<typeof page>;
  PerPage: z.infer<typeof perPage>;
};
