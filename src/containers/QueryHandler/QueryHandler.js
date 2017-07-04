// import from vendors
import React from 'react';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import moment from 'moment';
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
import { API_BASE_URL } from '../../constants/api';

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

const actionKeyWords = {
  positive: [
    'gaining', 'gain', 'gains', 'gained', 'increasing', 'increase', 'increases', 'increased',
    'high', 'higher', 'grow', 'growing', 'grower', 'better', 'improve', 'improved', 'gain', 'gained',
    'rise', 'upgrade', 'maximised', 'raise', 'rise', 'raised', 'extended', 'increment', 'build up'
  ],
  negative: [
    'loosing', 'lose', 'loses', 'lost', 'decreasing', 'decrease', 'decreases', 'decreased',
    'worse', 'declined', 'decline', 'declines', 'declining', 'reduce', 'reducing', 'reduces', 'reduction', 'reduced',
    'worsen', 'lower', 'low', 'dropped', 'diminished', 'diminish', 'drop', 'drops', 'deplete'
  ]
};

class QueryHandler extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      query: '',
      parsedAreas: [],
      parsedBrands: [],
      parsedGenre: null,
      parsedApplier: null,
      parsedPackaging: null,
      parsedManufacturers: null,
      parsedMetric: null,
      isWhyQuery: false,
      kantarData: [],
      nielsenData: [],
      nwbData: [],
      dataIsLoading: false,
      dataIsLoaded: false
    };
  }

  componentDidUpdate() {
    const {
      isWhyQuery,
      parsedAreas,
      parsedBrands,
      parsedGenre,
      parsedApplier,
      parsedPackaging,
      parsedManufacturer,
      kantarData,
      nielsenData,
      nwbData,
      dataIsLoading,
      dataIsLoaded
    } = this.state;

    const manufacturerId = parsedManufacturer
      ? parsedBrands.find(brand => brand.name === parsedManufacturer.name)
        ? null
        : parsedManufacturer.id
      : null;

    const values = {
      [DATA_FILTERS_CONFIG[BRAND_FILTER].key]: parsedBrands.map(brand => brand.id),
      [DATA_FILTERS_CONFIG[AREA_FILTER].key]: parsedAreas.length ? parsedAreas : [8],
      [DATA_FILTERS_CONFIG[CHANNEL_FILTER].key]: 1,
    };

    if (isWhyQuery && !dataIsLoaded && !dataIsLoading) {
      this.setState(
        { dataIsLoading: true },
        () => this.fetchData(values, 'kantar')
          .then(() => this.fetchData(values, 'nielsen'))
          .then(() => this.fetchData(values, 'nwb'))
          .then(() => this.setState({ dataIsLoading: false, dataIsLoaded: true }))
      );
    }
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
      7: ['Area I', 'AreaI', 'Area1', 'Area 1', 'North', 'North East', 'northeast', 'northeastern', 'ceara', 'rio grande do norte', 'paraiba', 'Pernambuco', 'Alagoas', 'Bahia', 'Sergipe', 'Piaui', 'Maranhao'],
      // EAST
      1: ['Area II', 'AreaII', 'Area2', 'Area 2', 'south east', 'southeast', 'south_east'],
      // METROP. RIO
      2: ['Area III', 'AreaIII', 'Area 3', 'Area3', 'Rio', 'Rio de janeiro', 'Janeiro', 'metopolian region rio', 'metrop rio', 'riodejaneiro', 'rio d janeiro'],
      // METROP. SP
      3: ['Area IV', 'AreaIV', 'Area 4', 'Area4', 'São Paulo', 'SãoPaulo', 'Sao', 'Paulo', 'meropolian region SP', 'SP'],
      // SP COUNTRYSIDE
      4: ['Area V', 'AreaV', 'Area 5', 'Area5', 'Interior of São Paulo', 'Interior SP', 'Countryside SP', 'Country SP'],
      // SOUTH
      5: ['Area VI', 'AreaVI', 'Area 6', 'Area6', 'SOUTH', 'Paraná', 'Santa Catarina', 'Rio Grande do Sul', 'Parana', 'SantaCatarina', 'RioGrande do Sul'],
      // Midwest
      6: ['Area VII', 'AreaVII', 'Area7', 'Area 7', 'Midwst', 'Federal district', 'Federal', 'Central-west', 'Central west', 'west', 'central'],
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

      totatMarketShare: ['marketshare', 'm share', 'mshare', 'market share'],
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

  isWhyQuery = query => {
    const lowerCasedQuery = query.toLowerCase();

    const keyWords = _.flow([
      _.entries,
      _.reduce((acc, [ name, list ]) => [...acc, ...list], [])
    ])(actionKeyWords);

    return _.startsWith('why', lowerCasedQuery) &&
      keyWords.some(keyWord => lowerCasedQuery.includes(keyWord));
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
        chosenMetric={parsedMetric || 'totatMarketShare'}
      />
    );
  };

  searchOnSubmit = query => this.setState({
    query,
    parsedAreas: this.detectArea(query).map(id => parseInt(id)),
    parsedApplier: this.detectApplier(query),
    parsedBrands: this.detectBrand(query),
    parsedGenre: this.detectGenre(query),
    parsedPackaging: this.detectPackaging(query),
    parsedManufacturer: this.detectManufacturer(query),
    parsedMetric: this.detectMertic(query),
    isWhyQuery: this.isWhyQuery(query),
    kantarData: [],
    nielsenData: [],
    nwbData: [],
    dataIsLoading: false,
    dataIsLoaded: false
  });

  fetchData = (values = {}, dataSetName = 'kantar') => {
    const usefulValues = _.omitBy(
      value => _.isNil(value) || value.length === 0,
      values
    );

    const usefulValuesKeys = Object.keys(usefulValues);

    const shouldFetchData = usefulValuesKeys.length > 0;

    if (!shouldFetchData) {
      return;
    }

    const queryString = _.flow([
      _.values,
      _.filter(filter => _.keys(usefulValues).includes(filter.key)),
      _.reduce(
        (acc, { key, multi }) => [].concat(acc, multi
          ? values[key].map(value => `${key}[]=${value}`)
          : `${key}=${values[key]}`
        ),
        []
      ),
      _.join('&')
    ])(DATA_FILTERS_CONFIG);

    return new Promise((resolve, reject) => fetch(`${API_BASE_URL}/${dataSetName}/data?${queryString}`)
      .then(response => response.json())
      .then(json => {
        this.setState({ [`${dataSetName}Data`]: json })
        return resolve();
      })
    );
  }

  renderAnswers = () => {
    const { query, parsedBrands } = this.state;
    const { brands } = this.props;

    const getItems = amount => _.flow([
      _.filter(item => moment(item.date).unix() < moment('2017', 'YYYY').unix()),
      _.sortBy(item => moment(item.date).unix()),
      _.groupBy('brandId'),
      _.entries,
      _.reduce((acc, [ brandId, list ]) => mergeObjects(acc, { [brandId]: _.takeRight(amount, list) }), {})
    ]);

    const nielsenData = getItems(6)(this.state.nielsenData);
    const kantarData = getItems(3)(this.state.kantarData);
    const nwbData = getItems(6)(this.state.nwbData);

    const action = _.findKey(
      list => list.some(keyWord => query.toLowerCase().includes(keyWord)),
      actionKeyWords
    );

    const isPositive = action === 'positive';

    const isGood = value => action === 'positive'
      ? value > 0
      : value <= 0;

    const brandIds = parsedBrands.map(item => item.id);

    const messages = brandIds.reduce((acc, brandId) => mergeObjects(acc, { [brandId]: [] }), {});

    // Reason 1.1
    brandIds.forEach(brandId => {
      const value = _.meanBy('numericDistributionGrowth', nielsenData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 1.1: ' +
          `% of stores that sells ${brandName} ` +
          `has increased by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 1.1: ' +
          `% of stores that sells ${brandName} ` +
          `has decreased by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 1.2
    brandIds.forEach(brandId => {
      const value = _.meanBy('weightedDistributionGrowth', nielsenData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 1.2: ' +
          `% of quality stores that sells ${brandName} ` +
          `has increased by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 1.2: ' +
          `% of quality stores that sells ${brandName} ` +
          `has decreased by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 2.1
    brandIds.forEach(brandId => {
      const value = _.meanBy('popGrowth', nielsenData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 2.1: ' +
          `Increased promotional and advertising activity within ` +
          `the retail stores by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 2.1: ' +
          `Decreased promotional and advertising activity within ` +
          `the retail stores by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 2.2
    brandIds.forEach(brandId => {
      const value = _.meanBy('popWeightedDistribution', nielsenData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 2.2: ' +
          `Increased promotional and advertising activity within ` +
          `the quality stores by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 2.2: ' +
          `Decreased promotional and advertising activity within ` +
          `the quality stores by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 3.1
    brandIds.forEach(brandId => {
      const value = _.meanBy('numericOutOfStockGrowth', nielsenData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      // increasing - bad
      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 3.1: ' +
          `Increased out of stock distribution within the retail stores by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      // decreased - good
      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 3.1: ' +
          `Decreased out of stock distribution within the retail stores by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 3.2
    brandIds.forEach(brandId => {
      const value = _.meanBy('weightedOutOfStockGrowth', nielsenData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      // increasing - bad
      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 3.1: ' +
          `Increased out of stock distribution within the quality retail stores by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      // decreased - good
      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 3.1: ' +
          `Decreased out of stock distribution within the quality retail stores by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 4
    brandIds.forEach(brandId => {
      const value = _.meanBy('priceGrowth', kantarData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      // increasing - good
      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 4: ' +
          `The price of ${brandName} increased by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      // decreasing - bad
      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 4: ' +
          `The price of ${brandName} decreased by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 5
    brandIds.forEach(brandId => {
      const value = _.meanBy('penetrationGrowth', kantarData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 5: ' +
          `The penetration of ${brandName} increased by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 5: ' +
          `The penetration of ${brandName} decreased by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 6.1
    brandIds.forEach(brandId => {
      const value = _.meanBy('convictionGrowth', nwbData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 6.1: ' +
          `The conviction about ${brandName} increased by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 6.1: ' +
          `The conviction about ${brandName} decreased by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 6.2
    brandIds.forEach(brandId => {
      const value = _.meanBy('presenceGrowth', nwbData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 6.2: ' +
          `The presence about ${brandName} increased by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 6.2: ' +
          `The presence about ${brandName} decreased by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    // Reason 6.3
    brandIds.forEach(brandId => {
      const value = _.meanBy('relevanceGrowth', nwbData[brandId]);
      const brandName = _.getOr(null, 'name', brands.list.find(brand => brand.id === brandId));

      if (!_.isNumber(value) || !brandName) { return; }

      if (isPositive && value > 0) {
        messages[brandId].push(
          'Reason 6.3: ' +
          `The relevance about ${brandName} increased by ${Math.abs(value.toFixed(3))}%.`
        );
      }

      if (!isPositive && value < 0) {
        messages[brandId].push(
          'Reason 6.3: ' +
          `The relevance about ${brandName} decreased by ${Math.abs(value.toFixed(3))}%.`
        );
      }
    });

    return _.flow([
      _.entries,
      _.filter(([ brandId, messages ]) => messages.length),
      _.map(([ brandId, messages ]) => (
        <div key={brandId}>
          <p>{ brands.list.find(brand => brand.id === parseInt(brandId)).name }</p>
          <ul>{ messages.map((message, i) => (<li key={i}>{ message }</li>)) }</ul>
        </div>
      ))
    ])(messages);
  }

  render() {
    const {
      isWhyQuery,
      parsedBrands,
      parsedGenre,
      parsedApplier,
      parsedPackaging,
      parsedManufacturer,
      dataIsLoaded
    } = this.state;

    const shouldShowResults = parsedBrands.length ||
      parsedManufacturer ||
      parsedGenre ||
      parsedApplier ||
      parsedPackaging;

    const shouldHideLogos = shouldShowResults || isWhyQuery;

    return (
      <div className='query-handler'>
        <Grid>
          <Col xs={12} md={6} mdOffset={3}>
            <SearchBar onSubmit={this.searchOnSubmit} />
          </Col>
        </Grid>

        <div className='result-body'>
          { !shouldHideLogos && <BrandLogos /> }
          { shouldShowResults && !isWhyQuery && this.getBarChart() }
          { isWhyQuery && dataIsLoaded && (
            <Grid>
              <Col xs={12} md={6} mdOffset={3}>
                <div>
                  { this.renderAnswers() }
                </div>
              </Col>
            </Grid>
          ) }
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(QueryHandler);
