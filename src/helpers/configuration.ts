import yaml from "js-yaml";
import path from "path";
import fs from "fs";

interface OAuthConfiguration {
  clientId: string
  clientSecret: string
  redirect: string
}

interface Configuration {
  frontend: {
    allowedOrigins: string[]
  }
  location: {
    origin: string
  }
  compsoc: {
    guildId: string
    avatarUrl: string
    guildName: string
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
  fs.readFileSync(path.resolve(__dirname, "..", "..", "data", "config.yaml"), {
    encoding: "utf-8",
  })
) as Configuration;

export { configuration };
