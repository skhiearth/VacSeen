import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import { withRouter } from "react-router";
import { Navigation } from ".";
import Web3 from 'web3';
import styles from './App.module.css';
import VacSeen from '../abis/VacSeen.json'
import bg from './Assets/4.png'
import { FingerprintSpinner } from 'react-epic-spinners'
import celo from './Assets/Networks/celo.png'
import eth from './Assets/Networks/ethereum.png'

let ContractKit = require("@celo/contractkit")
let kit

class Dashboard extends Component {

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

        <div className={styles.networkSelector}>
          <p>Select Network: </p>
          <button style={{backgroundImage: "url(" + celo + ")"}} className={styles.networkButton} onclick="setupCelo()"></button>
          <button style={{backgroundImage: "url(" + eth + ")"}} className={styles.networkButton} onclick="setupEthereum()"></button>
        </div>
      </div>
    );
  }
}

export default Dashboard;
