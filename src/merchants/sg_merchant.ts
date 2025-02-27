import { getDateFromYYYYMMDD, isValidYYYYMMDD } from '../utils';
import { Merchant, MerchantData } from './generic';

interface SGMerchantData extends MerchantData {
  sgqrId: string;
  version: string;
  postalCode: string;
  level: string;
  unit: string;
  misc: string;
  revisionDate: string;
}

export class SGMerchantInformation extends Merchant {
  constructor(data: SGMerchantData) {
    super({
      ...data,
      id: '51',
      guid: 'SG.SGQR',
    });

    this.validateData(data);

    this.sgqrId = data.sgqrId;
    this.version = data.version;
    this.postalCode = data.postalCode;
    this.level = data.level;
    this.unit = data.unit;
    this.misc = data.misc;
    this._revisionDate = data.revisionDate;
  }

  static defaultId = '51';

  static dataObjectContext = [
    ...super.dataObjectContext,
    'sgqrId',
    'version',
    'postalCode',
    'level',
    'unit',
    'misc',
    'revisionDate',
  ];

  sgqrId: string;
  version: string;
  postalCode: string;
  level: string;
  unit: string;
  misc: string;
  private _revisionDate: string;

  validateData(data: SGMerchantData): void {
    if (!data.sgqrId) super.createError('sgqrId is required');
    if (!/^\d{6}\w{6}$/.test(data.sgqrId)) {
      super.createError('sgqrId must be in the format YYYYMMDDNNNNNN');
    }

    if (!data.version) super.createError('version is required');
    if (!/^\d{2}\.\d{4}$/.test(data.version))
      super.createError('version must be in the format AA.NNNN');

    if (!data.postalCode) super.createError('postalCode is required');
    if (!/^\d{6,10}$/.test(data.postalCode))
      super.createError('postalCode must be 6-10 digits');

    if (!data.level) super.createError('level is required');
    if (!/^\w{1,3}$/.test(data.level))
      super.createError('level must be 2-3 alphanumeric characters');

    if (!data.unit) super.createError('unit is required');
    if (!/^\w{1,5}$/.test(data.unit))
      super.createError('unit must be 1-5 alphanumeric characters');

    if (!data.misc) super.createError('misc is required');
    if (!/^\w{1,10}$/.test(data.misc))
      super.createError('misc must be 1-10 alphanumeric characters');

    if (!data.revisionDate) super.createError('revisionDate is required');
    if (!isValidYYYYMMDD(data.revisionDate))
      super.createError('revisionDate must be in the format YYYYMMDD');
  }

  get firstCreationDate(): Date {
    return new Date(getDateFromYYYYMMDD(this.sgqrId.substring(0, 8)));
  }

  get revisionDate(): Date {
    return new Date(getDateFromYYYYMMDD(this._revisionDate));
  }
}
