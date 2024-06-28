import { CurrencyCodeTypes } from '../common/constants';
import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

export class TransactionCurrency extends DataObject {
  constructor(data: DataPayload) {
    super({
      ...data,
      id: '53',
    });

    if (data) this.validateData(data);
  }

  validateData(data: DataPayload): void {
    if (data.value && !/^\d{3}$/.test(data.value)) {
      throw this.createError('value must be 3 digits');
    }

    if (data.value && !CurrencyCodeTypes.includes(data.value)) {
      throw this.createError('value must be a valid ISO 4217 currency code');
    }
  }
}
