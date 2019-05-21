import { CoinFamily } from './base';

export const enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export interface UtxoNetwork {
  messagePrefix: string;
  bech32: string;
  bip32: {
    public: number;
    private: number;
  };
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
  family: CoinFamily;
  type: NetworkType;
}

export interface AccountNetwork {
  family: CoinFamily;
  type: NetworkType;
}

export class Mainnet {
  type = NetworkType.MAINNET;
}

export class Testnet {
  type = NetworkType.TESTNET;
}

class Ethereum extends Mainnet implements AccountNetwork {
  family = CoinFamily.ETH;
}

class Kovan extends Testnet implements AccountNetwork {
  family = Ethereum.prototype.family;
}

const BTC_FAMILY_MAINNET_BIP32_PUBLIC = 0x0488b21e;
const BTC_FAMILY_MAINNET_BIP32_PRIVATE = 0x0488ade4;
const BTC_FAMILY_WIF = 0x80;

class Bitcoin extends Mainnet implements UtxoNetwork {
  messagePrefix = '\x18Bitcoin Signed Message:\n';
  bech32 = 'bc';
  bip32 = {
    public: BTC_FAMILY_MAINNET_BIP32_PUBLIC,
    private: BTC_FAMILY_MAINNET_BIP32_PRIVATE,
  };
  pubKeyHash = 0x00;
  scriptHash = 0x05;
  wif = BTC_FAMILY_WIF;
  family = CoinFamily.BTC;
}

class BitcoinTestnet extends Testnet implements UtxoNetwork {
  bech32 = 'tb';
  bip32 = {
    public: 0x043587cf,
    private: 0x04358394,
  };
  pubKeyHash = 0x6f;
  scriptHash = 0xc4;
  wif = 0xef;

  // fields "inherited" from the Bitcoin mainnet
  messagePrefix = Bitcoin.prototype.messagePrefix;
  family = Bitcoin.prototype.family;
}

class BitcoinGold extends Mainnet implements UtxoNetwork {
  messagePrefix = '\x18Bitcoin Gold Signed Message:\n';
  bech32 = 'btg';
  bip32 = {
    public: BTC_FAMILY_MAINNET_BIP32_PUBLIC,
    private: BTC_FAMILY_MAINNET_BIP32_PRIVATE,
  };
  pubKeyHash = 0x26;
  scriptHash = 0x17;
  wif = BTC_FAMILY_WIF;
  family = CoinFamily.BTG;
}

class Litecoin extends Mainnet implements UtxoNetwork {
  messagePrefix = '\x19Litecoin Signed Message:\n';
  bech32 = 'ltc';
  // clarify these constants - they are different between BitGoJS and bitgo-utxo-lib
  bip32 = {
    public: BTC_FAMILY_MAINNET_BIP32_PUBLIC,
    private: BTC_FAMILY_MAINNET_BIP32_PRIVATE,
  };
  pubKeyHash = 0x30;
  scriptHash = 0x32;
  wif = 0xb0;
  family = CoinFamily.LTC;
}

class LitecoinTestnet extends Testnet implements UtxoNetwork {
  bech32 = 'tltc';
  // clarify these constants - they are different between BitGoJS and bitgo-utxo-lib
  bip32 = {
    public: BTC_FAMILY_MAINNET_BIP32_PUBLIC,
    private: BTC_FAMILY_MAINNET_BIP32_PRIVATE,
  };
  pubKeyHash = 0x6f;
  scriptHash = 0x3a;
  wif = 0xb0;

  // fields "inherited" from the Litecoin mainnet
  messagePrefix = Litecoin.prototype.messagePrefix;
  family = Litecoin.prototype.family;
}

class Ripple extends Mainnet implements AccountNetwork {
  family = CoinFamily.XRP;
}

class RippleTestnet extends Testnet implements AccountNetwork {
  family = Ripple.prototype.family;
}

class Stellar extends Mainnet implements AccountNetwork {
  family = CoinFamily.XLM;
}

class StellarTestnet extends Testnet implements AccountNetwork {
  family = Stellar.prototype.family;
}

export const Networks = {
  main: {
    bitcoin: Object.freeze(new Bitcoin()),
    bitcoinGold: Object.freeze(new BitcoinGold()),
    litecoin: Object.freeze(new Litecoin()),
    ethereum: Object.freeze(new Ethereum()),
    ripple: Object.freeze(new Ripple()),
    stellar: Object.freeze(new Stellar()),
  },
  test: {
    bitcoin: Object.freeze(new BitcoinTestnet()),
    litecoin: Object.freeze(new LitecoinTestnet()),
    kovan: Object.freeze(new Kovan()),
    ripple: Object.freeze(new RippleTestnet()),
    stellar: Object.freeze(new StellarTestnet()),
  },
};
