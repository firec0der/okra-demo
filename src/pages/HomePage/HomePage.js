// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';

// import from components
import SearchBar from '../../components/SearchBar/SearchBar';
import BarChart from '../../components/BarChart/BarChart';
import PieChart from '../../components/PieChart/PieChart';
import Select from '../../components/Select/Select';

// import from styles
import './HomePage.scss';

// import from modules
import { fetchKantarData } from '../../modules/kantarData';

// import from assets
import UnileverLargeLogo from '../../assets/images/UL-large-logo.png';

const barChartData = [
  { name: 'Unilever', 2007: 29.1, 2008: 31.28, 2009: 39.62 },
  { name: 'P&G', 2007: 14.63, 2008: 13.04, 2009: 10.1 },
  { name: 'Beiersdorf', 2007: 20.3, 2008: 18.9, 2009: 25.96 },
  { name: 'Another one', 2007: 20.3, 2010: 28.12 },
];

const pieChartData = [
  { name: 'Sector A', value: 400 }, { name: 'Sector B', value: 300 },
  { name: 'Sector C', value: 300 }, { name: 'Sector D', value: 200 }
];

const mapStateToProps = ({ kantarBrands, kantaData }) => ({
  kantarBrands,
  kantaData
});

const mapDispatchToProps = {
  fetchKantarData
};

class HomePage extends React.Component {

  static propTypes = {
    kantarBrands: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      dictionary: PropTypes.object,
    }),
    fetchKantarData: PropTypes.func.isRequired
  };

  brandOptions = () => {
    const dictionary = this.props.kantarBrands.dictionary;
    return Object.keys(dictionary).map(key => ({ value: key, label: dictionary[key] }));
  }

  onBrandSelectChange = (selectedBrands) => this.props.fetchKantarData({
    brandIds: selectedBrands.map(value => value.value)
  });

  render() {
    const { kantarBrands } = this.props;

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
          <Col xs={12} md={6}>
            <Select
              options={this.brandOptions()}
              multi
              isLoading={kantarBrands.isLoading}
              onChange={this.onBrandSelectChange}
            />
            <BarChart data={barChartData} />
          </Col>
          <Col xs={12} md={6}>
            <PieChart data={pieChartData} />
          </Col>
        </Grid>
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
