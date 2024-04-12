import { UserTokenForm } from "./user.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenForm;
    }
  }
}
