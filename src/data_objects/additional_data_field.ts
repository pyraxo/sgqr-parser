import { DataObject, parseDataWithContext } from '../common/data_object';
import { DataPayload } from '../common/data_payload';
import { createRangeObject } from '../utils';

export class AdditionalDataField extends DataObject {
  billNumber?: string;
  mobileNumber?: string;
  storeLabel?: string;
  loyaltyNumber?: string;
  referenceLabel?: string;
  customerLabel?: string;
  terminalLabel?: string;
  purposeOfTransaction?: string;
  additionalConsumerDataRequest?: string;

  constructor(data: DataPayload) {
    super(data);

    this.billNumber = data.billNumber;
    this.mobileNumber = data.mobileNumber;
    this.storeLabel = data.storeLabel;
    this.loyaltyNumber = data.loyaltyNumber;
    this.referenceLabel = data.referenceLabel;
    this.customerLabel = data.customerLabel;
    this.terminalLabel = data.terminalLabel;
    this.purposeOfTransaction = data.purposeOfTransaction;
    this.additionalConsumerDataRequest = data.additionalConsumerDataRequest;
  }

  static dataObjectContext = [
    'billNumber',
    'mobileNumber',
    'storeLabel',
    'loyaltyNumber',
    'referenceLabel',
    'customerLabel',
    'terminalLabel',
    'purposeOfTransaction',
    'additionalConsumerDataRequest',
  ];

  static get contextMap(): Record<string, any> {
    const namedObjects = this.dataObjectContext.reduce(
      (acc, curr, idx) => ({
        ...acc,
        [idx.toString().padStart(2, '0')]: (value: string) => ({
          [curr]: value,
        }),
      }),
      {}
    );
    const rfu = createRangeObject(10, 49, (value: string) => ({
      rfu: [value],
    }));
    const specificTemplates = createRangeObject(50, 99, (value: string) => ({
      specificTemplates: [value],
    }));
    return { ...namedObjects, ...rfu, ...specificTemplates };
  }

  static fromString(
    this: typeof AdditionalDataField,
    value: string,
    id: string
  ): DataObject {
    const data = parseDataWithContext(this.contextMap, value);
    const payload = this.dataObjectContext.reduce(
      (acc, _, idx: number) => ({
        ...acc,
        ...(data[idx] as Record<string, any>),
      }),
      { id, value }
    );
    return new this(payload);
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      billNumber: this.billNumber ?? null,
      mobileNumber: this.mobileNumber ?? null,
      storeLabel: this.storeLabel ?? null,
      loyaltyNumber: this.loyaltyNumber ?? null,
      referenceLabel: this.referenceLabel ?? null,
      customerLabel: this.customerLabel ?? null,
      terminalLabel: this.terminalLabel ?? null,
      purposeOfTransaction: this.purposeOfTransaction ?? null,
      additionalConsumerDataRequest: this.additionalConsumerDataRequest ?? null,
    };
  }
}
