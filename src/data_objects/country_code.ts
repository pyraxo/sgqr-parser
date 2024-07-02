import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface CountryCodeData extends DataPayload {
  value: string;
}

export class CountryCode extends DataObject {
  constructor(data: CountryCodeData) {
    super({
      ...data,
      id: '58',
    });

    this.validateData(data);
  }

  static defaultId = '58';

  validateData(data: CountryCodeData): void {
    if (!data.value) {
      this.createError('value is required');
    }

    if (data.value && !/^[A-Z]{2}$/.test(data.value)) {
      // TODO: Proper country code check
      this.createError('value must be a valid country code');
    }
  }
}
