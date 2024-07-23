import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface TipOrConvenienceIndicatorData extends DataPayload {
  value: '01' | '02' | '03';
}

export enum TipOrConvenienceIndicatorType {
  Prompt = 'Prompt',
  Fixed = 'Fixed',
  Percentage = 'Percentage',
  Unknown = 'Unknown',
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

  get type(): string {
    switch (this.value) {
      case '01':
        return TipOrConvenienceIndicatorType.Prompt;
      case '02':
        return TipOrConvenienceIndicatorType.Fixed;
      case '03':
        return TipOrConvenienceIndicatorType.Percentage;
      default:
        return TipOrConvenienceIndicatorType.Unknown;
    }
  }

  validateData(data: TipOrConvenienceIndicatorData): void {
    if (['01', '02', '03'].includes(data.value)) {
      this.createError('value must either be 01, 02 or 03');
    }
  }
}
