import { Router } from "express";
import fetch from "node-fetch";
import { URL, URLSearchParams } from "url";
import { configuration } from "../helpers/configuration";
import { sign } from "../helpers/jwt";
import { captureReturnLink, returnToClient } from "../middleware/returnable";

const router = Router();
const clientId = configuration.secrets.oauth.discord.clientId
const redirectUri = configuration.location.origin + configuration.secrets.oauth.discord.redirect

router
  .get('/redirect', captureReturnLink, (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`)
  })
  .get('/return', async (req, res, next) => {
    const code = req.query.code;

    if (typeof code !== 'string') return next();

    const params = new URLSearchParams({
      client_id: configuration.secrets.oauth.discord.clientId,
      client_secret: configuration.secrets.oauth.discord.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      scope: 'identify'
    });

    try {
      const auth = await fetch(`https://discordapp.com/api/v7/oauth2/token`, {
        method: 'POST',
        body: params
      }).then(a => a.json())

      console.log('auth', auth)

      if (auth === null) return next();
      if (typeof auth.access_token !== 'string') return next();

      const user = await fetch(`https://discordapp.com/api/v7/users/@me`, {
        headers: {
          Authorization: `Bearer ${auth.access_token}`
        }
      }).then(a => a.json())

      console.log('user', user)

      if (user === null) return next();
      if (typeof user.id !== 'string') return next();

      res.cookie('token', sign(user))
      next()
    } catch (e) {
      next(e);
    }
  }, returnToClient)

export {
  router as loginRouter
}
