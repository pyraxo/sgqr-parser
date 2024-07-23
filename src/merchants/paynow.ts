import { getDateFromYYYYMMDD } from '../utils';
import { Merchant, MerchantData } from './generic';

interface PayNowMerchantData extends MerchantData {
  proxyType: '0' | '1' | '2';
  proxyValue: string;
  isEditableAmount: '0' | '1';
  reference?: string;
  expiryDate?: string;
}

export class PayNowMerchant extends Merchant {
  constructor(data: PayNowMerchantData) {
    super({
      ...data,
      guid: PayNowMerchant.guid,
    });

    this.validateData(data);

    this._proxyType = data.proxyType;
    this._proxyValue = data.proxyValue;
    this._isEditableAmount = data.isEditableAmount;
    this.reference = data.reference ?? null;
    this._expiryDate = data.expiryDate ?? null;
  }

  private _proxyType: string;
  private _proxyValue: string;
  private _isEditableAmount: string;
  reference: string | null;
  private _expiryDate: string | null;
  static guid = 'SG.PAYNOW';

  validateData(data: PayNowMerchantData): void {
    if (!data.proxyValue) super.createError('proxyValue is required');
    if (!['0', '1', '2'].includes(data.proxyType)) {
      super.createError('proxyType must be 0, 1 or 2');
    }

    if (data.proxyType === '0' && data.proxyValue.length > 15) {
      super.createError('proxyValue must be at most 15 characters for Mobile');
    }

    // Many QRs have data in the 05 field that is not a valid expiry date
    // if (data.expiryDate && !isValidYYYYMMDD(data.expiryDate))
    //   this.createError('expiryDate must follow the format YYYYMMDD');
  }

  static dataObjectContext: string[] = [
    ...super.dataObjectContext,
    'proxyType',
    'proxyValue',
    'isEditableAmount',
    'reference',
    'expiryDate',
  ];

  get proxyType(): string {
    return this._proxyType === '0' ? 'Mobile' : 'UEN';
  }

  get proxyValue(): string {
    return this._proxyValue;
  }

  get isEditableAmount(): boolean {
    return this._isEditableAmount === '1';
  }

  get expiryDate(): Date | string | null {
    if (!this._expiryDate) return null;
    const date = getDateFromYYYYMMDD(this._expiryDate);
    return isNaN(date.getTime()) ? this._expiryDate : date;
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      proxyType: this.proxyType,
      proxyValue: this.proxyValue,
      isEditableAmount: this.isEditableAmount,
      reference: this.reference,
      expiryDate: this.expiryDate,
    };
  }
}
