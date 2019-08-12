import KeychainAction from '../../../src/action/keychain-mobile';

describe('Action KeychainMobile Unit Tests', () => {
  let sandbox;
  let keychain;
  let RNKeychain;

  beforeEach(() => {
    sandbox = sinon.createSandbox({});
    RNKeychain = {
      getInternetCredentials: sinon.stub(),
      setInternetCredentials: sinon.stub(),
    };
    keychain = new KeychainAction(RNKeychain);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('setItem()', () => {
    it('should store value', async () => {
      await keychain.setItem('some-key', 'some-value');
      expect(
        RNKeychain.setInternetCredentials,
        'was called with',
        '0_some-key',
        'lightning',
        'some-value'
      );
    });
  });

  describe('getItem()', () => {
    it('should get stored value', async () => {
      RNKeychain.getInternetCredentials.resolves({ password: 'some-value' });
      const value = await keychain.getItem('some-key');
      expect(value, 'to equal', 'some-value');
      expect(
        RNKeychain.getInternetCredentials,
        'was called with',
        '0_some-key'
      );
    });
  });
});
