import jwt from 'jsonwebtoken'
import { configuration } from './configuration'

const sign = (payload: string | object | Buffer) => jwt.sign(payload, configuration.secrets.jwt)
const unpack = (token: string) => {
  try {
    return jwt.verify(token, configuration.secrets.jwt)
  } catch(e) {
    return null
  }
}

export { sign, unpack }
