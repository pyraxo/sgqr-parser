import { Args, Command, Flags } from '@oclif/core';
import {
  Merchant,
  PayNowMerchant,
  SGQR,
  TipOrConvenienceIndicatorType,
} from '../../src';

export default class Parse extends Command {
  static override args = {
    qr_string: Args.string({ description: 'QR string to parse' }),
  };

  static override description =
    'parses a QR string and returns the parsed data as a JSON';

  static override examples = ['<%= config.bin %> <%= command.id %> QR_STRING'];

  static override flags = {
    analyse: Flags.boolean({ char: 'a', description: 'Analyse the QR string' }),
  };

  private analyseMerchant(merchant: Merchant): void {
    switch (merchant.guid) {
      case PayNowMerchant.guid: {
        const payNowMerchant = merchant as PayNowMerchant;
        const result: string[] = [];
        result.push(
          `${payNowMerchant.proxyType}: ${payNowMerchant.proxyValue}`
        );
        result.push(
          `Amount is ${payNowMerchant.isEditableAmount ? 'editable' : 'fixed'}`
        );
        if (payNowMerchant.reference)
          result.push(`Reference: ${payNowMerchant.reference}`);
        if (payNowMerchant.expiryDate)
          result.push(`Expiry date: ${payNowMerchant.expiryDate}`);
        this.log(result.map(r => `  ${r}`).join('\n'));
        return;
      }
      default: {
        this.log(`  - Unsupported merchant type ${merchant.guid}`);
      }
    }
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Parse);
    if (!args.qr_string) {
      this.error('No QR string provided');
    }

    // We are assuming that the QR string is an SGQR for now
    const sgqr = SGQR.fromString(args.qr_string);

    if (flags.analyse) {
      this.log(`Analysing QR string:\n`);
      this.log(
        `Payload type: ${sgqr.payloadFormat.value} ${
          sgqr.payloadFormat.value === '01' ? '(EMVCo)' : '(Unknown)'
        }`
      );
      if (sgqr.pointOfInitiation)
        this.log(
          `QR is ${
            sgqr.pointOfInitiation.isStatic
              ? 'static - used for more than one transaction'
              : 'dynamic - a new one will be shown for each transaction'
          }`
        );
      this.log(`Category code: ${sgqr.categoryCode.value}`);
      this.log(`Currency: ${sgqr.transactionCurrency.value}`);
      this.log(`Amount: ${sgqr.transactionAmount?.value ?? 'Not specified'}`);
      this.log(
        `Tip or convenience indicator: ${
          sgqr.tipOrConvenienceIndicator?.value ?? 'Not specified'
        }`
      );
      if (sgqr.tipOrConvenienceIndicator) {
        this.log(
          `Convenience fee (${sgqr.tipOrConvenienceIndicator.type}): ${
            (sgqr.tipOrConvenienceIndicator?.type ===
            TipOrConvenienceIndicatorType.Fixed
              ? sgqr.valueOfConvenienceFeeFixed
              : sgqr.valueOfConvenienceFeePercentage
            )?.value ?? 'Not specified'
          }`
        );
      }
      this.log(`Country: ${sgqr.countryCode.value}`);
      this.log(`Merchant name: ${sgqr.merchantName.value}`);
      this.log(`Merchant city: ${sgqr.merchantCity.value}`);
      if (sgqr.postalCode) this.log(`Postal code: ${sgqr.postalCode.value}`);
      if (sgqr.additionalDataField) {
        if (sgqr.additionalDataField.billNumber) {
          this.log(`Bill number: ${sgqr.additionalDataField.billNumber}`);
        }
        if (sgqr.additionalDataField.mobileNumber) {
          this.log(`Mobile number: ${sgqr.additionalDataField.mobileNumber}`);
        }
        if (sgqr.additionalDataField.storeLabel) {
          this.log(`Store label: ${sgqr.additionalDataField.storeLabel}`);
        }
        if (sgqr.additionalDataField.loyaltyNumber) {
          this.log(`Loyalty number: ${sgqr.additionalDataField.loyaltyNumber}`);
        }
        if (sgqr.additionalDataField.referenceLabel) {
          this.log(
            `Reference label: ${sgqr.additionalDataField.referenceLabel}`
          );
        }
        if (sgqr.additionalDataField.customerLabel) {
          this.log(`Customer label: ${sgqr.additionalDataField.customerLabel}`);
        }
        if (sgqr.additionalDataField.terminalLabel) {
          this.log(`Terminal label: ${sgqr.additionalDataField.terminalLabel}`);
        }
        if (sgqr.additionalDataField.purposeOfTransaction) {
          this.log(
            `Purpose of transaction: ${sgqr.additionalDataField.purposeOfTransaction}`
          );
        }
        if (sgqr.additionalDataField.additionalConsumerDataRequest) {
          this.log(
            `Additional consumer data request: ${sgqr.additionalDataField.additionalConsumerDataRequest}`
          );
        }
      }
      this.log(
        `${sgqr.merchantAccountInformations.length} merchant info found:`
      );
      for (const merchantAccountInfo of sgqr.merchantAccountInformations) {
        if ('guid' in merchantAccountInfo) {
          const merchant: Merchant = merchantAccountInfo as Merchant;
          this.log(`- ${merchant.merchantType} (id ${merchant.id}):`);
          this.analyseMerchant(merchant);
        } else {
          this.log(`- ${merchantAccountInfo}`);
        }
      }
    } else {
      this.log(`Parsing QR string:\n`);
      this.log(JSON.stringify(sgqr.toJSON(), null, 2));
    }
  }
}
