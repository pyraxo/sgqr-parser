import { InvalidElementError, InvalidLengthError, ParseError } from '../utils';
import { DataPayload, RawParsedData } from './data_payload';

export type Interpreter = (value: string, id?: string) => DataObject;

export const parseData = (data: string): RawParsedData[] => {
  let index = 0;
  const elements = [];

  while (index < data.length) {
    const elementAndLength = data.substring(index, index + 4);

    index += 4;

    if (elementAndLength.length < 4) {
      elements.push(new InvalidElementError(elementAndLength));
      break;
    }

    const elementId = elementAndLength.substring(0, 2);
    const lengthString = elementAndLength.substring(2, 4);
    if (!/[0-9]{2}/.exec(lengthString)) {
      elements.push(new InvalidElementError(elementAndLength));
      break;
    }

    const elementLength = parseInt(lengthString);
    const value = data.substring(index, index + elementLength);

    index += elementLength;

    if (value.length < elementLength) {
      elements.push(new InvalidLengthError(elementLength, value.length));
      break;
    }

    elements.push({ id: elementId, value });
  }

  return elements;
};

export const parseDataWithContext = (
  context: Record<string, Interpreter>,
  data: string
): (RawParsedData | DataObject)[] => {
  const elements = parseData(data);
  return elements.map(element => {
    if (element instanceof ParseError) return element;
    if (typeof element.id === 'undefined') return element;
    if ('id' in element && element.id in context) {
      return context[element.id](element.value);
    } else {
      return element;
    }
  });
};
export class DataObject {
  constructor(data: DataPayload) {
    if (!data.id) this.createError('id is required');
    this.id = data.id;
    this.value = data.value;
  }

  id: string;
  value: string;
  static defaultId: string;

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      value: this.value,
    };
  }

  static fromString(
    this: typeof DataObject,
    value: string,
    id?: string
  ): DataObject {
    return new this({ id: id ?? this.defaultId, value });
  }

  createError(message: string): void {
    const error = new Error(`${this.constructor.name}: ${message}`);
    console.error(error);
  }
}
