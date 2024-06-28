import { SGQR } from '../src/standards/sgqr';
describe('index', () => {
  describe('myPackage', () => {
    it('should return a string containing the message', () => {
      const sgqr = SGQR.fromString(
        '00020101021126520008com.grab01365af16fa7-25d5-442b-8c19-b88ddafb14c727330015sg.com.dash.www0110000000464728810011SG.COM.NETS01231198500065G99123123590002111118778720003088778720199084136B4AE51800007SG.SGQR011218090900176B020700.00210306079027040201050213060400000708201809115204581253037025802SG5909TOAST BOX6009Singapore6304B081'
      );

      console.log(sgqr.toJSON());
    });
  });
});
