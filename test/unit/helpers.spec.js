import * as helpers from '../../src/helpers';

describe('Helpers Unit Tests', () => {
  describe('formatSatoshis()', () => {
    it('should work for undefined', () => {
      const num = helpers.formatSatoshis();
      expect(num, 'to equal', '');
    });

    it('should work for string input', () => {
      const num = helpers.formatSatoshis('1000000');
      expect(num, 'to equal', '1.000.000');
    });

    it('should work for number input', () => {
      const num = helpers.formatSatoshis(1000000);
      expect(num, 'to equal', '1.000.000');
    });
  });

  describe('toHash()', () => {
    it('should throw error for undefined', () => {
      expect(helpers.toHash.bind(), 'to throw', /must be one of type/);
    });

    it('should work for string input', () => {
      const hash = helpers.toHash('foobar');
      expect(hash, 'to equal', '7e8a1b6a');
    });
  });
});
