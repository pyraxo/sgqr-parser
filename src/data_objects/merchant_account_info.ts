import { DataObject, parseDataWithContext } from '../common/data_object';
import { DataPayload } from '../common/data_payload';

export class MerchantAccountInformation extends DataObject {
  constructor(data: DataPayload) {
    super(data);
  }

  static dataObjectContext: string[] = [];

  static get contextMap(): Record<string, any> {
    return {};
  }

  static fromString<T extends typeof DataObject>(
    this: typeof MerchantAccountInformation,
    value: string,
    id: string
  ): InstanceType<T> {
    const data = parseDataWithContext(this.contextMap, value);
    const payload = this.dataObjectContext.reduce(
      (acc, _, idx: number) => ({
        ...acc,
        ...(data[idx] as Record<string, any>),
      }),
      { id, value }
    );
    return new this(payload) as InstanceType<T>;
  }
}
