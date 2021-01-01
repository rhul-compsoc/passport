import { NextFunction, Request, Response } from "express";
import { parseIfValidFrontendOrigin } from "../helpers/isValid";

const cors = (req: Request, res: Response, next: NextFunction) => {
  const validDetails = parseIfValidFrontendOrigin(req.headers.origin);

  if (validDetails) {
    res.header("Access-Control-Allow-Origin", validDetails.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  }

  // Check if it's an OPTIONS query
  if (req.method === "OPTIONS") {
    res.send();
  } else {
    next();
  }
};

export { cors };
