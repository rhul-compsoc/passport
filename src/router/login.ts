import { Router } from "express";
import multer from "multer";
import passport from "passport";

const router = Router();

router
  .use('/microsoftonline.com',
    multer().none(),
    passport.authenticate('azuread-openidconnect', {
      failureRedirect: '/fail'
    })
  )
  .use('/microsoftonline.com/return',
    multer().none(),
    passport.authenticate('azuread-openidconnect', {
      failureRedirect: '/fail',
    })
  )
  .get("/discordapp.com", passport.authenticate("discord"))
  .get(
    "/discordapp.com/return",
    passport.authenticate("discord", {
      failureRedirect: "/fail",
      successRedirect: "/",
    })
  )
  .get("/github.com", passport.authenticate("github"))
  .get(
    "/github.com/return",
    passport.authenticate("github", {
      failureRedirect: "/fail",
      successRedirect: "/",
    })
  )
  .get("/info", (req, res) => {
    res.json(req.user);
  })
  .get("/logout", (req, res) => {
    req.logout();
    res.json({
      ok: true,
    });
  });

export { router as loginRouter };
