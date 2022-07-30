import fs from "fs";

export class EmailRepoService implements IEmailRepoService {
  private _databaseFileName = "emails.txt";

  public saveEmail(email: string): boolean {
    const existing = this.getAll();
    if (existing.find((item: string) => item === email)) {
      return false;
    }
    fs.appendFileSync(this._databaseFileName, `${email}\n`);
    return true;
  }

  public getAll(): string[] {
    if (!fs.existsSync(this._databaseFileName)) {
      return [];
    }
    const emails = fs.readFileSync(this._databaseFileName).toString().split("\n").map(
      (email: string) => email.trim()).filter((str) => str);
    return emails;
  }
}

export interface IEmailRepoService {
  saveEmail(email: string): boolean;
  getAll(): string[];
}
