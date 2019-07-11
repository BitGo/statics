import { ConflictingCoinFeaturesError, DisallowedCoinFeatureError, MissingRequiredCoinFeatureError } from './errors';
import { BaseNetwork } from './networks';

export const enum CoinKind {
  CRYPTO = 'crypto',
  FIAT = 'fiat',
}

/**
 * The coin family links related variants of a single coin together.
 *
 * Typically, each coin will have a testnet and mainnet variant,
 * and these will both have the same coin family.
 *
 * For example, the coins `btc` and `tbtc` both belong to the same family, `btc`.
 */
export const enum CoinFamily {
  ALGO = 'algo',
  BCH = 'bch',
  BSV = 'bsv',
  BTC = 'btc',
  BTG = 'btg',
  DASH = 'dash',
  ETH = 'eth',
  EOS = 'eos',
  LTC = 'ltc',
  OFC = 'ofc',
  RMG = 'rmg',
  SUSD = 'susd',
  XLM = 'xlm',
  XRP = 'xrp',
  ZEC = 'zec',
}

/**
 * Coin features are yes or no questions about what a coin requires or is capable of.
 *
 * This allows coin-agnostic handling of coin-specific features. This is designed
 * to replace checking the coin name against a whitelist of supported coins
 * before executing some coin-specific logic, and instead allows one to check if a
 * coin supports the coin-specific feature that the logic implements.
 */
export const enum CoinFeature {
  /*
   * The valueless transfer feature indicates that it is valid to send a transaction which moves zero units of the coin.
   *
   * An example is Ethereum, which uses zero value transactions to trigger contract calls.
   */
  VALUELESS_TRANSFER = 'valueless-transfer',
  /*
   * Transaction data means there can be arbitrary data encoded in a transaction.
   *
   * Ethereum contract call data is an example.
   */
  TRANSACTION_DATA = 'transaction-data',
  /*
   * Some coins have a higher precision range than IEEE 754 doubles, which are used to represent numbers in javascript.
   *
   * For these coins, we must use an arbitrary precision arithmetic library, and this feature indicates this requirement.
   */
  REQUIRES_BIG_NUMBER = 'requires-big-number',
  /*
   * RMG requires all wallets to have a backup key held by a BitGo approved Key Recovery Service (KRS)
   */
  REQUIRES_KRS_BACKUP_KEY = 'requires-krs-backup-key',
  /*
   * For customers which are not on a postpaid contract, we add an extra output to transactions which pays BitGo a fee.
   *
   * This fee is known as the "pay-as-you-go fee", or just "paygo" for short.
   *
   * Some coins are unable to create transactions with more than one output, so paygo outputs are not possible for these coins.
   */
  PAYGO = 'paygo',
  /*
   * Does this coin align with the unspent model?
   *
   * These are typically Bitcoin and forks of it, such as Litecoin and Bitcoin Cash.
   */
  UNSPENT_MODEL = 'unspent-model',
  /*
   * Does this coin align with the account model?
   *
   * Examples of this coin type are Ethereum, XRP, and Stellar
   */
  ACCOUNT_MODEL = 'account-model',
  /*
   * Does this coin support child-pays-for-parent transactions?
   *
   * These are special types of transactions which can accelerate the confirmation time
   * of another transaction which is stuck in the mempool due to low fees.
   *
   * This is only possible for coins which follow the unspent model (UTXO coins).
   */
  CHILD_PAYS_FOR_PARENT = 'cpfp',
  /*
   * Does this coin support pay-to-script-hash wrapped segregated witness transactions.
   *
   * These are upgraded transaction types which can only apply to UTXO coins such as Bitcoin.
   */
  WRAPPED_SEGWIT = 'wrapped-segwit',
  /*
   * Does this coin support segregated witness transactions natively? (eg, not wrapped in a P2SH indirection layer)
   *
   * These are upgraded transaction types which can only apply to UTXO coins such as Bitcoin.
   */
  NATIVE_SEGWIT = 'native-segwit',
  /*
   * Does this coin support tokens? These are distinct assets from the underlying coin, but run on the same network.
   *
   * For example, Ethereum's ERC 20 token standard means that it supports tokens, so it shall have this feature.
   */
  SUPPORTS_TOKENS = 'supports-tokens',
}

