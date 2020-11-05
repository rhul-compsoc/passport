import { NextFunction, Request, Response } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.json({
      ok: false,
      message: 'You are not authenticated!',
      stack: (new Error()).stack
    })
  }
}

export {
  isAuthenticated
}
