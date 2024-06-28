import { CountryCode } from '../data_objects/country_code';
import { MerchantName } from '../data_objects/merchant_name';
import { createRangeObject } from '../utils/helpers';
import {
  DataObject,
  Interpreter,
  parseDataWithContext,
} from '../common/data_object';
import { RawParsedData } from '../common/data_payload';
import { CategoryCode } from '../data_objects/category_code';
import { PointOfInitiation } from '../data_objects/initiation';
import { PayloadFormat } from '../data_objects/payload_format';
import { TransactionAmount } from '../data_objects/transaction_amount';
import { TransactionCurrency } from '../data_objects/transaction_currency';
import { MerchantAccountInformation } from '../merchants/merchant_account_info';

export type EMVCoPayload = {
  id: string;
  value: string;
  payloadFormat: PayloadFormat;
  pointOfInitiation?: PointOfInitiation;
  merchantAccountInformations: MerchantAccountInformation[];
  categoryCode: CategoryCode;
  transactionCurrency: TransactionCurrency;
  transactionAmount?: TransactionAmount;
};

export type ElementResolver = (
  payload: EMVCoPayload,
  element: RawParsedData | DataObject
) => EMVCoPayload;

export const EMVCoStandard: Record<string, typeof DataObject> = {
  '00': PayloadFormat,
  '01': PointOfInitiation,
  ...createRangeObject(2, 50, MerchantAccountInformation),
  // '51': null,
  '52': CategoryCode,
  '53': TransactionCurrency,
  '54': TransactionAmount,
  // '55': null,
  // '56': null,
  // '57': null,
  '58': CountryCode,
  '59': MerchantName,
  // '60': null, // Merchant city
  // '61': null, // Postal code
  // '62': null, // Additional data
  // '63': null, // CRC
  // '64': null, // Merchant information language
  // ...Array.from({ length: 15 }, (_, i) => String(i + 65)).map(id => [id, null]),
  // ...Array.from({ length: 20 }, (_, i) => String(i + 80)).map(id => [id, null]),
};

export class EMVCo {
  payloadFormat: PayloadFormat;
  pointOfInitiation?: PointOfInitiation;
  merchantAccountInformations: MerchantAccountInformation[] = [];
  categoryCode: CategoryCode;
  transactionCurrency: TransactionCurrency;
  transactionAmount?: TransactionAmount;

  constructor(data: EMVCoPayload) {
    this.payloadFormat = data.payloadFormat ?? new PayloadFormat();
    this.pointOfInitiation = data.pointOfInitiation;
    this.merchantAccountInformations = data.merchantAccountInformations;
    this.categoryCode = data.categoryCode;
    this.transactionCurrency = data.transactionCurrency;
    this.transactionAmount = data.transactionAmount;
  }

  static idToClassMap = EMVCoStandard;

  static contextWithResolvers(
    idToClassMap: Record<string, typeof DataObject>
  ): Record<string, Interpreter> {
    return Object.fromEntries(
      Object.entries(idToClassMap)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([k, v], idx) =>
          v
            ? [k, val => v.fromString(val, idx.toString().padStart(2, '0'))]
            : []
        )
    ) as Record<string, Interpreter>;
  }

  static fromString(this: typeof EMVCo, value: string): EMVCo {
    const data = parseDataWithContext(
      this.contextWithResolvers(this.idToClassMap),
      value
    );
    const payload = this.resolvePayload(data, this.elementResolver.bind(this));
    return new this(payload);
  }

  static resolvePayload(
    data: (RawParsedData | DataObject)[],
    resolver: ElementResolver
  ): EMVCoPayload {
    return data.reduce(
      (acc, element) => resolver(acc, element),
      {} as EMVCoPayload
    );
  }

  static elementResolver(
    this: typeof EMVCo,
    payload: EMVCoPayload,
    element: RawParsedData | DataObject
  ): EMVCoPayload {
    if (element instanceof PayloadFormat) {
      return { ...payload, payloadFormat: element };
    } else if (element instanceof PointOfInitiation) {
      return { ...payload, pointOfInitiation: element };
    } else if (element instanceof MerchantAccountInformation) {
      return {
        ...payload,
        merchantAccountInformations: (
          payload.merchantAccountInformations ?? []
        ).concat(element),
      };
    } else if (element instanceof CategoryCode) {
      return { ...payload, categoryCode: element };
    } else if (element instanceof TransactionCurrency) {
      return { ...payload, transactionCurrency: element };
    } else if (element instanceof TransactionAmount) {
      return { ...payload, transactionAmount: element };
    }
    return payload;
  }

  toJSON(): Record<string, any> {
    return {
      payloadFormat: this.payloadFormat.toJSON(),
      pointOfInitiation: this.pointOfInitiation?.toJSON(),
      merchantAccountInformations: this.merchantAccountInformations.map(info =>
        info.toJSON()
      ),
      categoryCode: this.categoryCode.toJSON(),
      transactionCurrency: this.transactionCurrency.toJSON(),
      transactionAmount: this.transactionAmount?.toJSON(),
    };
  }
}
