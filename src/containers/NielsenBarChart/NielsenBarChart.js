// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from constants
import { API_BASE_URL } from '../../constants/api';
import {
  NIELSEN_LEVEL_FILTER,
  NIELSEN_MANUFACTURER_FILTER,
  NIELSEN_CHANNEL_FILTER,
  NIELSEN_AREA_FILTER,
  NIELSEN_BRAND_FILTER,
  NIELSEN_APPLIER_FILTER,
  NIELSEN_GENRE_FILTER,
  NIELSEN_PACKAGING_FILTER,
  NIELSEN_DATA_FILTERS
} from '../../constants/nielsenDataFilters';
import DATA_FILTERS_PROP_TYPES from './dataFiltersPropTypes';

// import from components
import StackedBarChart from '../../components/StackedBarChart/StackedBarChart';
import MetricsFilters from '../../components/MetricsFilters/MetricsFilters';
import DataFilters from './DataFilters';

// import from utils
import { mergeObjects } from '../../utils/object';

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

class NielsenBarChart extends React.Component {

  static propTypes = mergeObjects(DATA_FILTERS_PROP_TYPES, {
    header: PropTypes.string,
    values: PropTypes.object,
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    requiredFilters: PropTypes.arrayOf(PropTypes.string),
    showMetricsFilters: PropTypes.bool
  });

  static defaultProps = {
    dataFilters: Object.keys(NIELSEN_DATA_FILTERS),
    requiredFilters: [NIELSEN_AREA_FILTER, NIELSEN_BRAND_FILTER],
    showMetricsFilters: true
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      data: {
        items: [],
        isLoading: false
      },
      chosenMetric: 'numericDistribution'
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
      filter => NIELSEN_DATA_FILTERS[filter].key
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
    ])(NIELSEN_DATA_FILTERS);

    this.setState(
      { data: { items: [], isLoading: false } },
      () => fetch(`${API_BASE_URL}/nielsen/data?${queryString}`)
        .then(response => response.json())
        .then(json => this.setState({ data: { items: json, isLoading: false } }))
    )
  }

  onMetricFilterChange = chosenMetric => this.setState({ chosenMetric });

  barChartData = () => {
    const {
      nielsenBrands: { dictionary: brandsDict },
      nielsenAreas: { dictionary: areasDict }
    } = this.props;
    const { chosenMetric, data } = this.state;

    const dataRaw = _.flow([
      _.filter(item => item[chosenMetric] && item.date),
      _.groupBy('brandId'),
      _.entries,
      _.map(([ brandId, list ]) => list
        .reduce(
        (acc, item) => mergeObjects(acc, {
          values: [...acc.values, { areaId: item.areaId, value: item[chosenMetric], date: item.date }]
        }),
        { name: brandsDict[brandId], values: [] }
      ))
    ])(data.items);

    const chartData = dataRaw.map(list => mergeObjects(
      { name: list.name },
      list.values.reduce(
        (acc, item) => {
          const [year, month] = item.date.split('-');

          return mergeObjects(acc, {
            [`${areasDict[item.areaId]}, ${month}/${year}`]: item.value
          })
        },
        {}
      )
    ));

    return chartData;
  }

  barChartStacks = () => {
    const { nielsenAreas: { dictionary: areasDict } } = this.props;
    const { dataFilters, data: { items } } = this.state;

    const periods = _.flow([
      _.map(item => {
        const [year, month] = item.date.split('-');
        return `${month}/${year}`;
      }),
      _.uniq,
      items => items.sort()
    ])(items);

    const areas = _.flow([
      _.map(item => item.areaId),
      _.uniq,
      _.map(areaId => areasDict[areaId])
    ])(items);

    // collect stacks [ [ 'data item for period 1', 'data item for period 2'] ]
    return periods.map(period => areas.map(area => `${area}, ${period}`));
  }

  getMetrics = () => _.flow([
    _.filter(({ items }) => items.some(item => item.dataset === 'nielsen')),
    _.map(group => mergeObjects(group, {
      items: group.items.filter(item => item.dataset === 'nielsen')
    }))
  ])(this.props.metrics.list);

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

    const { chosenMetric, data } = this.state;

    const searchOnSubmit = (value) => window.alert(`It works, value: ${value}`);

    const metrics = this.getMetrics();
    const shouldShowMetrics = this.props.showMetricsFilters
      && !this.props.isLoading
      && metrics.length;

    return (
      <div>
        { !_.isNil(header) && (
          <Grid style={{ marginBottom: '30px' }}>
            <Col xs={12} md={8} mdOffset={2}>
              <h1 className="text-center">{ header }</h1>
            </Col>
          </Grid>
        ) }

        { shouldShowMetrics && (
          <Grid style={{ marginBottom: '30px' }}>
            <Col xs={12} md={8} mdOffset={2}>
              <MetricsFilters
                metrics={metrics}
                onChange={this.onMetricFilterChange}
                selectedValue={chosenMetric}
              />
            </Col>
          </Grid>
        ) }

        <DataFilters
          values={this.props.values}
          onChange={this.fetchData}
          dataFilters={this.props.dataFilters}
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
              <StackedBarChart
                chartHeight={450}
                data={this.barChartData()}
                stacks={this.barChartStacks()}
              />
            </Col>
          </Grid>
        ) }
      </div>
    );
  }

}

export default connect(mapStateToProps)(NielsenBarChart);
