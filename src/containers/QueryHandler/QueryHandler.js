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
  MANUFACTURER_FILTER,
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
  brands: state.brands,
  manufacturers: state.manufacturers,
});

class QueryHandler extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      parsedAreas: [],
      parsedBrands: [],
      parsedGenre: null,
      parsedApplier: null,
      parsedPackaging: null,
      parsedManufacturers: null,
      parsedMetric: null,
    };
  }

  detectBrand = query => {
    const { brands } = this.props;

    const lowerCasedQuery = query.toLowerCase();

    return brands.list.filter(brand => lowerCasedQuery.includes(brand.name.toLowerCase()));
  }

  detectManufacturer = query => {
    const { manufacturers } = this.props;

    const lowerCasedQuery = query.toLowerCase();

    return manufacturers.list.find(
      manufacturer => lowerCasedQuery.includes(manufacturer.name.toLowerCase())
    );
  }

  detectGenre = query => {
    const genres = { 1: 'female', 2: 'male', 3: 'unisex' };

    const lowerCasedQuery = query.toLowerCase();

    return Object
      .keys(genres)
      .find(id => lowerCasedQuery.includes(genres[id]));
  };

  detectApplier = query => {
    const appliers = {
      1: 'Aerosol',
      2: 'Rollon',
      3: 'Stick',
      4: 'Spray',
      5: 'Gel stick',
      6: 'Creme/Bisnaga'
    };

    const lowerCasedQuery = query.toLowerCase();

    return Object
      .keys(appliers)
      .find(id => lowerCasedQuery.includes(appliers[id].toLowerCase()));
  };

  detectPackaging = query => {
    const packagings = {
      1: 'Compact',
      2: 'Compressed',
      3: 'Regular'
    };

    const lowerCasedQuery = query.toLowerCase();

    return Object
      .keys(packagings)
      .find(id => lowerCasedQuery.includes(packagings[id].toLowerCase()));
  };

  detectArea = query => {
    const dictionary = {
      // NORTH+NORTHEAST
      1: ['Area I', 'AreaI', 'Area1', 'Area 1', 'North', 'North East', 'northeast', 'northeastern', 'ceara', 'rio grande do norte', 'paraiba', 'Pernambuco', 'Alagoas', 'Bahia', 'Sergipe', 'Piaui', 'Maranhao'],
      // EAST
      2: ['Area II', 'AreaII', 'Area2', 'Area 2', 'south east', 'southeast', 'south_east'],
      // METROP. RIO
      3: ['Area III', 'AreaIII', 'Area 3', 'Area3', 'Rio', 'Rio de janeiro', 'Janeiro', 'metopolian region rio', 'metrop rio', 'riodejaneiro', 'rio d janeiro'],
      // METROP. SP
      4: ['Area IV', 'AreaIV', 'Area 4', 'Area4', 'São Paulo', 'SãoPaulo', 'Sao', 'Paulo', 'meropolian region SP', 'SP'],
      // SP COUNTRYSIDE
      5: ['Area V', 'AreaV', 'Area 5', 'Area5', 'Interior of São Paulo', 'Interior SP', 'Countryside SP', 'Country SP'],
      // SOUTH
      6: ['Area VI', 'AreaVI', 'Area 6', 'Area6', 'SOUTH', 'Paraná', 'Santa Catarina', 'Rio Grande do Sul', 'Parana', 'SantaCatarina', 'RioGrande do Sul'],
      // Midwest
      7: ['Area VII', 'AreaVII', 'Area7', 'Area 7', 'Midwst', 'Federal district', 'Federal', 'Central-west', 'Central west', 'west', 'central'],
      // T Brazil
      8: ['Brasil', 'Brazil']
    };

    const lowerCasedQuery = query.toLowerCase();

    return Object
      .keys(dictionary)
      .filter(id => dictionary[id].some(keyWord => lowerCasedQuery.includes(keyWord.toLowerCase())));
  };

  detectMertic = query => {
    const dictionary = {
      penetration: ['penetrate', '%penetration', '%penetr', 'penetration'],
      volumeUnits: [],
      penetrationGrowth: [],

      totatMarketShare: ['marketshare', 'm share', 'mshare'],
      averagePrice: ['volumeshare', 'volume share'],
      marketShareGrowth: ['marketsharegrowth', 'market share growth', 'mshare growth', 'mshare growth', 'msharegrowth'],
      volumeShareGrowth: [],

      averageUnitPrice: [],
      buyers: [],
      value: [],
      priceGrowth: [],

      numericDistributionStock: ['%distribution', 'numericdistr', 'Numeric distr', 'distribution', 'nr distribution', 'nr dist', '% dist'],
      weightedDistributionStock: ['weighted distr', 'weight distr', 'weight distribution'],
      numericDistribution: ['nr out of stock', 'nr stock', 'numeric of stock', 'of stock', '% out of stock'],
      weightedDistribution: ['weighted of stock', 'weight of stock', 'weighted of stock', 'weight stock'],
      popWeightedDistribution: ['promotion', 'weighted pop', 'pop distr', 'pop distribution', 'promotional'],

      beValue: ['BE', 'BE score', 'BEscore', 'equity', 'brand equity'],
      conviction: ['convict', 'conviction', 'conv'],
      presence: ['present', 'presence'],
      relevance: ['relevant', 'relevance', 'relev']
    };

    const lowerCasedQuery = query.toLowerCase();

    return Object
      .keys(dictionary)
      .find(id => dictionary[id].some(keyWord => lowerCasedQuery.includes(keyWord.toLowerCase())));
  };

  getBarChart = () => {
    const {
      parsedAreas,
      parsedApplier,
      parsedBrands,
      parsedGenre,
      parsedPackaging,
      parsedManufacturer,
      parsedMetric
    } = this.state;

    const barChartDataFilters = [
      MANUFACTURER_FILTER,
      BRAND_FILTER,
      AREA_FILTER,
      CHANNEL_FILTER,
      APPLIER_FILTER,
      GENRE_FILTER,
      PACKAGING_FILTER
    ];

    const barChartRequiredFilters = [];

    const manufacturerId = parsedManufacturer
      ? parsedBrands.find(brand => brand.name === parsedManufacturer.name)
        ? null
        : parsedManufacturer.id
      : null;

    const barChartValues = {
      [DATA_FILTERS_CONFIG[BRAND_FILTER].key]: parsedBrands.map(brand => brand.id),
      [DATA_FILTERS_CONFIG[AREA_FILTER].key]: parsedAreas.length ? parsedAreas : [8],
      [DATA_FILTERS_CONFIG[GENRE_FILTER].key]: parsedGenre,
      [DATA_FILTERS_CONFIG[APPLIER_FILTER].key]: parsedApplier,
      [DATA_FILTERS_CONFIG[PACKAGING_FILTER].key]: parsedPackaging,
      [DATA_FILTERS_CONFIG[CHANNEL_FILTER].key]: 1,
      [DATA_FILTERS_CONFIG[MANUFACTURER_FILTER].key]: manufacturerId
    };

    return (
      <PeriodsBarChart
        key={JSON.stringify(barChartValues)}
        dataFilters={barChartDataFilters}
        dataFiltersValues={barChartValues}
        requiredFilters={barChartRequiredFilters}
        chosenMetric={parsedMetric || 'penetration'}
      />
    );
  };

  searchOnSubmit = value => this.setState({
    parsedAreas: this.detectArea(value).map(id => parseInt(id)),
    parsedApplier: this.detectApplier(value),
    parsedBrands: this.detectBrand(value),
    parsedGenre: this.detectGenre(value),
    parsedPackaging: this.detectPackaging(value),
    parsedManufacturer: this.detectManufacturer(value),
    parsedMetric: this.detectMertic(value)
  });

  render() {
    const { parsedBrands, parsedGenre, parsedApplier, parsedPackaging, parsedManufacturer } = this.state;

    const shouldShowResults = parsedBrands.length ||
      parsedManufacturer ||
      parsedGenre ||
      parsedApplier ||
      parsedPackaging;

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
