import { Merchant, MerchantData } from './generic';

interface NETSMerchantData extends MerchantData {
  qrMetadata: string;
  merchantId: string;
  terminalId: string;
  transactionAmountModifier: string;
  signature: string;
}

export class NETSMerchant extends Merchant {
  constructor(data: NETSMerchantData) {
    super({
      ...data,
      guid: NETSMerchant.guid,
    });

    this.validateData(data);
    this.merchantId = data.merchantId;
    this.qrMetadata = data.qrMetadata;
    this.terminalId = data.terminalId;
    this.transactionAmountModifier = data.transactionAmountModifier;
    this.signature = data.signature;
  }

  qrMetadata: string;
  merchantId: string;
  terminalId: string;
  transactionAmountModifier: string;
  signature: string;
  static guid = 'SG.COM.NETS';

  static dataObjectContext: string[] = [
    ...super.dataObjectContext,
    'qrMetadata',
    'merchantId',
    'terminalId',
    ...Array(5), // Hacky way to skip to id 9, thanks to NETS not following the standard
    'transactionAmountModifier',
    ...Array(89),
    'signature',
  ];

  get metadata(): Record<string, any> {
    return {
      version: this.qrMetadata[0],
      issuer: this.qrMetadata.substring(1, 11),
      expiryTimestamp: this.qrMetadata.substring(11),
    };
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      merchantId: this.merchantId,
      qrMetadata: this.qrMetadata,
      terminalId: this.terminalId,
      transactionAmountModifier: this.transactionAmountModifier,
      signature: this.signature,
    };
  }
}
