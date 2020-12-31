import { Request, Response } from "express";
import { parseIfValidFrontendOrigin } from "../helpers/isValid";

const cors = (req: Request, res: Response) => {
  const validDetails = parseIfValidFrontendOrigin(req.headers.origin);

  if (validDetails) {
    res.header("Access-Control-Allow-Origin", validDetails.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
  }
}

export { cors }
