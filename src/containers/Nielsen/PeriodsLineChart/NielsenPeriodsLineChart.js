// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import {
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer
} from 'recharts';
import _ from 'lodash/fp';
import moment from 'moment';

// import from constants
import { API_BASE_URL } from '../../../constants/api';
import { DATA_FILTERS_CONFIG } from '../../../constants/dataFilters';
import DATA_FILTERS_PROP_TYPES from './dataFiltersPropTypes';
import { colorPalette } from '../../../constants/colors';

// import from components
import DataFilters from '../../../components/DataFilters/DataFilters';

// import from utils
import { mergeObjects } from '../../../utils/object';

const mapStateToProps = state => ({
  metrics: state.metrics,
  nielsenAppliers: state.nielsenAppliers,
  nielsenAreas: state.nielsenAreas,
  nielsenBrands: state.nielsenBrands,
  nielsenChannels: state.nielsenChannels,
  nielsenGenres: state.nielsenGenres,
  nielsenLevels: state.nielsenLevels,
  nielsenManufacturers: state.nielsenManufacturers,
  nielsenPackagings: state.nielsenPackagings,
});

class NielsenPeriodsLineChart extends React.Component {

  static propTypes = mergeObjects(DATA_FILTERS_PROP_TYPES, {
    header: PropTypes.string,
    values: PropTypes.object,
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    requiredFilters: PropTypes.arrayOf(PropTypes.string),
    showMetricsFilters: PropTypes.bool
  });

  static defaultProps = {
    dataFilters: [],
    requiredFilters: [],
    showMetricsFilters: true,
    metric: 'numericDistribution'
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      data: {
        items: [],
        isLoading: false
      }
    };
  }

  componentDidMount() {
    // fetch data using some predefined values.
  }

  fetchData = (values = {}) => {
    const { requiredFilters } = this.props;
    const usefulValues = _.omitBy(
      value => _.isNil(value) || value.length === 0,
      values
    );

    const usefulValuesKeys = Object.keys(usefulValues);
    const requiredFiltersKeys = requiredFilters.map(
      filter => DATA_FILTERS_CONFIG[filter].key
    );

    const shouldFetchData = usefulValuesKeys.length > 0
      && requiredFiltersKeys.every(key => usefulValuesKeys.includes(key));

    if (!shouldFetchData) {
      return;
    }

    const queryString = _.flow([
      _.values,
      _.filter(item => _.keys(usefulValues).includes(item.key)),
      _.reduce(
        (acc, { key, multi }) => [].concat(acc, multi
          ? values[key].map(value => `${key}[]=${value}`)
          : `${key}=${values[key]}`
        ),
        []
      ),
      _.join('&')
    ])(DATA_FILTERS_CONFIG);

    this.setState(
      { data: { items: [], isLoading: false } },
      () => fetch(`${API_BASE_URL}/nielsen/data?${queryString}`)
        .then(response => response.json())
        .then(json => this.setState({ data: { items: json, isLoading: false } }))
    )
  }

  lineChartData = () => {
    const {
      nielsenBrands: { dictionary: brandsDict },
      metric
    } = this.props;
    const { data } = this.state;

    return _.flow([
      _.filter(item => item[metric] && item.date),
      _.groupBy('date'),
      _.entries,
      _.map(([ date, list ]) => list
        .reduce(
        (acc, item) => mergeObjects(acc, { [brandsDict[item.brandId]]: item[metric] }),
        { name: moment(date).format('MMM, YY').toUpperCase() }
      ))
    ])(data.items);
  }

  renderLines = () => {
    const { nielsenBrands: { dictionary: brandsDict } } = this.props;
    const { data: { items } } = this.state;

    const brands = _.flow([
      _.uniqBy('brandId'),
      _.map(item => brandsDict[item.brandId])
    ])(items);

    return brands.map((brandName, i) => (
      <Line
        key={brandName}
        type="monotone"
        dataKey={brandName}
        stroke={colorPalette[i]}
      />
    ))
  }

  render() {
    const {
      nielsenAppliers,
      nielsenAreas,
      nielsenBrands,
      nielsenChannels,
      nielsenGenres,
      nielsenLevels,
      nielsenManufacturers,
      nielsenPackagings,
      header
    } = this.props;

    const { data } = this.state;

    const barChartProps = {
      width: 600,
      height: 450,
      data: this.lineChartData(),
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      barGap: 0
    };

    return (
      <div>
        { !_.isNil(header) && (
          <Grid style={{ marginBottom: '30px' }}>
            <Col xs={12} md={8} mdOffset={2}>
              <h1 className="text-center">{ header }</h1>
            </Col>
          </Grid>
        ) }

        <DataFilters
          values={this.props.values}
          onChange={this.fetchData}
          dataFilters={this.props.dataFilters}
          dataSetName='nielsen'
          nielsenAppliers={nielsenAppliers}
          nielsenAreas={nielsenAreas}
          nielsenBrands={nielsenBrands}
          nielsenChannels={nielsenChannels}
          nielsenGenres={nielsenGenres}
          nielsenLevels={nielsenLevels}
          nielsenManufacturers={nielsenManufacturers}
          nielsenPackagings={nielsenPackagings}
        />

        { !data.isLoading && data.items.length > 0 && (
          <Grid>
            <Col xs={12} md={10} mdOffset={1} style={{ marginBottom: '30px' }}>
              <ResponsiveContainer width='100%' height={450}>
                <RechartsLineChart {...barChartProps}>
                  <XAxis dataKey='name' />
                  <YAxis tickCount={10} />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Tooltip />
                  { this.renderLines() }
                </RechartsLineChart>
              </ResponsiveContainer>
            </Col>
          </Grid>
        ) }
      </div>
    );
  }

}

export default connect(mapStateToProps)(NielsenPeriodsLineChart);
