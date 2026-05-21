 # STOTINA.COM Website

 Whatever is in the ```/docs``` folder is the currently published static website.

 ## Tools

 The site provides a collection of client‑side tools for Bitcoin SV developers and enthusiasts. All tools run entirely in the browser; no backend server is required.

 ### Decode Raw Transaction
 **Path:** `/tools/decoderaw`  
 **Component:** `src/components/tools/DecodeRawTxPage.vue`  
 Parses a raw transaction hex string (or a transaction ID) and displays the decoded transaction using the BSVJS library. Shows BSVJS JSON, TXO JSON, and a byte‑by‑byte view with colour‑coded groups.

 ### Parse Bitcoin URI
 **Path:** `/tools/parseuri`  
 **Component:** `src/components/tools/ParseBitcoinUriPage.vue`  
 Parses a Bitcoin URI, extracts protocol, memo, amount, inputs/outputs and presents the data in a readable format.

 ### Data Converter
 **Path:** `/tools/convertdata`  
 **Component:** `src/components/tools/ConvertDataPage.vue`  
 Converts data between many formats (ascii, utf8, base64, hex, decimal, script, etc.) using BSVJS and the Buffer API.

 ### Currency Converter
 **Path:** `/tools/currencyconverter`  
 **Component:** `src/components/tools/CurrencyConverterPage.vue`  
 A currency conversion tool. Allows conversion between FIAT currencies (and a few cryptocurrencies too).

 ### Evaluate Bitcoin Script
 **Path:** `/tools/scripteval`  
 **Component:** `src/components/tools/EvalBitcoinScriptPage.vue`  
 Allows you to paste a script in ASM, BITD or HEX, parses it, evaluates it line‑by‑line with `bitcoin-script-eval` and can convert between the three formats.

 ### Generate Testing Keys
 **Path:** `/tools/generatekey`  
 **Component:** `src/components/tools/GenerateTestKeysPage.vue`  
 Generates a random BSV private key (testnet or mainnet) and derives the public key, address, and script. Useful for quick testing.

 ### BSV Testnet Wallet *(unfinished)*
 **Path:** `/tools/testnetwallet`  
 **Component:** `src/components/tools/BsvTestnetWalletPage.vue`  
 Placeholder for a simple BSV testnet wallet UI.

 ### MAPI User Interface
 **Path:** `/tools/mapigui`  
 **Component:** `src/components/tools/MapiGuiPage.vue`  
 Interacts with a MAPI endpoint to fetch fee quotes, query transaction status and submit raw transactions. Uses `axios` for HTTP requests.

 ### RPC Dashboard *(CORS limited)*
 **Path:** `/tools/rpcdashboard`  
 **Component:** `src/components/tools/RpcDashboardPage.vue`  
 Connects to a BSV RPC node (if CORS permits) and displays blockchain, mempool, mining and UTXO information.

 ### Block Inspector *(unfinished)*
 **Path:** `/tools/blockstats`  
 **Component:** `src/components/tools/BlokInspector.vue`  
 Placeholder for a block‑inspection tool.

 ### RUN NFT Duplicator
 **Path:** `/tools/duplicatetoken/run`  
 **Component:** `src/components/tools/DuplicateRunTokens.vue`  
 Duplicates a RUN RelayX NFT by reading its metadata (via `run-sdk`) and minting new tokens to a specified address.

 ### Transaction Graph *(unfinished)*
 **Path:** `/tools/txgraph`  
 **Component:** `src/components/tools/TransactionGraph.vue`  
 Placeholder for a visual transaction graph.

 ### BSV Transaction Demo
 **Path:** `/tools/txdemo`  
 **Component:** `src/components/tools/TxDemoPage.vue`  
 Provides an interactive console that demonstrates building and signing BSV transactions using the Run SDK.

 ### Console BSVJS 1.5
 **Path:** `/tools/debugbsv15`  
 **Component:** `src/components/tools/ConsoleBsvJs15Page.vue`  
 Opens a JavaScript console with BSVJS 1.5 loaded as the global `bsv` variable.

 ### Console BSVJS 2.0
 **Path:** `/tools/debugbsv2`  
 **Component:** `src/components/tools/ConsoleBsvJs20Page.vue`  
 Opens a JavaScript console with BSVJS 2.0.10 loaded as the global `bsvjs` variable.

 All tools are listed in `src/assets/tools.json` and are routed via Vue Router. They are designed to work offline and can be built with `npm run build:release` for deployment on GitHub Pages.
