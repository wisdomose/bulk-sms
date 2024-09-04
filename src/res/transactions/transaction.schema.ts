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

const findAllTransactionsSchema = z.object({
  query: z.object({
    page,
    perPage,
    status: z.enum(["failed", "success", ""]).optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
    sortBy: z.string().optional(),
  }),
});

export { findAllTransactionsSchema };

export type TransactionRouter = {
  FindAll: z.infer<typeof findAllTransactionsSchema>;
};
