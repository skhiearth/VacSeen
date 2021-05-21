require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "urban speed oppose uphold parade unlock swallow tuition traffic guitar mixed blush";
const Kit = require('@celo/contractkit')
const kit = Kit.newKit('https://alfajores-forno.celo-testnet.org')

const getAccount = require('./getAccount').getAccount

async function awaitWrapper(){
    let account = await getAccount()
    kit.connection.addAccount(account.privateKey)
}
awaitWrapper()

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    alfajores: {
      provider: kit.connection.web3.currentProvider, 
      network_id: 44787                 
    },
    ropsten: {
      networkCheckTimeout: 10000,
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/65ca0260861441abaffa68268598d220`),
      network_id: 3,
      skipDryRun: true
    },
  },
  
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}