import { NextFunction, Request, Response } from "express";
import Exception from "../lib/Exception";
import logger from "../lib/logger";

export function errorMiddleware(
  error: Exception,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.error(error.message);
    return res.status(error.code).send(error.message).end();
  } catch (error) {
    return res.status(500).send("An error occured").end();
  }
}
