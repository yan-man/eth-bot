# Eth-bot

## Author

Yan Man

## Summary

Bot to check eth prices vs other ERC-20 tokens.

## Requirements

- `node v17.1.0`
- `npm v8.1.3`

## Installation

1. Clone project into empty directory:

   ```
   $ git clone https://github.com/yan-man/eth-bot.git
   ```

2. `cd` into directory
3. Get mainnet Infura RPC URL from: https://infura.io/
4. Copy `example.json` file to create `default.json` file in root `config` directory. Update `RPC_URL` field. `interval` field units are in seconds.

```js
{
  "RPC_URL": "https://mainnet.infura.io/v3/______________",
  "PORT": 3000
  "INTERVAL": 5
}
```

5. Install dependencies:

```
$ npm install
```

6. Run project:

```
$ npm run dev
```

## Further Development

### From `V0.1.0`:

- Add more ERC-20 tokens to compare
- Add more DEXs to find price spread differences and identify arbitrage opportunities
- Update to UniswapV3 implementation
- Include slippage adjustment
- Perform swaps based on price spread differences
- Add unit tests
