import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

export class PayloadFormat extends DataObject {
  constructor(data?: DataPayload) {
    super({
      ...data,
      id: '00',
      value: '01',
    });
  }

  static defaultId = '00';
}
