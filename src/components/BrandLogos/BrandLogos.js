// import from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

// import from assets
import AxeLogo from './axe-logo.png';
import DoveLogo from './dove-logo.png';
import SuaveLogo from './suave-logo.png';
import RexonaLogo from './rexona-logo.png';

// import from styles
import './BrandLogos.css';

export default class BrandLogos extends React.Component {

  render() {
    return (
      <div className="brand-logos">
        <Grid>
          <Col xs={6} md={4} mdOffset={2} className="logo-holder">
            <img src={AxeLogo} />
          </Col>
          <Col xs={6} md={4} className="logo-holder">
            <img src={DoveLogo} />
          </Col>
        </Grid>
        <Grid>
          <Col xs={6} md={4} mdOffset={2} className="logo-holder">
            <img src={SuaveLogo} />
          </Col>
          <Col xs={6} md={4} className="logo-holder">
            <img src={RexonaLogo} />
          </Col>
        </Grid>
      </div>
    );
  }

}
