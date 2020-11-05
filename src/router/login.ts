import { Router } from 'express';
import multer from 'multer';
import passport from 'passport';

const router = Router();

router
  // .use('/microsoft',
  //   multer().none(),
  //   passport.authenticate('azuread-openidconnect', {
  //     failureRedirect: '/fail'
  //   })
  // )
  // .use('/microsoft/return',
  //   multer().none(),
  //   passport.authenticate('azuread-openidconnect', {
  //     failureRedirect: '/fail',
  //   })
  // )
  .get('/discord',
    passport.authenticate('discord')
  )
  .get('/discord/return',
    passport.authenticate('discord', {
      failureRedirect: '/fail',
      successRedirect: '/',
    })
  )
  .get('/github',
    passport.authenticate('github')
  )
  .get('/github/return',
    passport.authenticate('github', {
      failureRedirect: '/fail',
      successRedirect: '/',
    })
  )
  .get('/info', (req, res) => {
    res.json(req.user);
  })
  .get('/logout', (req, res) => {
    req.logout();
    res.json({
      ok: true
    })
  })

export {
  router as loginRouter
}
