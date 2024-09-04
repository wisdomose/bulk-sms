import { NextFunction, Request, Response } from "express";
import Exception from "../lib/Exception";
import jwt from "jsonwebtoken";
import { LoginJWT } from "../types/global";
import config from "../lib/config";
import adminService from "../res/admin/admin.service";
import usersService from "../res/users/users.services";

export type roles = "admin" | "user";

/**
 *
 * Specify the type of account that can access this route.
 * use a string for a single account role and an array if
 * different user roles can access the route
 *
 */

export default function protectedRoute(role: roles | roles[]) {
  return async function (req: Request, res: Response, next: NextFunction) {

    const auth = req.headers.authorization;

    // chech if auth header exists
    if (!auth)
      throw new Exception({ code: 401, message: "Authorization failed" });
    try {
      jwt.verify(auth.split(" ")[1], config.SECRET);
    } catch (error: any) {
      throw new Exception({ code: 401, message: "Authorization failed" });
    }

    // decode jwt
    const decoded = jwt.decode(auth.split(" ")[1]) as LoginJWT;

    if (!decoded)
      throw new Exception({ code: 401, message: "Authorization failed" });

    // if it is an array and the decoded role role isn't specified in
    // the array or the decoded role and specified role don't match

    if (Array.isArray(role) && !role.includes(decoded.role)) {
      throw new Exception({ code: 401, message: "Authorization failed" });
    } else if (!Array.isArray(role) && decoded.role !== role) {
      throw new Exception({ code: 401, message: "Authorization failed" });
    }

    switch (decoded.role) {
      case "admin":
        const admin = await adminService.findOne({ _id: decoded._id }, true);
        if (!admin)
          throw new Exception({ code: 401, message: "Authorization failed" });
        res.locals.admin = admin;
        res.locals.role = "admin";

        break;
      case "user":
        const user = await usersService.findOne({ _id: decoded._id }, true);
        if (!user)
          throw new Exception({ code: 401, message: "Authorization failed" });
        res.locals.user = user;
        res.locals.role = "user";

        break;
      default:
        throw new Exception({ code: 401, message: "Authorization failed" });
    }

    next();
  };
}
