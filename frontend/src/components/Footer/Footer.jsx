import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className='footer'>
           <hr/>
           <div className='footer-content'>
             <p>© 2026 powerfit. All rights reserved.</p>
             <a href="https://gym-accessories-store-admin.vercel.app/login" target="_blank" rel="noopener noreferrer" className="admin-link">
               Admin Login
             </a>
           </div>
        </footer>
    );
};

export default Footer;