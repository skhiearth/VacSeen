import React from "react";
import { Link, withRouter } from "react-router-dom";
import styles from './App.module.css';
import icon from './Assets/icon.png';

function Navigation(props) {
  return (
    <div className="navigation">
      <nav class="py-3 navbar navbar-expand-sm">
        <div class="container">
        <img src={icon} style={{height: 80, width: 275}} alt="Logo" /> 
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
              <li
                class={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/" className={styles.navbarlinks}>
                  Home
                  <span class="sr-only">(current)</span>
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/Orders" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Orders" className={styles.navbarlinks}>
                  Orders
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/Orders" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Seller" className={styles.navbarlinks}>
                  Sell your products
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
      </nav>
    </div>
  );
}

export default withRouter(Navigation);