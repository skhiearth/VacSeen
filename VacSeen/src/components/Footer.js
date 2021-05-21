import React from "react";
import styles from './App.module.css';

function Footer() {
  return (
    <div className="footer">
      <footer class="py-1 fixed-bottom" style={{height:80, position: "relative", bottom: 0}}>
        <div class="container" style={{padding:20}}>
          <p class="m-0 text-center text-dark" className={styles.footerHeader}>
            Made with <span role="img" aria-label="love">✨ </span>  by The Misfits
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;