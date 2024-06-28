import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface ValueOfConvenienceFeePercentageData extends DataPayload {
  value: string;
}

export class ValueOfConvenienceFeePercentage extends DataObject {
  constructor(data: ValueOfConvenienceFeePercentageData) {
    super({
      ...data,
      id: '57',
    });

    this.validateData(data);

    this.value = data.value;
  }

  static defaultId = '57';

  validateData(data: ValueOfConvenienceFeePercentageData): void {
    if (data.value && !/^\d{1,2}\.?\d{0,2}$/g.test(data.value)) {
      throw this.createError('value must be values between 00.01 and 99.99');
    }
  }
}
