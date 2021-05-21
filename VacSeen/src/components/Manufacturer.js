import React, { Component } from 'react';
import { Navigation } from ".";
import Web3 from 'web3';
import styles from './App.module.css';
import VacSeen from '../abis/VacSeen.json'
import bg from './Assets/6.png'
import { TrinityRingsSpinner } from 'react-epic-spinners'
import Portis from '@portis/web3';
import celo from './Assets/Networks/celo.png'
import eth from './Assets/Networks/ethereum.png'

let ContractKit = require("@celo/contractkit")
let kit

class Manufacturer extends Component {

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

          const manufacturerCount = await vacSeen.methods.manufacturerCount().call()
          this.setState({ manufacturerCount })
  
          for (var i = 0; i < manufacturerCount; i++) {
            const manufacturer = await vacSeen.methods.ManufacturersID(i).call()
            if(manufacturer.isCreated){
              this.setState({ manufacturer })
                this.setState({
                  validManufacturer: true
                })
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

        const manufacturerCount = await vacSeen.methods.manufacturerCount().call()
          this.setState({ manufacturerCount })
  
          for (var i = 0; i < manufacturerCount; i++) {
            const manufacturer = await vacSeen.methods.ManufacturersID(i).call()
            if(manufacturer.isCreated){
              this.setState({ manufacturer })
                this.setState({
                  validManufacturer: true
                })
            }
          }
      }
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  registerManufacturer(name, vaccine, gst, dose) {
    this.setState({ loading: true })
    this.state.vacSeen.methods.registerManufacturer(name, vaccine, gst, dose).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
      console.log(this.state.loading)
    })
  }

  addSupply(doses) {
    this.setState({ loading: true })
    this.state.vacSeen.methods.addSupply(doses).send({ from: this.state.account })
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
      validManufacturer: false,
      appointments: [],
      manufacturers: [],
      manufacturer: null
    }

    this.setupCelo = this.setupCelo.bind(this)
    this.setupEthereum = this.setupEthereum.bind(this)
    this.registerManufacturer = this.registerManufacturer.bind(this)
    this.addSupply = this.addSupply.bind(this)
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
                    this.state.validManufacturer ?
                    <div>Remaining Stock: {this.state.manufacturer.capacity}</div> :
                    <div></div>
                  }
                </div>
                
              </div>
              <div class="col-6" style={{marginRight: 15}}>  
              {
                this.state.validManufacturer ?
                <div>
                  <div style={{textAlign:"center", verticalAlign:"middle"}}>
                    <p></p>
                    <p></p>
              </div>
              <p></p>

              <div className="card mb-4">
                    <div className="card-header">
                      <small className="text-muted float-left">MID: {this.state.manufacturer.id.toString()}</small>
                      <p></p>
                      <small className="text-muted">Manufacturer: {(this.state.manufacturer.name.toString())} ({(this.state.manufacturer.owner.toString())})</small>
                      <p></p>
                      <small className="text-muted">Vaccine: {(this.state.manufacturer.vaccine.toString())}</small>
                      <p></p>
                      <small className="text-muted">GST ID: {(this.state.manufacturer.gstNo.toString())}</small>
                    </div>
              </div>

                <p className={styles.headings}>Update Stock</p>

                  <div>

                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const doses = this.doses.value
                    this.addSupply(doses)
                  }}>
                  <div class="input-group mb-3">
                      <div class="input-group-prepend">
                          <span class="input-group-text">#</span>
                      </div>
                      <input
                        id="doses"
                        type="text"
                        ref={(input) => { this.doses = input }}
                        className="form-control"
                        placeholder="Number of doses"
                        required />
                  </div>
                  <button type="submit" className="btn btn btn-outline-success btn-block">Update inventory</button>
                </form>

                  </div>

                </div> 
                :
                <div>
                  <div style={{textAlign:"center", verticalAlign:"middle"}}>
                  <div className={styles.verifyTitle} style={{textAlign:"center"}}>No registration found. Register as a new vaccine manufacturer</div>
                </div>
                <p></p>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.hospitalName.value
                    const vaccine = this.vaccineName.value
                    const nahbID = this.gst.value
                    const doseCost = this.doseCost.value
                    this.registerManufacturer(name, vaccine, nahbID, window.web3.utils.toWei(doseCost.toString(), 'Ether'))
                  }}>
                  <div className="form-group">
                    <input
                      id="hospitalName"
                      type="text"
                      ref={(input) => { this.hospitalName = input }}
                      className="form-control"
                      placeholder="Manufacturing Company Name"
                      required />
                  </div>
                  <div className="form-group">
                    <input
                      id="vaccineName"
                      type="text"
                      ref={(input) => { this.vaccineName = input }}
                      className="form-control"
                      placeholder="Which vaccine will you produce?"
                      required />
                  </div>
                  <div className="form-group">
                    <input
                      id="gst"
                      type="text"
                      ref={(input) => { this.gst = input }}
                      className="form-control"
                      placeholder="GST No."
                      required />
                  </div>
                  <div class="input-group mb-3">
                      <div class="input-group-prepend">
                          <span class="input-group-text">#</span>
                      </div>
                      <input
                        id="doseCost"
                        type="text"
                        ref={(input) => { this.doseCost = input }}
                        className="form-control"
                        placeholder="Cost of one dose for hospitals"
                        required />
                  </div>
                  <button type="submit" className="btn btn btn-outline-dark btn-block">Create Profile</button>
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

export default Manufacturer;
