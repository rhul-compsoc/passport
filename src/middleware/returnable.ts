import { NextFunction, Request, Response } from "express";
import { configuration } from "../helpers/configuration";
import { parseIfValidFrontendOrigin } from "../helpers/isValid";

const captureReturnLink = (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.return) return next();

  const validDetials = parseIfValidFrontendOrigin(
    decodeURIComponent(req.query.return as string)
  );

  if (validDetials) {
    res.cookie("return", validDetials.href, configuration.backend.cookie);
  }
  next();
};

const returnToClient = (req: Request, res: Response) => {
  const validDetails = parseIfValidFrontendOrigin(
    req.query.return || req.cookies.return
  );
  res.clearCookie("return", configuration.backend.cookie);

  if (validDetails) {
    res.redirect(validDetails.href);
  } else {
    res.redirect(configuration.frontend.allowedOrigins[0]);
  }
};

export { captureReturnLink, returnToClient };
