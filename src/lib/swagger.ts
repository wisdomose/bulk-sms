import { Express, Request, Response } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { version } from "../../package.json";
import logger from "./logger";
import { generateSchema } from "@anatine/zod-openapi";
import { loginSchema } from "./schemas";
import { signupSchema } from "../res/users/user.schema";
import { updateSettingsSchema } from "../res/settings/settings.schema";
import { sendMessageSchema } from "../res/messages/messages.schema";

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bulk sms API Docs",
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        signup: generateSchema(signupSchema, true, "3.0")?.properties?.body,
        login: generateSchema(loginSchema, true, "3.0")?.properties?.body,
        settings: {
          update: generateSchema(updateSettingsSchema, true, "3.0")?.properties
            ?.body,
        },
        messages: {
          send: generateSchema(sendMessageSchema, true, "3.0")?.properties
            ?.body,
        },
      },
      parameters: {
        page: {
          in: "query",
          name: "page",
          required: false,
          schema: {
            type: "number",
          },
        },
        perPage: {
          in: "query",
          name: "perPage",
          required: false,
          description: "number of items per page",
          schema: {
            type: "number",
          },
        },
        apiKey: {
          in: "query",
          name: "api_key",
          required: true,
          description: "user API key",
          schema: {
            type: "string",
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/lib/router.ts", "./src/res/**/*.router.ts"],
};

const swaggerSpec = swaggerJsDoc(options);

export default function swaggerDocs(app: Express, port: number) {
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.get("doc.json", (req: Request, res: Response) => {
    res.setHeader("content-type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info("DOCS: /docs");
}
