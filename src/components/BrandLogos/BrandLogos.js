// import from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

// import from assets
import AxeLogo from '../../assets/images/axe-logo.png';
import DoveLogo from '../../assets/images/dove-logo.png';
import SuaveLogo from '../../assets/images/suave-logo.png';
import RexonaLogo from '../../assets/images/rexona-logo.png';

// import from styles
import './BrandLogos.scss';

export default class BrandLogos extends React.Component {

  render() {
    return (
      <div className='brand-logos'>
        <Grid>
          <Col xs={6} md={4} mdOffset={2} className='logo-holder'>
            <img src={AxeLogo} />
          </Col>
          <Col xs={6} md={4} className='logo-holder'>
            <img src={DoveLogo} />
          </Col>
        </Grid>
        <Grid>
          <Col xs={6} md={4} mdOffset={2} className='logo-holder'>
            <img src={SuaveLogo} />
          </Col>
          <Col xs={6} md={4} className='logo-holder'>
            <img src={RexonaLogo} />
          </Col>
        </Grid>
      </div>
    );
  }

}