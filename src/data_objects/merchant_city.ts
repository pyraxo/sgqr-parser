import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

export class MerchantCity extends DataObject {
  constructor(data: DataPayload) {
    super({
      ...data,
      id: '60',
    });

    this.validateData(data);

    this.value = data.value ?? 'Singapore';
  }

  static defaultId = '60';

  validateData(data: DataPayload): void {
    if (!data.value) {
      throw this.createError('value is required');
    }

    if (data.value && !/^\w{0,15}$/.test(data.value)) {
      throw this.createError(
        'value must be an alphanumeric string of up to 15 characters'
      );
    }
  }
}
