import axios from "axios";

const COINBASE_URL = "https://api.coinbase.com/v2/prices/BTC-UAH/buy";

export class BitcoinService implements IBitcoinService {
  public async getBitcoinPrice(): Promise<number> {
    const result = await axios.get(COINBASE_URL);
    return result?.data?.data?.amount;
  }
}

export interface IBitcoinService {
  getBitcoinPrice(): Promise<number>;
}
