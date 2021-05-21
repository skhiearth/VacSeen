import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import { withRouter } from "react-router";
import Web3 from 'web3';
import styles from './App.module.css';
import VacSeen from '../abis/VacSeen.json'
import bg from './Assets/3.png'
import { FingerprintSpinner } from 'react-epic-spinners'

let ContractKit = require("@celo/contractkit")
let kit

class Hospital extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }

  }

  render() {
    return (
      <div></div>
    );
  }
}

export default Hospital;
