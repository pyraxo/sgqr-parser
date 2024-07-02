import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface CategoryCodeData extends DataPayload {
  value: string;
}

export class CategoryCode extends DataObject {
  constructor(data?: CategoryCodeData) {
    super({
      ...data,
      id: '52',
      value: data?.value ?? '0000',
    });

    if (data) this.validateData(data);
  }

  static defaultId = '52';

  validateData(data: CategoryCodeData): void {
    if (data.value && !/^\d{4}$/.test(data.value)) {
      this.createError('value must be 4 digits');
    }
  }
}
