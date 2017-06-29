// import from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

// import from containers
import QueryHandler from '../../containers/QueryHandler/QueryHandler';

// import from components
import LoginModal from '../../components/LoginModal/LoginModal';

// import from styles
import './HomePage.scss';

// import from constants
import { demoCr } from '../../constants/demo';

// import from assets
import UnileverLargeLogo from '../../assets/images/UL-large-logo.png';

export default class HomePage extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = { isLoggedIn: false };
  }

  onLogin = (login, password) => {
    login === demoCr.login && password === demoCr.password && this.setState({ isLoggedIn: true });
  };

  render() {
    return (
      <div className='home-page'>

        { this.state.isLoggedIn && [
          <Grid className='top-content' key='top-content'>
            <Col xs={12} md={6} mdOffset={3}>
              <img className='unilever-logo' src={UnileverLargeLogo} />
            </Col>
          </Grid>,

          <QueryHandler key='query-handler' />
        ] }

        { !this.state.isLoggedIn && <LoginModal onLogin={this.onLogin} /> }
      </div>
    );
  }

}
