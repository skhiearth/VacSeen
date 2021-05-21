# VacSeen
by The Misfits

Made with ❤️ at TechnoHack

## Requirements

#### Hardware

* macOS, Windows or Linux
* Atleast 4GB of RAM recommended 

#### Software (for development)

* Google Chrome, Brave or any Ethereum-enable browser
* Metamask Extension
* nodeJS
* Ganache Stand-alone application or Ganache CLI
* Truffle Suite
* A code editor (VS Code preffered)

#### Software (for testing)

* Google Chrome, Brave or any Ethereum-enabled browser
* Celo Wallet Extension

## Instructions to run the project locally 
1. Go into the root folder of the project, named `VacSeen` and run `npm install`.
2. Inside the root folder, run `truffle compile` to compile the Solidity smart contract to their JSON ABIs.
3. Run `truffle migrate --reset --network alfajores` to migrate the smart contracts to the Celo Alfajores test network or `truffle migrate --reset --network ropsten` for Ethereum
4. After migration, run `npm start` to start the Web Application.

Note: If you deploy using a personal account, CELO tokens are required in your account. You can request tokens using the publically available [faucet for the Alfajores test network](https://celo.org/developers/faucet).

## Tech Stack:
* Smart Contracts: [Solidity](https://solidity.readthedocs.io/en/v0.7.3/)
* Blockchain Network: [Celo](https://celo.org/), [Ethereum](https://ethereum.org/en/)
* Front-end: [React](https://reactjs.org/)
* Wallet: [Portis](https://www.portis.io/)
* Package Manager: [npm](https://www.npmjs.com/)
* Some open source libraries: [Epic React Spinners](https://github.com/bondz/react-epic-spinners)

Made with ❤️ by The Misfits - [Simran](https://simmsss.github.io/) and [Utkarsh](https://skhiearth.github.io/)