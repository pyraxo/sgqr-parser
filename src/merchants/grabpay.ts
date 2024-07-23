import { Merchant, MerchantData } from './generic';

interface GrabPayMerchantData extends MerchantData {
  merchantId: string;
}

export class GrabPayMerchant extends Merchant {
  constructor(data: GrabPayMerchantData) {
    super({
      ...data,
      guid: GrabPayMerchant.guid,
    });

    this.validateData(data);
    this.merchantId = data.merchantId;
  }

  merchantId: string;
  static guid = 'COM.GRAB';

  static dataObjectContext: string[] = [
    ...super.dataObjectContext,
    'merchantId',
  ];

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      merchantId: this.merchantId,
    };
  }
}