/**
 * Some coins are representations of another underlying asset class. An example
 * is Wrapped Bitcoin, which represents Bitcoin on the Ethereum blockchain.
 *
 * For these coins, the `UnderlyingAsset` provides a link to the actual
 * asset for which the coin is a unit of account.
 *
 * For all other coins, the `UnderlyingAsset` should be set to `SELF`, which
 * indicates that the coin is a unit of account only for itself, and does not
 * represent some amount of another asset class.
 */
export const enum UnderlyingAsset {
  ALGO = 'algo',
  BCH = 'bch',
  BSV = 'bsv',
  BTC = 'btc',
  BTG = 'btg',
  DASH = 'dash',
  USD = 'usd',
  ETH = 'eth',
  EOS = 'eos',
  LTC = 'ltc',
  XRP = 'xrp',
  XLM = 'xlm',
  ZEC = 'zec',

  // ERC 20 tokens
  ABT = 'abt',
  AE = 'ae',
  AERGO = 'aergo',
  AGI = 'agi',
  AION = 'aion',
  AMN = 'amn',
  AMON = 'amon',
  ANA = 'ana',
  ANT = 'ant',
  AOA = 'aoa',
  APPC = 'appc',
  AST = 'ast',
  AUDX = 'audx',
  AUTO = 'auto',
  AXPR = 'axpr',
  BAT = 'bat',
  BAX = 'bax',
  BBX = 'bbx',
  BCAP = 'bcap',
  BCIO = 'bcio',
  BID = 'bid',
  BIRD = 'bird',
  BLZ = 'blz',
  BNB = 'bnb',
  BNK = 'bnk',
  BNT = 'bnt',
  BNTY = 'bnty',
  BOX = 'box',
  BRD = 'brd',
  BST = 'bst',
  BTM = 'btm',
  BTT = 'btt',
  BTU = 'btu',
  BUY = 'buy',
  CADX = 'cadx',
  CAG = 'cag',
  CBAT = 'cbat',
  CBC = 'cbc',
  CDAG = 'cdag',
  CDAI = 'cdai',
  CDT = 'cdt',
  CETH = 'ceth',
  CEL = 'cel',
  CENNZ = 'cennz',
  CGLD = 'cgld',
  CHFX = 'chfx',
  CHSB = 'chsb',
  CLN = 'cln',
  CMT = 'cmt',
  CND = 'cnd',
  CNYX = 'cnyx',
  CPAY = 'cpay',
  CPLT = 'cplt',
  CQX = 'cqx',
  CREP = 'crep',
  CRO = 'cro',
  CRPT = 'crpt',
  CS = 'cs',
  CSLV = 'cslv',
  CUSDC = 'cusdc',
  CVC = 'cvc',
  CZRX = 'czrx',
  DAI = 'dai',
  DATA = 'data',
  DCN = 'dcn',
  DENT = 'dent',
  DEW = 'dew',
  DGD = 'dgd',
  DGX = 'dgx',
  DRGN = 'drgn',
  DROP = 'drop',
  DRPU = 'drpu',
  DRV = 'drv',
  DTR = 'dtr',
  ECHT = 'echt',
  EDR = 'edr',
  EGL = 'egl',
  ELF = 'elf',
  ENG = 'eng',
  ENJ = 'enj',
  ERC = 'erc',
  ETHOS = 'ethos',
  ETO = 'eto',
  EURS = 'eurs',
  EURX = 'eurx',
  EUX = 'eux',
  FET = 'fet',
  FMF = 'fmf',
  FSN = 'fsn',
  FUN = 'fun',
  FXRT = 'fxrt',
  GBPX = 'gbpx',
  GEN = 'gen',
  GLDX = 'gldx',
  GNO = 'gno',
  GNT = 'gnt',
  GNX = 'gnx',
  GOT = 'got',
  GTO = 'gto',
  GUSD = 'gusd',
  GVT = 'gvt',
  HEDG = 'hedg',
  HLC = 'hlc',
  HOLD = 'hold',
  HOT = 'hot',
  HPB = 'hpb',
  HQT = 'hqt',
  HST = 'hst',
  HT = 'ht',
  HXRO = 'hxro',
  HYB = 'hyb',
  HYDRO = 'hydro',
  ICN = 'icn',
  ICX = 'icx',
  INCX = 'incx',
  IND = 'ind',
  IOST = 'iost',
  ISR = 'isr',
  JBC = 'jbc',
  JPYX = 'jpyx',
  KCS = 'kcs',
  KEY = 'key',
  KIN = 'kin',
  KNC = 'knc',
  KZE = 'kze',
  LBA = 'lba',
  LEO = 'leo',
  LGO = 'lgo',
  LINK = 'link',
  LION = 'lion',
  LNC = 'lnc',
  LOOM = 'loom',
  LRC = 'lrc',
  MAN = 'man',
  MANA = 'mana',
  MCO = 'mco',
  MCX = 'mcx',
  MDX = 'mdx',
  MEDX = 'medx',
  MET = 'met',
  META = 'meta',
  MFG = 'mfg',
  MFT = 'mft',
  MITH = 'mith',
  MKR = 'mkr',
  MTCN = 'mtcn',
  MTL = 'mtl',
  MVL = 'mvl',
  NAS = 'nas',
  NCASH = 'ncash',
  NEU = 'neu',
  NEXO = 'nexo',
  NMR = 'nmr',
  NPXS = 'npxs',
  NULS = 'nuls',
  NZDX = 'nzdx',
  OMG = 'omg',
  ONL = 'onl',
  OPT = 'opt',
  ORBS = 'orbs',
  OST = 'ost',
  PAX = 'pax',
  PAY = 'pay',
  PAYX = 'payx',
  PDATA = 'pdata',
  PLC = 'plc',
  PLR = 'plr',
  PLX = 'plx',
  PMA = 'pma',
  POE = 'poe',
  POLY = 'poly',
  POWR = 'powr',
  PPP = 'ppp',
  PPT = 'ppt',
  PRDX = 'prdx',
  PRL = 'prl',
  PRO = 'pro',
  QASH = 'qash',
  QRL = 'qrl',
  QSP = 'qsp',
  QUASH = 'quash',
  QVT = 'qvt',
  R = 'r',
  RBY = 'rby',
  RDN = 'rdn',
  REB = 'reb',
  REBL = 'rebl',
  REP = 'rep',
  REQ = 'req',
  RFR = 'rfr',
  RHOC = 'rhoc',
  RLC = 'rlc',
  ROOBEE = 'roobee',
  RUBX = 'rubx',
  RUFF = 'ruff',
  SALT = 'salt',
  SAN = 'san',
  SHK = 'shk',
  SHR = 'shr',
  SLOT = 'slot',
  SLVX = 'slvx',
  SMT = 'smt',
  SNOV = 'snov',
  SNT = 'snt',
  SPO = 'spo',
  SRN = 'srn',
  SRNT = 'srnt',
  STORJ = 'storj',
  STORM = 'storm',
  SUB = 'sub',
  TAUD = 'taud',
  TEN = 'ten',
  TENX = 'tenx',
  THETA = 'theta',
  TIOX = 'tiox',
  TKX = 'tkx',
  TMS = 'tms',
  TNT = 'tnt',
  TRST = 'trst',
  TRX = 'trx',
  TUSD = 'tusd',
  UKG = 'ukg',
  UPBTC = 'upbtc',
  UPP = 'upp',
  UPT = 'upt',
  UPUSD = 'upusd',
  UQC = 'uqc',
  USDC = 'usdc',
  USDT = 'usdt',
  USDX = 'usdx',
  USX = 'usx',
  VALOR = 'valor',
  VDX = 'vdx',
  VEE = 'vee',
  VEN = 'ven',
  VERI = 'veri',
  WAX = 'wax',
  WBTC = 'wbtc',
  WHT = 'wht',
  WPX = 'wpx',
  WTC = 'wtc',
  XCD = 'xcd',
  XIN = 'xin',
  XRL = 'xrl',
  YSEY = 'ysey',
  ZCO = 'zco',
  ZIL = 'zil',
  ZIX = 'zix',
  ZOOM = 'zoom',
  ZRX = 'zrx',

  // Kovan-only ERC20 tokens
  TEST = 'test',
  SCHZ = 'schz',
  TCAT = 'tcat',
}

