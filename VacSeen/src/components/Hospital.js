import React, { Component } from 'react';
import { Navigation } from ".";
import Web3 from 'web3';
import styles from './App.module.css';
import VacSeen from '../abis/VacSeen.json'
import bg from './Assets/3.png'
import { TrinityRingsSpinner } from 'react-epic-spinners'
import Portis from '@portis/web3';
import celo from './Assets/Networks/celo.png'
import eth from './Assets/Networks/ethereum.png'

let ContractKit = require("@celo/contractkit")
let kit

class Hospital extends Component {

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
        this.setState({ network: "ETH" })
        this.setState({ loading: false })
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
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  registerHospital(name, vaccine, id, dose) {
    this.setState({ loading: true })
    this.state.vacSeen.methods.registerHospital(name, vaccine, id, dose).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      console.log(this.state.loading)
    })
  }

  vaccinateCitizen(appointmentId, citizenId) {
    this.setState({ loading: true })
    this.state.vacSeen.methods.registerHospital(appointmentId, citizenId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      console.log(this.state.loading)
    })
  }

  placeVaccineOrder(manufacturerAddress, quantity, value) {
    this.setState({ loading: true })
    this.state.vacSeen.methods.placeVaccineOrder(manufacturerAddress, quantity).send({ from: this.state.account, value: value })
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
      validHospital: false,
      appointments: [],
      manufacturers: [],
      hospital: null
    }

    this.setupCelo = this.setupCelo.bind(this)
    this.setupEthereum = this.setupEthereum.bind(this)
    this.registerHospital = this.registerHospital.bind(this)
    this.vaccinateCitizen = this.vaccinateCitizen.bind(this)
    this.placeVaccineOrder = this.placeVaccineOrder.bind(this)
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
              
              <div class="col-5">
                <div>
                  {
                    this.state.validHospital ?
                    <div>Remaining Stock: {this.state.hospital.stock}</div> :
                    <div></div>
                  }
                </div>
                
              </div>
              <div class="col-6" style={{marginRight: 15}}>  
              {
                this.state.validHospital ?
                <div>
                  <div style={{textAlign:"center", verticalAlign:"middle"}}>
                    <p></p>
                    <p></p>
                  <p className={styles.headings}>Pending Appointments</p>
              </div>
              <p></p>
              { this.state.appointments.map((appointment, key) => {
                return(
                    
                  <div className="card mb-4" key={key} >
                    {/* Transaction Information */}
                    <div className="card-header">
                      <small className="text-muted">Appointment ID: {appointment.id.toString()}</small>
                      <p></p>
                      <small className="text-muted">Date: {(appointment.date.toString())}</small>
                      <p></p>
                      <small className="text-muted">Citizen's Address: {(appointment.citizen.toString())}</small>
                      <p></p>
                      <small className="text-muted">Citizen's ID: {(appointment.citizenId.toString())}</small>
                    </div>
                    <ul id="certificateList" className="list-group list-group-flush">
                      <li key={key} className="list-group-item py-3">

                      <small className="text-muted">Dose Count: {(appointment.doseCount.toString())}</small>

                        <form onSubmit={(event) => {
                            event.preventDefault()
                        }}>
                            <div style={{paddingTop: 14, marginLeft: 6, paddingBottom: 0}} class="input-group mb-3">
                            <button
                            className="btn btn-outline-success btn-sm float-right pt-0"
                            appointmentId={appointment.id}
                            citizenId={appointment.citizenId}
                            onClick={(event) => {
                              this.vaccinateCitizen(event.target.appointmentId, event.target.citizenId)
                            }}
                          >
                          Vaccinate Citizen
                          </button>
                            </div>
                        </form>

                      </li>
                    </ul>
                  </div>
                )
              })}

                <p className={styles.headings}>Order Vaccines</p>

                { this.state.manufacturers.map((manufacturer, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <small className="text-muted">Manufacturer's ID: {manufacturer.id.toString()}</small>
                      <p></p>
                      <small className="text-muted">Manufacturer: {(manufacturer.name.toString())} ({(manufacturer.owner.toString())})</small>
                      <p></p>
                      <small className="text-muted">Vaccine: {(manufacturer.vaccine.toString())}</small>
                      <p></p>
                      <small className="text-muted">GST ID: {(manufacturer.gstNo.toString())}</small>
                    </div>
                    <ul id="certificateList" className="list-group list-group-flush">
                      <li key={key} className="list-group-item py-3">

                      <small className="text-muted">Dose Cost: {(manufacturer.doseCost.toString())}</small>
                      <small className="text-muted">Stock: {(manufacturer.capacity.toString())}</small>

                        <form onSubmit={(event) => {
                           event.preventDefault()
                           const quantity = this.quantity.value
                           this.placeVaccineOrder(manufacturer.owner, quantity, window.web3.utils.toWei(manufacturer.doseCost.toString(), 'Ether'))
                        }}>
                            <div style={{paddingTop: 14, marginLeft: 6, paddingBottom: 0}} class="input-group mb-3">
                            <input
                                style={{marginRight: 6, marginLeft: 6, width: "50%"}}
                                id="quantity"
                                type="text"
                                ref={(input) => { this.quantity = input }}
                                className="form-control"
                                placeholder="Quantity (Doses)"
                                required />
                                <button type="submit" style={{marginRight: 16}} className="btn btn-outline-success btn-sm float-right pt-0">Place Order</button>
                            </div>
                        </form>

                      </li>
                    </ul>
                  </div>
                )
                })}

                

                </div> 
                :
                <div>
                  <div style={{textAlign:"center", verticalAlign:"middle"}}>
                  <div className={styles.verifyTitle} style={{textAlign:"center"}}>No registration found. Register as a new healthcare provider</div>
                </div>
                <p></p>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.hospitalName.value
                    const vaccine = this.vaccineName.value
                    const nahbID = this.nahbID.value
                    const doseCost = this.doseCost.value
                    this.registerHospital(name, vaccine, nahbID, window.web3.utils.toWei(doseCost.toString(), 'Ether'))
                  }}>
                  <div className="form-group">
                    <input
                      id="hospitalName"
                      type="text"
                      ref={(input) => { this.hospitalName = input }}
                      className="form-control"
                      placeholder="Healthcare Provider Name"
                      required />
                  </div>
                  <div className="form-group">
                    <input
                      id="vaccineName"
                      type="text"
                      ref={(input) => { this.vaccineName = input }}
                      className="form-control"
                      placeholder="Which vaccine will you administer?"
                      required />
                  </div>
                  <div className="form-group">
                    <input
                      id="nahbID"
                      type="text"
                      ref={(input) => { this.nahbID = input }}
                      className="form-control"
                      placeholder="NAHB ID"
                      required />
                  </div>
                  <div class="input-group mb-3">
                      <div class="input-group-prepend">
                          <span class="input-group-text">{this.state.network}</span>
                      </div>
                      <input
                        id="doseCost"
                        type="text"
                        ref={(input) => { this.doseCost = input }}
                        className="form-control"
                        placeholder="Cost of one dose for patients"
                        required />
                  </div>
                  <button type="submit" className="btn btn btn-outline-light btn-block">Send application to admin</button>
                </form>
                </div>
              }
              
              </div>
            </div>

            <div className={styles.networkSelectorRight}>
              <p className={styles.connectedToRight}>Connected to {this.state.network}</p>
              <p>Change Network: </p>
              <button style={{backgroundImage: "url(" + celo + ")"}} className={styles.networkButtonRight} onClick={this.setupCelo}></button>
              <button style={{backgroundImage: "url(" + eth + ")"}} className={styles.networkButtonRight} onClick={this.setupEthereum}></button>
            </div>
          </div>
        }

          
        </div>
      </div>
    );
  }
}

export default Hospital;
