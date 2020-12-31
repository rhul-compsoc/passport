import fetch, { RequestInit } from "node-fetch";
import { configuration } from "./config";
import { convertKeys } from "./convertKeys";

const hexget = (url: string, options: RequestInit = {}): Promise<any> => {
  options.headers = Object.assign({}, options.headers, {
    "X-Auth-Token": configuration.secrets.hexillium.token,
  });

  return fetch(configuration.secrets.hexillium.link + url, options)
    .then((req) =>
      // Grab the text
      req.text()
        .then((dat) => {
          console.log('Method: ', options.method || 'GET')
          console.log('Request: ', url);
          console.log('Status: ', req.status);
          console.log('Response: ', dat);
          if (options.body) console.log('Body: ', options.body);
          console.log();

          if (!req.status.toString().startsWith('2')) {
            throw new Error(`Error ${req.status} whilst fetching resource '${url}': ${dat}`)
          }

          if (dat.trim() === '') return null;
          return convertKeys(JSON.parse(dat));
        })
    )
    .then((val) => {
      // If null, return null
      if (val === null) return null;

      // If an empty array, return the empty array
      if (Array.isArray(val) && val.length === 0) return val;

      // If an empty object, return null
      if (Object.keys(val).length === 0) return null;
      return val;
    });
};

const hexdo = (method: string) => (
  url: string,
  options: RequestInit = {},
  payload?: any
): Promise<any> => {
  options.method = method;
  options.body = JSON.stringify(payload);

  return hexget(url, options);
};

const hexpost = hexdo("POST");
const hexdelete = hexdo("DELETE");

export { hexget, hexpost, hexdelete };