export interface BaseCoinConstructorOptions {
  fullName: string; // full, human readable name of this coin. Eg, "Bitcoin Cash" for bch
  name: string; // unique identifier for this coin, usually the lowercase ticker or symbol. Eg, "btc" for bitcoin
  prefix?: string;
  suffix?: string;
  kind: CoinKind;
  isToken: boolean;
  features: CoinFeature[];
  decimalPlaces: number;
  asset: UnderlyingAsset;
  network: BaseNetwork;
}

export abstract class BaseCoin {
  /*
    Display properties
   */
  public readonly fullName: string;
  public readonly name: string;
  public readonly prefix?: string;
  public readonly suffix?: string;
  /*
    Classification properties
   */
  public readonly kind: CoinKind;
  public readonly family: CoinFamily;
  public readonly isToken: boolean;
  /*
    Coin Features. These are yes or no questions about what the coin supports and does not support.
   */
  public readonly features: CoinFeature[];
  /*
    Coin Network. This is a list of properties which are relevant to the underlying network on which this coin exists.
   */
  public readonly network: BaseNetwork;
  /*
    Conversion properties
   */
  public readonly decimalPlaces: number;
  public readonly asset: UnderlyingAsset;

  /**
   * Set of features which are required by a coin subclass
   * @return {Set<CoinFeature>}
   */
  protected abstract requiredFeatures(): Set<CoinFeature>;

