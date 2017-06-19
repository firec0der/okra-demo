import React from 'react';
import { Link } from 'react-router';
import './Header.scss';

export default class TopBar extends React.Component {

  render() {
    return (
      <header className='header'>
        <Link to='/' style={{ color: 'white', marginRight: '10px' }}>
          Home
        </Link>
        <Link to='nielsen-barchart' style={{ color: 'white' }}>
          Nielsen container showcase
        </Link>
      </header>
    );
  }

}
