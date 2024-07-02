import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

export class TransactionAmount extends DataObject {
  constructor(data: DataPayload) {
    super({
      ...data,
      id: '54',
    });

    this.validateData(data);
  }

  static defaultId = '54';

  validateData(data: DataPayload): void {
    if (!data.value) {
      return this.createError('value is required');
    }

    if (data.value && !/^.{1,13}$/.test(data.value)) {
      return this.createError('value must be 1-13 characters');
    }
  }
}
