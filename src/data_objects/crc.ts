import { DataObject } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

interface CRCData extends DataPayload {
  value: string;
}

export class CRC extends DataObject {
  constructor(data: CRCData) {
    super({
      ...data,
    });

    // this.validateData(data);

    this.value = data.value ?? 'SG';
  }

  // validateData(data: CRCData): void {}

  // static validateCRC(sgqr: SGQR): bool {}
}
