import { EMVCo } from '../standards/emvco';
import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';
import { crc16 } from '../utils/crc';

interface CRCData extends DataPayload {
  value: string;
}

type SimpleData = { id: string; value: string };

export class CRC extends DataObject {
  constructor(data: CRCData) {
    super({
      ...data,
      id: '63',
    });

    this.validateData(data);

    this.value = data.value;
  }

  static defaultId = '63';

  validateData(data: CRCData): void {
    if (!data.value) {
      throw this.createError('value is required');
    }

    if (data.value && !/^\w{4}$/.test(data.value)) {
      throw this.createError('value must be a 4 character hex string');
    }
  }

  static calculateCRC(emvco: EMVCo): string | undefined {
    const data = emvco.toJSON();
    const entries = Object.entries(data)
      .filter(([key, value]) => value && key !== 'crc')
      .sort(
        ([, objA]: [string, SimpleData], [, objB]: [string, SimpleData]) =>
          parseInt(objA.id) - parseInt(objB.id)
      )
      .map(([key, value]: [string, SimpleData | SimpleData[]]) => {
        if (key === 'merchantAccountInformations') {
          return (value as SimpleData[])
            .map((merchantAccountInformation: SimpleData) => {
              return `${
                merchantAccountInformation.id
              }${merchantAccountInformation.value.length
                .toString()
                .padStart(2, '0')}${merchantAccountInformation.value}`;
            })
            .join('');
        }
        const singleValue = value as SimpleData;
        return `${singleValue.id}${singleValue.value.length
          .toString()
          .padStart(2, '0')}${singleValue.value}`;
      });
    entries.push('6304');
    return crc16(entries.join(''));
  }
}
