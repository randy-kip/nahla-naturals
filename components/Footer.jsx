import React from 'react';
import { AiFillInstagram, AiOutlineTwitter} from 'react-icons/ai';

const Footer = () => {
  return (
    <div className="footer-container">
      <p>2024 Nahla Naturals All rights reserverd</p>
      <p className="icons">
        <a href="https://www.instagram.com/nahla_naturals?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
          <AiFillInstagram />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <AiOutlineTwitter />
        </a>
      </p>
    </div>
  )
}

export default Footer