// import from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

// import from components
import SearchBar from '../../components/SearchBar/SearchBar';
import BarChart from '../../components/BarChart/BarChart';
import PieChart from '../../components/PieChart/PieChart';

// import from styles
import './HomePage.scss';

// import from assets
import UnileverLargeLogo from '../../assets/images/UL-large-logo.png';

const barChartData = [
  { name: 'Unilever', 2007: 29.1, 2008: 31.28, 2009: 39.62 },
  { name: 'P&G', 2007: 14.63, 2008: 13.04, 2009: 10.1 },
  { name: 'Beiersdorf', 2007: 20.3, 2008: 18.9, 2009: 25.96 },
];

const pieChartData = [
  { name: 'Sector A', value: 400 }, { name: 'Sector B', value: 300 },
  { name: 'Sector C', value: 300 }, { name: 'Sector D', value: 200 }
];

export default class HomePage extends React.Component {

  render() {
    const searchOnSubmit = (value) => window.alert(`It works, value: ${value}`);

    return (
      <div className='home-page'>
        <Grid className='top-content'>
          <Col xs={12} md={6} mdOffset={3}>
            <img className='unilever-logo' src={UnileverLargeLogo} />
            <SearchBar onSubmit={searchOnSubmit} />
          </Col>
        </Grid>

        <Grid>
          <Col xs={12} md={6} mdOffset={3}>
            <BarChart data={barChartData} />
          </Col>
        </Grid>

        <Grid>
          <Col xs={12} md={6} mdOffset={3}>
            <PieChart data={pieChartData} />
          </Col>
        </Grid>
      </div>
    );
  }

}
