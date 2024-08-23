import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { LIB_AUTOMATION } from "@digital-alchemy/automation";
import { CreateApplication, StringConfig } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";

type Environments = "development" | "production" | "test";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

function getServices(dir: string) {
  const getFiles = (dir: string) => {
    return fs.readdirSync(dir).reduce<string[]>((serviceFiles, file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        return serviceFiles.concat(getFiles(fullPath));
      } else if (file.endsWith(".service.ts")) {
        serviceFiles.push(fullPath);
      }

      return serviceFiles;
    }, []);
  };

  return getFiles(dir).reduce((acc, servicePath) => {
    console.log(`Service file found:`, servicePath);

    const service = require(servicePath);
    const name = extractServiceName(servicePath);

    return { ...acc, [name]: service.default.service };
  }, {});
}

function extractServiceName(path) {
  const parts = path.split("/");
  const servicesIndex = parts.indexOf("services");

  if (servicesIndex !== -1 && servicesIndex + 1 < parts.length) {
    const serviceNameParts = parts.slice(servicesIndex + 1, parts.length - 1);
    const fileName = parts[parts.length - 1].replace(".service.ts", "");
    return [...serviceNameParts, fileName].join("/");
  }

  throw new Error("Could not extract service name from path", path);
}

const app = CreateApplication({
  configuration: {
    NODE_ENV: {
      type: "string",
      default: "development",
      enum: ["development", "production", "test"],
      description: "Code runner addon can set with it's own NODE_ENV",
    } satisfies StringConfig<Environments>,
  },

  libraries: [LIB_HASS, LIB_SYNAPSE, LIB_AUTOMATION],

  //@ts-expect-error
  name: process.env.APP_NAME,
  priorityInit: [],
  services: getServices(__dirname + "/services"),
});

setImmediate(
  async () =>
    await app.bootstrap({
      bootLibrariesFirst: true,
      configuration: {
        boilerplate: { LOG_LEVEL: "info" },
      },
    })
);
