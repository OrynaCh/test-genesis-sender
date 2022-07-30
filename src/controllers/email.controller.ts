import * as express from "express";
import { BitcoinService, IBitcoinService } from "../services/bitcoin.service";
import { BroadcastService, IBroadcastService } from "../services/broadcast.service";
import { EmailRepoService, IEmailRepoService } from "../services/email-repository.service";
import { EmailSenderService, IEmailSenderService } from "../services/email-sender.service";

export class EmailController {
  public router = express.Router();

  private _emailRepoService: IEmailRepoService;
  private _bitcoinService: IBitcoinService;
  private _emailSenderService: IEmailSenderService;
  private _broadcastService: IBroadcastService;

  constructor() {
    this._emailRepoService = new EmailRepoService();
    this._emailSenderService = new EmailSenderService();
    this._bitcoinService = new BitcoinService();
    this._broadcastService = new BroadcastService(
      this._emailRepoService,
      this._emailSenderService,
      this._bitcoinService,
    );
    this._initRoutes();
  }

  private async _initRoutes() {
    this.router.get("/rate", this._rate.bind(this));
    this.router.post("/subscribe", this._subscribe.bind(this));
    this.router.post("/sendEmails", this._sendEmails.bind(this));
  }

  private _subscribe(req: express.Request, res: express.Response) {
    if (!req.body.email) {
      res.status(400).json({ error: 'Request should contain email field' });
      return;
    }
    if (this._emailRepoService.saveEmail(req.body.email)) {
      res.status(200).end();
      return;
    }
    res.status(409).json({ error: "Email already exists" });
  }

  private async _rate(req: express.Request, res: express.Response) {
    try {
      const result = await this._bitcoinService.getBitcoinPrice();
      if (result === undefined) {
        res.status(500).json({ error: "Rate service returned unexpected response" });
        return;
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(error.response.status).json({ error: `Error: ${error.response.statusText}` });
    }
  }

  private async _sendEmails(req: express.Request, res: express.Response) {
    try {
      const result = await this._broadcastService.broadcastBitcoinRate();
      if (result.error) {
        res.status(500).json({ error: `Error: ${result.error}` });
      } else {
        res.status(200).send({ message: "Emails successfully sent", failedEmails: result.failedEmails });
      }
    } catch (error) {
      res.status(error.statusCode).json({ error: `Error: ${error.text}` });
    }
  }
}
