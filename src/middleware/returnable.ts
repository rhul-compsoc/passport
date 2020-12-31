import { NextFunction, Request, Response } from "express";
import { configuration } from "../helpers/configuration";
import { parseIfValidFrontendOrigin } from "../helpers/isValid";

const captureReturnLink = (req: Request, res: Response, next: NextFunction) => {
  const validDetials = parseIfValidFrontendOrigin(req.query.return);

  if (validDetials) {
    res.cookie('return', validDetials.href)
  }
  next();
}

const returnToClient = (req: Request, res: Response) => {
  res.clearCookie('return');

  const validDetails = parseIfValidFrontendOrigin(req.cookies.return)

  if (validDetails) {
    res.redirect(validDetails.href)
  } else {
    res.redirect(configuration.frontend.allowedOrigins[0])
  }
}

export { captureReturnLink, returnToClient }
