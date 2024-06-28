export class ParseError extends Error {}

export class InvalidElementError extends ParseError {
  element: string;
  constructor(element: string) {
    super(`Invalid element+length indicator of ${element} was encountered`);
    this.element = element;
  }
}

export class InvalidLengthError extends ParseError {
  expectedLength: number;
  actualLength: number;
  constructor(expectedLength: number, actualLength: number) {
    super(
      `Invalid length of ${actualLength} was encountered, expected ${expectedLength}`
    );
    this.expectedLength = expectedLength;
    this.actualLength = actualLength;
  }
}
