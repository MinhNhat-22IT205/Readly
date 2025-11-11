import { ServerError } from "@shared-types/server-error.type";

export const isServerError = (value: unknown): value is ServerError => {
  return typeof value === "object" && value !== null && "statusCode" in value;
};
