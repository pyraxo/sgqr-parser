import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface MerchantNameData extends DataPayload {
  value: string;
}

export class MerchantName extends DataObject {
  constructor(data: MerchantNameData) {
    super({
      ...data,
      id: '59',
    });

    this.validateData(data);
  }

  static defaultId = '59';

  validateData(data: MerchantNameData): void {
    if (data.value && !/^.{0,25}$/.test(data.value)) {
      // TODO: Proper country code check
      throw this.createError(
        'value must be an alphanumeric string of up to 25 characters'
      );
    }
  }
}
