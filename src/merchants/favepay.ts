import { Merchant, MerchantData } from './generic';

interface FavePayMerchantData extends MerchantData {
  favePayUrl: string;
}

export class FavePayMerchant extends Merchant {
  constructor(data: FavePayMerchantData) {
    super({
      ...data,
      guid: FavePayMerchant.guid,
    });

    this.validateData(data);
    this.favePayUrl = data.favePayUrl;
  }

  favePayUrl: string;
  static guid = 'SG.COM.DASH.WWW';

  static dataObjectContext: string[] = [
    ...super.dataObjectContext,
    'favePayUrl',
  ];

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      favePayUrl: this.favePayUrl,
    };
  }
}
