import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface PointOfInitiationData extends DataPayload {
  value: '11' | '12';
}

export class PointOfInitiation extends DataObject {
  constructor(data: PointOfInitiationData) {
    super({
      ...data,
      id: '01',
    });

    this.validateData(data);

    this.value = data.value;
  }

  static defaultId = '01';

  validateData(data: PointOfInitiationData): void {
    if (!['11', '12'].includes(data.value)) {
      throw this.createError('value must be 11 or 12');
    }
  }

  get isStatic(): boolean {
    return this.value === '11';
  }
}
