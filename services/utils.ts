import { TServiceParams } from "@digital-alchemy/core";

export function createService(service: (params: TServiceParams) => void) {
  return { service };
}
