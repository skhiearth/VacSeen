import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import { withRouter } from "react-router";
import { Navigation, Footer } from ".";
import Web3 from 'web3';
import styles from './App.module.css';
import VacSeen from '../abis/VacSeen.json'
import bg from './Assets/5.png'
import celo from './Assets/Networks/celo.png'
import eth from './Assets/Networks/ethereum.png'
import { TrinityRingsSpinner } from 'react-epic-spinners'
import Portis from '@portis/web3';

let ContractKit = require("@celo/contractkit")
let kit

class Public extends Component {

  async componentWillMount() {
    this.setupCelo()
  }

  async setupCelo() {
    if (window.celo) {
      try {
        this.setState({ loading: true })
        await window.celo.enable()
  
        const web3 = new Web3(window.celo)
        window.web3 = new Web3(window.celo)
        kit = ContractKit.newKitFromWeb3(web3)
  
        const accounts = await kit.web3.eth.getAccounts()
        kit.defaultAccount = accounts[0]

        this.setState({ account: accounts[0] })

        const networkId = await web3.eth.net.getId()
        const networkData = VacSeen.networks[networkId]
        if(networkData) {
          const vacSeen = new web3.eth.Contract(VacSeen.abi, networkData && networkData.address)
          this.setState({ vacSeen })
          this.setState({ network: "Celo" })
          this.setState({ loading: false})
          this.setState({ account: accounts[0] })

          const hospitalCount = await vacSeen.methods.hospitalCount().call()
          this.setState({ hospitalCount })

          const manufacturerCount = await vacSeen.methods.manufacturerCount().call()
          this.setState({ manufacturerCount })
  
          for (var i = 0; i < hospitalCount; i++) {
            const hospital = await vacSeen.methods.HospitalsID(i).call()
            if(hospital.owner === this.state.account){
              if(hospital.isValidated){
                this.setState({ hospital })
                this.setState({
                  validHospital: true
                })

                for (var k = 0; k < manufacturerCount; k++) {
                  const manufacturer = await vacSeen.methods.ManufacturersID(k).call()
                  if(manufacturer.vaccine === hospital.vaccine){
                      this.setState({
                        manufacturers: [...this.state.manufacturers, manufacturer]
                      })
                  }
                }

              }
            }
          }
          

          const appointmentCount = await vacSeen.methods.appointmentCount().call()
          this.setState({ appointmentCount })

          for (i = 0; i < appointmentCount; i++) {
            const appointment = await vacSeen.methods.Appointments(i).call()
            if(appointment.hospital === this.state.account){
              if(!appointment.vaccinated){
                this.setState({
                  appointments: [...this.state.appointments, appointment]
                })
              }
            }
          }
        } 
      } catch (error) {
        console.log(`⚠️ ${error}.`)
      }
    } else {
      console.log("⚠️ Please install the CeloExtensionWallet.")
    }
  }

  async setupEthereum() {
    if (window.web3) {
      this.setState({ loading: true })
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();

      const portis = new Portis('dffb7971-7b9c-4dd2-9795-521722448b7d', 'ropsten');
      const web3 = new Web3(portis.provider);

      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })

      const networkId = await web3.eth.net.getId()
      const networkData = VacSeen.networks[networkId]

      if(networkData) {
        const vacSeen = new web3.eth.Contract(VacSeen.abi, networkData && networkData.address)
        this.setState({ vacSeen })
        this.setState({ network: "Ethereum" })
        this.setState({ loading: false })
        this.setState({ account: accounts[0] })

        const hospitalCount = await vacSeen.methods.hospitalCount().call()
          this.setState({ hospitalCount })

          for (var i = 0; i < hospitalCount; i++) {
            const hospital = await vacSeen.methods.HospitalsID(i).call()
            if(!hospital.isValidated){
              this.setState({
                invalidatedHospitals: [...this.state.invalidatedHospitals, hospital]
              })
            } else {
              this.setState({
                validatedHospitals: [...this.state.validatedHospitals, hospital]
              })
            }
          }

          for (var j = 0; j < hospitalCount; j++) {
            const citizen = await vacSeen.methods.Citizens(i).call()
            if(citizen.publicAddress === this.state.account){
              if(citizen.isCreated){
                this.setState({ citizen })
                this.setState({
                  validPublic: true
                })
              }
            }
          }

        const appointmentCount = await vacSeen.methods.appointmentCount().call()
        this.setState({ appointmentCount })

        for (i = 0; i < appointmentCount; i++) {
          const appointment = await vacSeen.methods.Appointments(i).call()
          if(appointment.citizen === this.state.account){
            if(!appointment.vaccinated){
              this.setState({
                appointments: [...this.state.appointments, appointment]
              })
            }
          }
        }
      }
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      network: 'Celo',
      vacSeen: null,
      loading: true,
      hospitalCount: 0,
      citizen: null,
      invalidatedHospitals: [],
      validatedHospitals: [],
      validPublic: false
    }

    this.setupCelo = this.setupCelo.bind(this)
    this.setupEthereum = this.setupEthereum.bind(this)
  }

  render() {
    return (
      <div style={{backgroundImage: "url(" + bg + ")", height: "100%", backgroundPosition: "bottom", 
      backgroundSize: "cover", backgroundRepeat: 'no-repeat', resizeMode: 'cover', textAlign: "center"}}>
        <Navigation color="#"/>
        <div>

        { this.state.loading
          ? 
          <div className="center mt-19">
              <TrinityRingsSpinner
              style={{width: "100%"}}
                color='#251F82'
                size='200'
	            />
              <div style={{paddingTop: 10, textAlign: "center", fontSize: 12, fontWeight: 600, color: "black"}}>Processing...</div>
            </div>
          : 
          <div>
            <div class="row">
              <div class="col-6"></div>
              <div class="col-6">  
                
              </div>
            </div>

            <div className={styles.networkSelector}>
              <p className={styles.connectedToLeft}>Connected to {this.state.network}</p>
              <p>Change Network: </p>
              <button style={{backgroundImage: "url(" + celo + ")"}} className={styles.networkButton} onClick={this.setupCelo}></button>
              <button style={{backgroundImage: "url(" + eth + ")"}} className={styles.networkButton} onClick={this.setupEthereum}></button>
            </div>
          </div>
        }

          
        </div>
      </div>
    );
  }
}

export default Public;
