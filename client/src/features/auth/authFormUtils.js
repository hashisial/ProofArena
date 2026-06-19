import { getUserErrorMessage } from "../../errors/index.js";

export function getAuthErrorMessage(error, fallbackMessage) {
  return getUserErrorMessage(error) || fallbackMessage;
}
