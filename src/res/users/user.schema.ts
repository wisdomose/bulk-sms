import { z } from "zod";
import { page, perPage } from "../../lib/schemas";

const signupSchema = z.object({
  body: z.object(
    {
      email: z.string({ required_error: "Email is required" }).email(),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password should be a minimum of 6 characters"),
      displayName: z.string({ required_error: "Display name is required" }),
    },
    { required_error: "Account credentials is requred" }
  ),
});

const editEmailSchema = z.object({
  body: z.object(
    {
      email: z.string({ required_error: "Email is required" }).email(),
    },
    { required_error: "Account details is required" }
  ),
});

const findAllSchema = z.object({
  query: z.object({
    page,
    perPage,
  }),
});

const findOneSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "User id is required" }),
  }),
});

export { editEmailSchema, findAllSchema, findOneSchema, signupSchema };

export type UserRouter = {
  Edit: z.infer<typeof editEmailSchema>;
  Signup: z.infer<typeof signupSchema>;
  FindAll: z.infer<typeof findAllSchema>;
  FindOne: z.infer<typeof findOneSchema>;
};
