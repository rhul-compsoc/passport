import yaml from "js-yaml";
import path from "path";
import fs from "fs";

interface OAuthConfiguration {
  clientId: string
  clientSecret: string
}

interface Configuration {
  location: {
    origin: string
  }
  secrets: {
    jwt: string
    cookies: string
    hexillium: {
      link: string
      token: string
    }
    oauth: {
      discord: OAuthConfiguration
    }
  }
}

const configuration = yaml.safeLoad(
  fs.readFileSync(path.resolve(__dirname, "..", "data", "config.yaml"), {
    encoding: "utf-8",
  })
) as Configuration;

export { configuration };
