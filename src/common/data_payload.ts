import { ParseError } from '../utils/errors';

export interface DataPayload {
  id: string;
  value: string;
  [key: string]: string | undefined;
}

export type RawParsedData = ParseError | DataPayload;
