import { randomBytes } from "crypto";
/** ID acak 8 karakter heksadesimal */
export function newId(): string {
  return randomBytes(4).toString("hex");
}
