import { DataObject } from '../common/data_object';
import { RawParsedData } from '../common/data_payload';
import { SingtelDashMerchant } from '../merchants/dash';
import { Merchant } from '../merchants/generic';
import { GrabPayMerchant } from '../merchants/grabpay';
import { NETSMerchant } from '../merchants/nets';
import { PayNowMerchant } from '../merchants/paynow';
import { SGMerchantInformation } from '../merchants/sg_merchant';
import { createRangeObject } from '../utils/helpers';
import { EMVCo, EMVCoPayload, EMVCoStandard } from './emvco';

type SGQRPayload = EMVCoPayload & {
  sgMerchantInformation: SGMerchantInformation;
};

export const SGQRStandard = {
  ...EMVCoStandard,
  ...createRangeObject(26, 50, Merchant),
  '51': SGMerchantInformation,
};

export const SGMerchants: Record<string, typeof Merchant> = {
  'SG.COM.DASH.WWW': SingtelDashMerchant,
  'SG.PAYNOW': PayNowMerchant,
  'COM.GRAB': GrabPayMerchant,
  'SG.COM.NETS': NETSMerchant,
};

export class SGQR extends EMVCo {
  sgMerchantInformation: SGMerchantInformation;

  constructor(data: SGQRPayload) {
    super(data);
    this.sgMerchantInformation = data.sgMerchantInformation;
  }

  static idToClassMap = SGQRStandard;

  static elementResolver = (
    payload: SGQRPayload,
    element: RawParsedData | DataObject
  ): SGQRPayload => {
    if (element instanceof Merchant) {
      const guid = element.guid.toUpperCase();
      if (guid in SGMerchants) {
        const merchantClass = SGMerchants[guid];
        return {
          ...payload,
          merchantAccountInformations: [
            ...(payload.merchantAccountInformations ?? []),
            merchantClass.fromString(element.value, element.id),
          ],
        };
      }
    }
    if (element instanceof SGMerchantInformation)
      return { ...payload, sgMerchantInformation: element };

    return super.elementResolver(payload, element) as SGQRPayload;
  };

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      sgMerchantInformation: this.sgMerchantInformation.toJSON(),
    };
  }
}
