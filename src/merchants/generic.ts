import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';
import { MerchantAccountInformation } from './merchant_account_info';

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
    if (!data.guid) throw this.createError('guid is required');
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

  createError(message: string): Error {
    return new Error(`${this.constructor.name}: ${message}`);
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      guid: this.guid,
    };
  }
}
