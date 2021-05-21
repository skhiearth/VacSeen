import React, { Component } from 'react';
import  { Link } from 'react-router-dom'
import { withRouter } from "react-router";
import styles from './App.module.css';
import bg from './Assets/1.png'
import logo from './Assets/Logo.png';

class Main extends Component {
  render() {
    return (
      <div style={{backgroundImage: "url(" + bg + ")", height: "100%", backgroundPosition: "bottom", 
      backgroundSize: "cover", backgroundRepeat: 'no-repeat', resizeMode: 'cover', textAlign: "center"}}>
        <br></br>
        <img src={logo} style={{height: 230}} className={styles.center} alt="Logo"/>
        <br></br>
        <p>Please select your category</p>
        <div class="row" className={styles.center} style={{textAlign: "center", width: "40%"}}>
          <Link to="/Admin"><button type="button" style={{margin: "auto", marginLeft: 10, marginRight: 10}} class="btn btn-info">Admin</button></Link>
          <Link to="/Hospital"><button type="button" style={{margin: "auto", marginLeft: 10, marginRight: 10}} class="btn btn-info">Healthcare Provider</button></Link>
          <Link to="/Public"><button type="button" style={{margin: "auto", marginLeft: 10, marginRight: 10}} class="btn btn-info">General Public</button></Link>
          <Link to="/Manufacturer"><button type="button" style={{margin: "auto", marginLeft: 10, marginRight: 10}} class="btn btn-info">Manufacturer</button></Link>
        </div>
      </div>
    );
  }
}

const MainWithRouter = withRouter(Main);

export default MainWithRouter;