import React, { Component } from 'react';
import { Navigation } from ".";
import Web3 from 'web3';
import styles from './App.module.css';
import VacSeen from '../abis/VacSeen.json'
import bg from './Assets/2.png'
import { TrinityRingsSpinner } from 'react-epic-spinners'
import Portis from '@portis/web3';
import celo from './Assets/Networks/celo.png'
import eth from './Assets/Networks/ethereum.png'

let ContractKit = require("@celo/contractkit")
let kit

class Admin extends Component {

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
          this.setState({ network: "CELO" })

          const admin = await vacSeen.methods.getGovernment().call()
          this.setState({ admin })

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

          if(admin === accounts[0]){
            this.setState({ validAdmin: true })
          }

          this.setState({ loading: false})
          this.setState({ account: accounts[0] })
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

      const portis = new Portis('dffb7971-7b9c-4dd2-9795-521722448b7d', 'ropsten');
      const web3 = new Web3(portis.provider);

      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })

      const networkId = await web3.eth.net.getId()
      const networkData = VacSeen.networks[networkId]

      if(networkData) {
        const vacSeen = new web3.eth.Contract(VacSeen.abi, networkData && networkData.address)
        this.setState({ vacSeen })
        this.setState({ network: "ETH" })

        const admin = await vacSeen.methods.getGovernment().call()
        this.setState({ admin })

        const hospitalCount = await vacSeen.methods.hospitalCount().call()
        this.setState({ hospitalCount })

        const citizenCount = await vacSeen.methods.citizenCount().call()
        this.setState({ citizenCount })

        const manufacturerCount = await vacSeen.methods.manufacturerCount().call()
        this.setState({ manufacturerCount })

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

        for (var k = 0; k < citizenCount; k++) {
          const citizenFromID = await vacSeen.methods.Citizens(i).call()
          const citizen = await vacSeen.methods.HospitalsID(citizenFromID.publicAddress).call()
          if(citizen.vaccinated){
            this.setState({ vaccinatedCitizens: this.state.vaccinatedCitizens + 1 })
          } else {
            this.setState({ nonVaccinatedCitizens: this.state.nonVaccinatedCitizens + 1 })
          }
        }

        for (var l = 0; l < manufacturerCount; l++) {
          const manufacturer = await vacSeen.methods.ManufacturersID(l).call()
          this.setState({ totalSupply: this.state.supply + manufacturer.capacity })
        }

        for (const hospital in this.validateHospital) {
          this.setState({ supply: this.state.supply + hospital.stock })
          this.setState({ totalSupply: this.state.totalSupply + hospital.stock })
        }

        if(admin === accounts[0]){
          this.setState({ validAdmin: true })
        }

        this.setState({ loading: false })
        this.setState({ account: accounts[0] })
      }
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  validateHospital(hospitalID) {
    this.setState({ loading: true })
    this.state.vacSeen.methods.validateHospital(hospitalID).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      console.log(this.state.loading)
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      network: 'CELO',
      vacSeen: null,
      loading: true,
      admin: null,
      validAdmin: false,
      hospitalCount: 0,
      manufacturerCount: 0,
      invalidatedHospitals: [],
      validatedHospitals: [],
      citizenCount: 0,
      vaccinatedCitizens: 0,
      nonVaccinatedCitizens: 0,
      supply: 0,
      totalSupply: 0
    }

    this.setupCelo = this.setupCelo.bind(this)
    this.setupEthereum = this.setupEthereum.bind(this)
    this.validateHospital = this.validateHospital.bind(this)
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
              <div class="col-6" style={{marginLeft: 15}}>  
                {
                  this.state.validAdmin ?
                  <div>
                    You are logged in as the admin: {this.state.admin}

                    <p></p>
                    <p className={styles.headings}>Invalidated Hospitals: </p>
                    { this.state.invalidatedHospitals.map((hospital, key) => {
                        return(
                          <div className="card mb-4 border-danger" key={key} >
                            <div className="card-header">
                              <small>{hospital.name}</small>
                              <p></p>
                              <small className="text-muted">Vaccine: {hospital.vaccine}</small>
                              
                              <p></p>
                              <small style={{marginTop: -20}} className="text-muted float-right">NAHB ID: {hospital.nabhID.toString()}</small>
                              <small className="text-muted float-right">Blockchain Hospital ID: {hospital.id.toString()}</small>
                            </div>
                            <ul className="list-group list-group-flush">
                              
                              <li key={key} className="list-group-item py-2">

                              <small className="float-left mt-1 text-muted">
                                  Cost of one dose: {window.web3.utils.fromWei(hospital.doseCost.toString(), 'Ether')} {this.state.network}
                                </small>

                                <button
                                  className="btn btn-outline-success btn-sm float-right pt-0"
                                  name={hospital.id}
                                  onClick={(event) => {
                                    this.validateHospital(event.target.name)
                                  }}
                                >
                                Validate
                                </button>

                              </li>
                            </ul>
                          </div>
                        )
                })}

                    <p></p>
                    <p className={styles.headings}>Validated Hospitals: </p>
                    { this.state.validatedHospitals.map((hospital, key) => {
                        return(
                          <div className="card mb-4 border-success" key={key} >
                            <div className="card-header">
                              <small>{hospital.name}</small>
                              <p></p>
                              <small className="text-muted">Vaccine: {hospital.vaccine}</small>
                              
                              <p></p>
                              <small style={{marginTop: -20}} className="text-muted float-right">NAHB ID: {hospital.nabhID.toString()}</small>
                            </div>
                            <ul className="list-group list-group-flush">
                              
                              <li key={key} className="list-group-item py-2">

                              <small className="float-left mt-1 text-muted">
                                  Cost of one dose: {window.web3.utils.fromWei(hospital.doseCost.toString(), 'Ether')} {this.state.network}
                                </small>
                                <p></p>
                                <small className="float-right mt-1 text-muted">
                                  Stock: {hospital.stock.toString()} units
                                </small>
                                
                              </li>
                            </ul>
                          </div>
                        )
                })}

                  </div> :
                  <div>
                    <br></br>
                    Access denied. Only the admin/contract creator can access this tab.
                  </div>
                }
              </div>

              <div class="col-4">
                <div>
                    {
                      this.state.validAdmin ?
                      <div>
                        <p className={styles.summaryTitle}>Overview</p>
                        <p className={styles.summary}>Registered Citizens: {this.state.citizenCount.toString()}</p>
                        <p className={styles.summary}>Fully Vacinated Citizens: {this.state.vaccinatedCitizens.toString()}</p>
                        <p className={styles.summary}>Non-vaccinated Citizens: {this.state.nonVaccinatedCitizens.toString()}</p>
                        <p className={styles.summary}>Total Circulating Supply of Vaccine: {this.state.supply.toString()} doses</p>
                        <p className={styles.summary}>Max Supply of Vaccine (Circulation + Manufacturer Inventory): {this.state.totalSupply.toString()} doses</p>
                      </div> :
                      <div></div>
                    }
                  </div>
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

export default Admin;
