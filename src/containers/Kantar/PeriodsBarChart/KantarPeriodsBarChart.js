// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import {
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer
} from 'recharts';
import _ from 'lodash/fp';
import moment from 'moment';

// import from constants
import { API_BASE_URL } from '../../../constants/api';
import { DATA_FILTERS_CONFIG, AREA_FILTER } from '../../../constants/dataFilters';
import DATA_FILTERS_PROP_TYPES from './dataFiltersPropTypes';
import { colorPalette } from '../../../constants/colors';

// import from components
import DataFilters from '../../../components/DataFilters/DataFilters';

// import from utils
import { mergeObjects } from '../../../utils/object';

const mapStateToProps = state => ({
  metrics: state.metrics,
  kantarAreas: state.kantarAreas,
  kantarBrands: state.kantarBrands,
  kantarGenres: state.kantarGenres,
  kantarLevels: state.kantarLevels,
  kantarPackagings: state.kantarPackagings
});

class KantarPeriodsBarChart extends React.Component {

  static propTypes = mergeObjects(DATA_FILTERS_PROP_TYPES, {
    values: PropTypes.object,
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    requiredFilters: PropTypes.arrayOf(PropTypes.string),
    showMetricsFilters: PropTypes.bool,
    metric: PropTypes.string,
  });

  static defaultProps = {
    dataFilters: [],
    requiredFilters: [],
    showMetricsFilters: true,
    metric: 'penetration'
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      data: {
        items: [],
        isLoading: false
      },
      dataFiltersValues: {}
    };
  }

  onDataFiltersChange = dataFiltersValues => this.setState(
    { dataFiltersValues },
    () => this.fetchData(this.state.dataFiltersValues)
  );

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

    this.setState(
      { data: { items: [], isLoading: false } },
      () => fetch(`${API_BASE_URL}/kantar/data?${queryString}`)
        .then(response => response.json())
        .then(json => this.setState({ data: { items: json, isLoading: false } }))
    );
  }

  barChartData = () => {
    const {
      kantarBrands: { dictionary: brandsDict },
      kantarAreas: { dictionary: areasDict },
      metric
    } = this.props;
    const { data } = this.state;

    return _.flow([
      _.filter(item => item[metric] && item.date),
      _.groupBy('date'),
      _.entries,
      _.map(([ date, list ]) => list.reduce(
        (acc, item) => mergeObjects(acc, {
          [`${areasDict[item.areaId]}, ${brandsDict[item.brandId]}`]: item[metric]
        }),
        { name: 'Q' + moment(date).format('Q\' YY').toUpperCase() }
      ))
    ])(data.items);
  };

  renderBarStacks = () => {
    const {
      kantarBrands: { dictionary: brandsDict },
      kantarAreas: { dictionary: areasDict },
    } = this.props;
    const { data: { items }, dataFiltersValues } = this.state;

    const areaIds = dataFiltersValues[DATA_FILTERS_CONFIG[AREA_FILTER].key];

    const brands = _.flow([
      _.uniqBy('brandId'),
      _.map(item => brandsDict[item.brandId])
    ])(items);

    return areaIds.reduce((acc, areaId, i) => {
      const areaName = areasDict[areaId];

      return [].concat(
        acc,
        brands.map((brandName, j) => (
          <Bar
            key={`${areaName}-${brandName}`}
            stackId={i + 1}
            fill={colorPalette[j]}
            dataKey={`${areaName}, ${brandName}`}
          />
        ))
      );
    }, []);
  };

  render() {
    const {
      kantarAreas,
      kantarBrands,
      kantarGenres,
      kantarLevels,
      kantarPackagings
    } = this.props;

    const { data } = this.state;

    const barChartProps = {
      width: 600,
      height: 450,
      data: this.barChartData(),
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      barGap: 0
    };

    return (
      <div>
        <DataFilters
          values={this.props.values}
          onChange={this.onDataFiltersChange}
          dataFilters={this.props.dataFilters}
          dataSetName='kantar'
          kantarAreas={kantarAreas}
          kantarBrands={kantarBrands}
          kantarGenres={kantarGenres}
          kantarLevels={kantarLevels}
          kantarPackagings={kantarPackagings}
        />

        { !data.isLoading && data.items.length > 0 && (
          <Grid>
            <Col xs={12} md={10} mdOffset={1} style={{ marginBottom: '30px' }}>
              <ResponsiveContainer width='100%' height={450}>
                <RechartsBarChart {...barChartProps}>
                  <XAxis dataKey='name' />
                  <YAxis tickCount={10} />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Tooltip />
                  { this.renderBarStacks() }
                </RechartsBarChart>
              </ResponsiveContainer>
            </Col>
          </Grid>
        ) }
      </div>
    );
  }

}

export default connect(mapStateToProps)(KantarPeriodsBarChart);
