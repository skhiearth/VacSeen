import React, { Component } from 'react';
import { Navigation } from ".";
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
          this.setState({ network: "CELO" })
          this.setState({ loading: false})
          this.setState({ account: accounts[0] })

          const hospitalCount = await vacSeen.methods.hospitalCount().call()
          this.setState({ hospitalCount })

          const citizenCount = await vacSeen.methods.citizenCount().call()
          this.setState({ citizenCount })

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

          for (var j = 0; j < citizenCount; j++) {
            const citizen = await vacSeen.methods.Citizens(j).call()
            if(citizen.publicAddress === this.state.account){
              if(citizen.isCreated){
                this.setState({ citizen })
                if(citizen.vaccinated){
                  this.setState({ vaccinated: true })
                }
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

          const citizenCount = await vacSeen.methods.citizenCount().call()
          this.setState({ citizenCount })

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

          for (var j = 0; j < citizenCount; j++) {
            const citizen = await vacSeen.methods.Citizens(j).call()
            if(citizen.publicAddress === this.state.account){
              if(citizen.isCreated){
                this.setState({ citizen })
                if(citizen.vaccinated){
                  this.setState({ vaccinated: true })
                }
                this.setState({
                  validPublic: true
                })
              }
            }
          }

        const appointmentCount = await vacSeen.methods.appointmentCount().call()
        this.setState({ appointmentCount })
        window.alert(appointmentCount)

        for (i = 0; i < appointmentCount; i++) {
          const appointment = await vacSeen.methods.Appointments(i).call()
          window.alert(appointment.citizen)
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

  registerCitizen(name) {
    this.setState({ loading: true })
    this.state.vacSeen.methods.registerCitizen(name).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      console.log(this.state.loading)
    })
  }

  bookAppointment(date, id, address, vaccine, value) {
    this.setState({ loading: true })
    this.state.vacSeen.methods.bookAppointment(date, id, address, vaccine).send({ from: this.state.account, value: value })
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
      hospitalCount: 0,
      citizen: null,
      invalidatedHospitals: [],
      validatedHospitals: [],
      validPublic: false,
      appointments: [],
      vaccinated: false
    }

    this.setupCelo = this.setupCelo.bind(this)
    this.setupEthereum = this.setupEthereum.bind(this)
    this.registerCitizen = this.registerCitizen.bind(this)
    this.bookAppointment = this.bookAppointment.bind(this)
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
                this.state.validPublic ?
                <div>
                  <div style={{textAlign:"center", verticalAlign:"middle"}}>
                    <p></p>
                    <p></p>
                  <p className={styles.headings}>Your Appointments</p>
              </div>
              <p></p>
              { this.state.appointments.map((appointment, key) => {
                return(
                  <div className="card mb-3" key={key} >
                    <div className="card-header">
                      <small className="text-muted">Appointment ID: {appointment.id.toString()}, Date: {(appointment.date.toString())}</small>
                      <p></p>
                      <small className="text-muted">Hospital's Address: {(appointment.hospital.toString())}, ID: {(appointment.hospitalId.toString())}</small>
                      <p></p>
                      <small className="text-muted">Vaccine: {(appointment.vaccine.toString())}, Dose Count: {(appointment.doseCount.toString())}</small>
                    </div>
                  </div>
                )
              })}

                <p className={styles.headings}>Book Appointments</p>

                { this.state.validatedHospitals.map((hospital, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <small className="text-muted">Hospital's ID: {hospital.id.toString()}</small>
                      <p></p>
                      <small className="text-muted">Hospital: {(hospital.name.toString())} ({(hospital.owner.toString())})</small>
                      <p></p>
                      <small className="text-muted">Vaccine: {(hospital.vaccine.toString())}</small>
                      <p></p>
                      <small className="text-muted">NABH NO.: {(hospital.nabhID.toString())}</small>
                    </div>
                    <ul id="certificateList" className="list-group list-group-flush">
                      <li key={key} className="list-group-item py-3">

                      <small className="text-muted">Dose Cost: {window.web3.utils.fromWei(hospital.doseCost.toString(), 'Ether')} {this.state.network},   </small>
                      <small className="text-muted">  Stock: {(hospital.stock.toString())}</small>

                        <form onSubmit={(event) => {
                           event.preventDefault()
                           const date = this.date.value
                           this.bookAppointment(date, hospital.id.toString(), hospital.owner.toString(), hospital.vaccine.toString(), hospital.doseCost.toString())
                        }}>
                            <div style={{paddingTop: 14, marginLeft: 6, paddingBottom: 0}} class="input-group mb-3">
                            <input
                                style={{marginRight: 6, marginLeft: 6, width: "50%"}}
                                id="date"
                                type="text"
                                ref={(input) => { this.date = input }}
                                className="form-control"
                                placeholder="Date of appointment"
                                required />
                                <button type="submit" style={{marginRight: 16}} className="btn btn-outline-success btn-sm float-right pt-0">Book Appointment</button>
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
                  <div className={styles.verifyTitle} style={{textAlign:"center"}}>You are not yet registered for vaccination. Create your profile.</div>
                </div>
                <p></p>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.citizenName.value
                    this.registerCitizen(name)
                  }}>
                  <div className="form-group">
                    <input
                      id="citizenName"
                      type="text"
                      ref={(input) => { this.citizenName = input }}
                      className="form-control"
                      placeholder="Your full name (as per documents)"
                      required />
                  </div>
                  <button type="submit" className="btn btn btn-outline-light btn-block">Register for vaccination</button>
                </form>
                </div>
              }
              </div>
              <div class="col-4">
                <div>
                    {
                      this.state.validPublic ?
                      <div>You have got {this.state.citizen.doses} doses</div> :
                      <div></div>
                    }
                  </div>
              </div>
              <div class="col-5"></div>
              
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