  /**
   * Set of features which are not valid and are disallowed by a coin subclass
   * @return {Set<CoinFeature>}
   */
  protected abstract disallowedFeatures(): Set<CoinFeature>;

  /**
   * Ensures that the base coin constructor was passed a valid set of options.
   *
   * This includes checking that:
   * - All coin features of the new instance are allowed by the coin class
   * - No features required by the coin class are missing from the new instance
   * @param {BaseCoinConstructorOptions} options
   * @throws {DisallowedCoinFeatureError} if any of the coin features are not allowed for the coin class
   * @throws {MissingRequiredCoinFeatureError} if any features required by the coin class are missing
   */
  private validateOptions(options: BaseCoinConstructorOptions) {
    const requiredFeatures = this.requiredFeatures();
    const disallowedFeatures = this.disallowedFeatures();

    const intersectionFeatures = Array.from(requiredFeatures).filter(feat => disallowedFeatures.has(feat));

    if (intersectionFeatures.length > 0) {
      throw new ConflictingCoinFeaturesError(options.name, intersectionFeatures);
    }

    for (const feature of options.features) {
      if (disallowedFeatures.has(feature)) {
        throw new DisallowedCoinFeatureError(options.name, feature);
      }

      if (requiredFeatures.has(feature)) {
        requiredFeatures.delete(feature);
      }
    }

    if (requiredFeatures.size > 0) {
      // some required features were missing
      throw new MissingRequiredCoinFeatureError(options.name, Array.from(requiredFeatures));
    }
  }

  protected constructor(options: BaseCoinConstructorOptions) {
    this.validateOptions(options);

    this.fullName = options.fullName;
    this.name = options.name;
    this.prefix = options.prefix;
    this.suffix = options.suffix;
    this.kind = options.kind;
    this.family = options.network.family;
    this.isToken = options.isToken;
    this.features = options.features;
    this.decimalPlaces = options.decimalPlaces;
    this.asset = options.asset;
    this.network = options.network;
  }
}
