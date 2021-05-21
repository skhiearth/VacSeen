import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import { withRouter } from "react-router";
import { Navigation } from ".";
import Web3 from 'web3';
import styles from './App.module.css';
import VacSeen from '../abis/VacSeen.json'
import bg from './Assets/3.png'
import { FingerprintSpinner } from 'react-epic-spinners'
import celo from './Assets/Networks/celo.png'
import eth from './Assets/Networks/ethereum.png'

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
      <div style={{backgroundImage: "url(" + bg + ")", height: "100%", backgroundPosition: "bottom", 
      backgroundSize: "cover", backgroundRepeat: 'no-repeat', resizeMode: 'cover', textAlign: "center"}}>
        <Navigation color="#"/>
        <div class="row">
          <div class="col-8">
            
          </div>
        </div>

        <div className={styles.networkSelectorRight}>
          <p>Select Network: </p>
          <button style={{backgroundImage: "url(" + celo + ")"}} className={styles.networkButtonRight} onclick="setupCelo()"></button>
          <button style={{backgroundImage: "url(" + eth + ")"}} className={styles.networkButtonRight} onclick="setupEthereum()"></button>
        </div>
      </div>
    );
  }
}

export default Hospital;
