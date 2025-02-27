import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';
import { MerchantAccountInformation } from '../data_objects/merchant_account_info';

export interface MerchantData extends DataPayload {
  guid: string;
}

type Interpreter = (value: string) => Record<string, DataObject>;

type ContextMap = Record<string, Interpreter>;

export class Merchant extends MerchantAccountInformation {
  constructor(data: MerchantData) {
    super(data);

    this.guid = data.guid;
  }

  guid: string;

  validateData(data: DataPayload): void {
    if (!data.guid) return this.createError('guid is required');

    if (data.guid.length < 1 || data.guid.length > 32) {
      this.createError('guid must be between 1 and 32 characters');
    }
  }

  static dataObjectContext: string[] = ['guid'];

  static get contextMap(): ContextMap {
    return this.dataObjectContext.reduce(
      (acc, curr, idx) => ({
        ...acc,
        [idx.toString().padStart(2, '0')]: (value: string) => ({
          [curr]: value,
        }),
      }),
      {}
    );
  }

  // static fromString(value: string): Merchant {
  //   return super.fromString(value) as Merchant;
  // }

  get merchantType(): string {
    return this.constructor.name;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      value: this.value,
      guid: this.guid,
      merchant_type: this.merchantType,
    };
  }
}
