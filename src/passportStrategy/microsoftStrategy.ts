import { Request } from 'express';
import { IProfile as MicrosoftProfile, OIDCStrategy, VerifyCallback } from 'passport-azure-ad';
import { configuration } from '../config';
import { UserConnectionPlatform } from '../enum/UserConnectionPlatform';
import { rhulEmailRegex } from '../help/regex';
import { strategyFunction } from './strategyFunction';

const microsoftStrategy = new OIDCStrategy({
  identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
  clientID: configuration.secrets.microsoft.clientID,
  clientSecret: configuration.secrets.microsoft.clientSecret,
  passReqToCallback: true,
  redirectUrl: configuration.location.origin + '/login/microsoft/return',
  responseType: 'code',
  scope: ['email', 'profile'],
  responseMode: 'form_post',
  allowHttpForRedirectUrl: !configuration.location.https,
  loggingLevel: 'info',
  validateIssuer: false,
}, async (req: Request, profile: MicrosoftProfile, done: VerifyCallback) => {

  if (!profile.oid)
    return done(new Error('Missing unique ID from response.'));

  if (!profile._json.email)
    return done(new Error('First.Last.1992@live.rhul.ac.uk style email missing from `_json` field.'));

  if (!profile._json.preferred_username)
    return done(new Error('XXXX000@live.rhul.ac.uk style email missing from `_json` field.'));

  if (!rhulEmailRegex.test(profile._json.preferred_username))
    return done(new Error('Malformed email, or not a RHUL University email address.'));

  strategyFunction({
    req,
    done,
    userConnection: {
      id: profile.oid,
      platform: UserConnectionPlatform.MICROSOFT,
      username: profile._json.preferred_username,
      email: profile._json.email,
      displayName: profile._json.name,
    }
  })
})

export { microsoftStrategy };
