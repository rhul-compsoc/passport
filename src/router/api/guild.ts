import { Router } from 'express';
import passport from 'passport';
import fetch from 'isomorphic-fetch';
import { configuration } from '../../config';
import { isAuthenticated } from '../../middleware/isAuthenticated';

const router = Router();

router
  .get('/:guild', isAuthenticated, (req, res, next) => {
    fetch(configuration.backends.hexillium.location + '/api/getmembers/' + req.params.guild, {
      headers: {
        'X-Auth-Token': configuration.backends.hexillium.token,
        Accept: 'application/json'
      }
    })
      .then((apiRes) => {
        if (apiRes.status === 200) {
          return apiRes.json()
            .then((data) => {
              res.json({
                ok: true,
                data
              })
            })
        } else {
          return apiRes.text()
            .then((err) => {
              res.json({
                ok: false,
                message: err,
                stack: (new Error()).stack
              })
            })
        }
      })
      .catch(err => next(err))
  })

export {
  router as apiGuildRouter
}
