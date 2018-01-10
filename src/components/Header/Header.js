import React from 'react';
import { Link } from 'react-router';
import './Header.css';

export default class TopBar extends React.Component {

  render() {
    return (
      <header className="header">
        {/*<Link to='/' style={{ color: 'white', marginRight: '10px' }}>*/}
          {/*Home*/}
        {/*</Link>*/}
        {/*<Link to='q1' style={{ color: 'white', marginRight: '10px' }}>*/}
          {/*Q1*/}
        {/*</Link>*/}
      </header>
    );
  }

}
