import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import { withRouter } from "react-router";
import Web3 from 'web3';
import styles from './App.module.css';
import VacSeen from '../abis/VacSeen.json'
import bg from './Assets/bg1.png'
import { FingerprintSpinner } from 'react-epic-spinners'

let ContractKit = require("@celo/contractkit")
let kit

class App extends Component {

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default App;