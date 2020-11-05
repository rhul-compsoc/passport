import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

interface OAuthDetails {
  clientID: string;
  clientSecret: string;
}

interface Configuration {
  secrets: {
    discord: OAuthDetails;
    github: OAuthDetails;
    microsoft: OAuthDetails;
  };
  location: {
    origin: string;
    https: boolean;
  };
  webserver: {
    port: number;
    sessionSecret: string;
    allowedOrigins: string[];
  }
  backends: {
    hexillium: {
      location: string;
      token: string;
    }
  }
}

const configuration = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '..', 'data', 'config.yaml'), { encoding: 'utf-8' })) as Configuration

export { configuration }
