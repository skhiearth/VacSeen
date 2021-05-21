require('babel-register');
require('babel-polyfill');
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
      provider: kit.connection.web3.currentProvider, // CeloProvider
      network_id: 44787                   // latest Alfajores network id
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