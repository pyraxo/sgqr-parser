import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface TipOrConvenienceIndicatorData extends DataPayload {
  value: '01' | '02' | '03';
}

export class TipOrConvenienceIndicator extends DataObject {
  constructor(data: TipOrConvenienceIndicatorData) {
    super({
      ...data,
      id: '55',
    });

    this.validateData(data);

    this.value = data.value;
  }

  static defaultId = '55';

  validateData(data: TipOrConvenienceIndicatorData): void {
    if (['01', '02', '03'].includes(data.value)) {
      throw this.createError('value must either be 01, 02 or 03');
    }
  }
}
