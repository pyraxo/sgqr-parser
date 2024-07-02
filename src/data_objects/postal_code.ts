import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface PostalCodeData extends DataPayload {
  value: string;
}

export class PostalCode extends DataObject {
  constructor(data: PostalCodeData) {
    super({
      ...data,
      id: '61',
    });

    this.validateData(data);

    this.value = data.value;
  }

  static defaultId = '61';

  validateData(data: PostalCodeData): void {
    if (data.value && !/^\w{6,10}$/.test(data.value)) {
      this.createError('value must be between 6 to 10 characters');
    }
  }
}
