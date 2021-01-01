import jwt from 'jsonwebtoken'
import { configuration } from './configuration'

const sign = (payload: string | object | Buffer) => jwt.sign(payload, configuration.secrets.jwt)
const unpack = (token: string): {[key: string]: string} | null => {
  try {
    return jwt.verify(token, configuration.secrets.jwt) as {}
  } catch(e) {
    return null
  }
}

export { sign, unpack }
