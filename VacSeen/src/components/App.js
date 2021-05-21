import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Footer, Main, Admin, Hospital, Dashboard, Manufacturer, Public } from ".";
import Web3 from 'web3';
import styles from './App.module.css';
import VacSeen from '../abis/VacSeen.json'
import bg from './Assets/1.png'
import { FingerprintSpinner } from 'react-epic-spinners'

let ContractKit = require("@celo/contractkit")
let kit

class App extends Component {

  // async componentWillMount() {
  //   // await this.loadBlockchainData()
  //   this.connectCeloWallet()
  // }

  // async connectCeloWallet() {
  //   if (window.celo) {
  //     try {
  //       await window.celo.enable()
  
  //       const web3 = new Web3(window.celo)
  //       kit = ContractKit.newKitFromWeb3(web3)
  
  //       const accounts = await kit.web3.eth.getAccounts()
  //       kit.defaultAccount = accounts[0]

  //       this.setState({ account: accounts[0] })
  //       const networkId = await web3.eth.net.getId()
  //       const networkData = VacSeen.networks[networkId]
  //       if(networkData) {
  //         const vacSeen = new web3.eth.Contract(VacSeen.abi, networkData.address)
  //         this.setState({ vacSeen })
  //         this.setState({ loading: false})
  //       } else {
  //         window.alert('VacSeen contract not deployed to detected network.')
  //       }
  //     } catch (error) {
  //       console.log(`⚠️ ${error}.`)
  //     }
  //   } else {
  //     console.log("⚠️ Please install the CeloExtensionWallet.")
  //   }
  // }

  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     account: '',
  //     vacSeen: null
  //   }
  // }

  render() {
    return (
      <div className="App" style={{height:800}}>
        <Router>
          <Navigation />
          <Switch>
            <Route path="/" exact component={() => <Main />} />
            <Route path="/Admin" exact component={() => <Admin />} />
            <Route path="/Dashboard" exact component={() => <Dashboard />} />
            <Route path="/Hospital" exact component={() => <Hospital />} />
            <Route path="/Manufacturer" exact component={() => <Manufacturer />} />
            <Route path="/Public" exact component={() => <Public />} />
          </Switch>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;