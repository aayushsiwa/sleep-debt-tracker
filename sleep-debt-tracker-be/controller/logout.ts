import { Request } from "express";
import { Response as CookieResponse } from "express-serve-static-core";

export const logout = (req: Request, res: CookieResponse) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true, sameSite: "strict" });
  res.status(200).json({ message: "Logged out successfully" });
};
