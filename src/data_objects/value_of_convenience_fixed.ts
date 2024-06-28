import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface ValueOfConvenienceFeeFixedData extends DataPayload {
  value: string;
}

export class ValueOfConvenienceFeeFixed extends DataObject {
  constructor(data: ValueOfConvenienceFeeFixedData) {
    super({
      ...data,
      id: '56',
    });

    this.validateData(data);

    this.value = data.value;
  }

  static defaultId = '56';

  validateData(data: ValueOfConvenienceFeeFixedData): void {
    if (data.value && !/^(?=.{1,13}$)\d+(\.\d{0,2})?$/g.test(data.value)) {
      throw this.createError(
        'value must follow value of convenience fee fixed format'
      );
    }
  }
}
