import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

export class MerchantCity extends DataObject {
  constructor(data: DataPayload) {
    super({
      ...data,
      id: '60',
    });

    this.validateData(data);

    this.value = data.value;
  }

  static defaultId = '60';

  validateData(data: DataPayload): void {
    if (!data.value) {
      this.createError('value is required');
    }

    if (data.value && !/^\w{0,15}$/.test(data.value)) {
      this.createError(
        'value must be an alphanumeric string of up to 15 characters'
      );
    }
  }
}
