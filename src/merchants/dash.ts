import { Merchant, MerchantData } from './generic';

interface SingtelDashMerchantData extends MerchantData {
  merchantAccount: string;
}

export class SingtelDashMerchant extends Merchant {
  constructor(data: SingtelDashMerchantData) {
    super({
      ...data,
      guid: SingtelDashMerchant.guid,
    });

    this.validateData(data);
    this.merchantAccount = data.merchantAccount;
  }

  merchantAccount: string;
  static guid = 'SG.COM.DASH.WWW';

  static dataObjectContext: string[] = [
    ...super.dataObjectContext,
    'merchantAccount',
  ];

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      merchantAccount: this.merchantAccount,
    };
  }
}
