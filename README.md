# VacSeen
by The Misfits at TechnoHack

Watch the Video Demo [here]()

The Coronavirus pandemic has struck India hard. The crumbling healthcare system and vaccine shortage don’t make the situation any better. While vaccines are the only reliable weapon against this menacing disease, citizens have been struggling to get themselves vaccinated with crashing servers, shortage of doses and black market dealings. VacSeen is a blockchain based vaccination portal that targets all ends of the vaccination chain, from manufacturer to members of the public.

![App Screenshots](https://github.com/skhiearth/VacSeen/blob/main/UI%20Elements/Screenshots/Cover.png?raw=true)

VacSeen targets all ends of the vaccine chain, from citizens to vaccine manufacturers, catering to the needs and requirements of all. Features of the platform from user perspective can be described as:

### Citizens

✅ Browse all healthcare providers - see their cost of vaccinations, NABH Registration Numbers and current stock of vaccines
✅ Reserve appointment and pay a fair price directly to the hospital using CELO or ETH
✅ Keep track of doses and book subsequent appointments

![App Screenshots](https://github.com/skhiearth/VacSeen/blob/main/UI%20Elements/Screenshots/Reserve%20and%20pay.png?raw=true)

### Government/Admin

✅ Summary overview regarding percentage of population vaccinated
✅ Verify healthcare providers before they can vaccinate the population

### Healthcare Providers

✅ Procure vaccines from multiple manufacturers at a fair price
✅ Collect payments in crypto - an asset class
✅ Log vaccination of people directly from the application, updating inventory and dose counts automatically

### Vaccine Manufacturers

✅ Reach out to several healthcare providers - prevent bias
✅ Keep track of inventory and add new batches
✅ Automatically collect payment for vaccine delivery

![App Screenshots](https://github.com/skhiearth/VacSeen/blob/main/UI%20Elements/Screenshots/Textual.png?raw=true)

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

![App Screenshots](https://github.com/skhiearth/VacSeen/blob/main/UI%20Elements/Screenshots/Tech%20Stack.png?raw=true)

Made with ❤️ by The Misfits - [Simran](https://simmsss.github.io/) and [Utkarsh](https://skhiearth.github.io/)
