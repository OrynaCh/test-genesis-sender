import App from "./app";
import { EmailController } from "./controllers/email.controller";

const app = new App(
  [
    new EmailController(),
  ],
  3005,
);

app.listen();
