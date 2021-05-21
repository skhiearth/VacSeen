import React from "react";
import { Link, withRouter } from "react-router-dom";
import styles from './App.module.css';

function Navigation(props) {
  return (
    <div className="navigation" style={{backgroundColor: props.color}}>
      <nav class="py-3 navbar navbar-expand-sm">
        <div class="container">
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
                  props.location.pathname === "/Admin" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Admin" className={styles.navbarlinks}>
                  Admin
                  <span class="sr-only">(current)</span>
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/Public" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Public" className={styles.navbarlinks}>
                  General Public
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/Hospital" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Hospital" className={styles.navbarlinks}>
                  Hospital
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/Manufacturer" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/Manufacturer" className={styles.navbarlinks}>
                Manufacturer
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