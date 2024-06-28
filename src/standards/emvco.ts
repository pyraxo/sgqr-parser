import {
  DataObject,
  Interpreter,
  parseDataWithContext,
} from '../common/data_object';
import { RawParsedData } from '../common/data_payload';
import { CategoryCode } from '../data_objects/category_code';
import { CountryCode } from '../data_objects/country_code';
import { PointOfInitiation } from '../data_objects/initiation';
import { MerchantCity } from '../data_objects/merchant_city';
import { MerchantName } from '../data_objects/merchant_name';
import { PayloadFormat } from '../data_objects/payload_format';
import { PostalCode } from '../data_objects/postal_code';
import { TipOrConvenienceIndicator } from '../data_objects/tip_or_convenience';
import { TransactionAmount } from '../data_objects/transaction_amount';
import { TransactionCurrency } from '../data_objects/transaction_currency';
import { ValueOfConvenienceFeeFixed } from '../data_objects/value_of_convenience_fixed';
import { ValueOfConvenienceFeePercentage } from '../data_objects/value_of_convenience_percentage';
import { MerchantAccountInformation } from '../merchants/merchant_account_info';
import { createRangeObject } from '../utils/helpers';

export type EMVCoPayload = {
  // Dynamic mapping could work, but we want it to be compliant with the standard
  payloadFormat: PayloadFormat;
  pointOfInitiation?: PointOfInitiation;
  merchantAccountInformations: MerchantAccountInformation[];
  categoryCode: CategoryCode;
  transactionCurrency: TransactionCurrency;
  transactionAmount?: TransactionAmount;
  tipOrConvenienceIndicator?: TipOrConvenienceIndicator;
  valueOfConvenienceFixed?: ValueOfConvenienceFeeFixed;
  valueOfConveniencePercentage?: ValueOfConvenienceFeePercentage;
  countryCode: CountryCode;
  merchantName: MerchantName;
  merchantCity: MerchantCity;
  postalCode?: PostalCode;
};

export type ElementResolver = (
  payload: EMVCoPayload,
  element: RawParsedData | DataObject
) => EMVCoPayload;

export const EMVCoStandard: Record<string, typeof DataObject> = {
  '00': PayloadFormat,
  '01': PointOfInitiation,
  ...createRangeObject(2, 51, MerchantAccountInformation),
  '52': CategoryCode,
  '53': TransactionCurrency,
  '54': TransactionAmount,
  '55': TipOrConvenienceIndicator,
  '56': ValueOfConvenienceFeeFixed,
  '57': ValueOfConvenienceFeePercentage,
  '58': CountryCode,
  '59': MerchantName,
  '60': MerchantCity,
  '61': PostalCode,
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
  tipOrConvenienceIndicator?: TipOrConvenienceIndicator;
  valueOfConvenienceFixed?: ValueOfConvenienceFeeFixed;
  valueOfConveniencePercentage?: ValueOfConvenienceFeePercentage;
  countryCode: CountryCode;
  merchantName: MerchantName;
  merchantCity: MerchantCity;
  postalCode?: PostalCode;

  constructor(data: EMVCoPayload) {
    this.payloadFormat = data.payloadFormat ?? new PayloadFormat();
    this.pointOfInitiation = data.pointOfInitiation;
    this.merchantAccountInformations = data.merchantAccountInformations;
    this.categoryCode = data.categoryCode;
    this.transactionCurrency = data.transactionCurrency;
    this.transactionAmount = data.transactionAmount;
    this.tipOrConvenienceIndicator = data.tipOrConvenienceIndicator;
    this.valueOfConvenienceFixed = data.valueOfConvenienceFixed;
    this.valueOfConveniencePercentage = data.valueOfConveniencePercentage;
    this.countryCode = data.countryCode;
    this.merchantName = data.merchantName;
    this.merchantCity = data.merchantCity;
    this.postalCode = data.postalCode;
  }

  static idToClassMap = EMVCoStandard;

  static contextWithResolvers(this: typeof EMVCo): Record<string, Interpreter> {
    return Object.fromEntries(
      Object.entries(this.idToClassMap)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([k, v], idx) =>
          v
            ? [k, val => v.fromString(val, idx.toString().padStart(2, '0'))]
            : []
        )
    ) as Record<string, Interpreter>;
  }

  static fromString(this: typeof EMVCo, value: string): EMVCo {
    const data = parseDataWithContext(this.contextWithResolvers(), value);
    const payload = this.resolvePayload(data, this.elementResolver.bind(this));
    return new this(payload as EMVCoPayload);
  }

  static resolvePayload(
    data: (RawParsedData | DataObject)[],
    resolver: ElementResolver
  ): Record<string, any> {
    return data.reduce(
      (acc, element) => resolver(acc, element),
      {} as EMVCoPayload
    );
  }

  static elementResolver(
    payload: EMVCoPayload,
    element: RawParsedData | DataObject
  ): EMVCoPayload {
    if (element instanceof PayloadFormat)
      return { ...payload, payloadFormat: element };
    if (element instanceof PointOfInitiation)
      return { ...payload, pointOfInitiation: element };
    if (element instanceof MerchantAccountInformation)
      return {
        ...payload,
        merchantAccountInformations: (
          payload.merchantAccountInformations ?? []
        ).concat(element),
      };
    if (element instanceof CategoryCode)
      return { ...payload, categoryCode: element };
    if (element instanceof TransactionCurrency)
      return { ...payload, transactionCurrency: element };
    if (element instanceof TransactionAmount)
      return { ...payload, transactionAmount: element };
    if (element instanceof TipOrConvenienceIndicator)
      return { ...payload, tipOrConvenienceIndicator: element };
    if (element instanceof ValueOfConvenienceFeeFixed)
      return { ...payload, valueOfConvenienceFixed: element };
    if (element instanceof ValueOfConvenienceFeePercentage)
      return { ...payload, valueOfConveniencePercentage: element };
    if (element instanceof CountryCode)
      return { ...payload, countryCode: element };
    if (element instanceof MerchantName)
      return { ...payload, merchantName: element };
    if (element instanceof MerchantCity)
      return { ...payload, merchantCity: element };
    if (element instanceof PostalCode)
      return { ...payload, postalCode: element };
    return payload;
  }

  toJSON(): Record<string, any> {
    return {
      payloadFormat: this.payloadFormat.toJSON(),
      pointOfInitiation: this.pointOfInitiation?.toJSON() ?? null,
      merchantAccountInformations: this.merchantAccountInformations.map(info =>
        info.toJSON()
      ),
      categoryCode: this.categoryCode.toJSON(),
      transactionCurrency: this.transactionCurrency.toJSON(),
      transactionAmount: this.transactionAmount?.toJSON() ?? null,
      tipOrConvenienceIndicator:
        this.tipOrConvenienceIndicator?.toJSON() ?? null,
      valueOfConvenienceFixed: this.valueOfConvenienceFixed?.toJSON() ?? null,
      valueOfConveniencePercentage:
        this.valueOfConveniencePercentage?.toJSON() ?? null,
      countryCode: this.countryCode.toJSON(),
      merchantName: this.merchantName.toJSON(),
      merchantCity: this.merchantCity.toJSON(),
      postalCode: this.postalCode?.toJSON() ?? null,
    };
  }
}
