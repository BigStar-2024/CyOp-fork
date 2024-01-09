import addresses from 'shared/addresses';

const exchangeTokenList = [
  {
    symbol: 'eth',
    decimal: 18,
  },
  {
    symbol: 'cyop',
    address: addresses.CyOp,
    decimal: 9,
  },
  {
    symbol: 'usdt',
    address: addresses.USDT,
    decimal: 6,
  },
  {
    symbol: 'usdc',
    address: addresses.USDC,
    decimal: 6,
  },
  {
    symbol: 'weth',
    address: addresses.WETH,
    decimal: 18,
  },
  /*   {
    symbol: 'cult',
    address: addresses.CULT,
    decimal: 18,
  }, */
];

export { exchangeTokenList };
