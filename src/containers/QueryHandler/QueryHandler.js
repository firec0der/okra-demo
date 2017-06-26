// import from vendors
import React from 'react';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from constants
import {
  CHANNEL_FILTER,
  AREA_FILTER,
  GENRE_FILTER,
  BRAND_FILTER,
  PACKAGING_FILTER,
  APPLIER_FILTER,
  DATA_FILTERS_CONFIG
} from '../../constants/dataFilters';

// import from components
import BrandLogos from '../../components/BrandLogos/BrandLogos';
import SearchBar from '../../components/SearchBar/SearchBar';

// import from utils
import { mergeObjects } from '../../utils/object';

// import from containers
import PeriodsBarChart from '../../containers/PeriodsBarChart/PeriodsBarChart';

// import from styles
import './QueryHandler.scss';

const mapStateToProps = state => ({
  metrics: state.metrics,
  brands: state.brands
});

class QueryHandler extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      parsedBrands: [],
      parsedGenre: null
    };
  }

  detectBrand = query => {
    const { brands } = this.props;

    const lowerCasedQuery = query.toLowerCase();

    return brands.list.filter(brand => lowerCasedQuery.includes(brand.name.toLowerCase()));
  }

  detectGenre = query => {
    const genres = { 1: 'female', 2: 'male', 3: 'unisex' };

    const lowerCasedQuery = query.toLowerCase();

    return Object
      .keys(genres)
      .find(id => lowerCasedQuery.includes(genres[id]));
  };

  getBarChart = () => {
    const { parsedBrands, parsedGenre } = this.state;

    const barChartDataFilters = [
      BRAND_FILTER,
      AREA_FILTER,
      CHANNEL_FILTER,
      APPLIER_FILTER,
      GENRE_FILTER,
      PACKAGING_FILTER
    ];

    const barChartRequiredFilters = [];

    const barChartValues = {
      [DATA_FILTERS_CONFIG[BRAND_FILTER].key]: parsedBrands.map(brand => brand.id),
      [DATA_FILTERS_CONFIG[AREA_FILTER].key]: [8],
      [DATA_FILTERS_CONFIG[GENRE_FILTER].key]: parsedGenre,
    };

    return (
      <PeriodsBarChart
        key={JSON.stringify(barChartValues)}
        dataFilters={barChartDataFilters}
        dataFiltersValues={barChartValues}
        requiredFilters={barChartRequiredFilters}
        chosenMetric='penetration'
      />
    );
  };

  searchOnSubmit = value => this.setState({
    parsedBrands: this.detectBrand(value),
    parsedGenre: this.detectGenre(value)
  });

  render() {
    const { parsedBrands, parsedGenre } = this.state;

    const shouldShowResults = parsedBrands.length || parsedGenre;

    return (
      <div className='query-handler'>
        <Grid>
          <Col xs={12} md={6} mdOffset={3}>
            <SearchBar onSubmit={this.searchOnSubmit} />
          </Col>
        </Grid>

        <div className='result-body'>
          { shouldShowResults
            ? this.getBarChart()
            : <BrandLogos />
          }
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(QueryHandler);
