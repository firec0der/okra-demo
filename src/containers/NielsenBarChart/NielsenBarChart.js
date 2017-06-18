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
import DataFilter from '../../components/DataFilter/DataFilter';
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
    level: PropTypes.string,
    levelsToShow: PropTypes.arrayOf(PropTypes.string),
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    showMetricsFilters: PropTypes.bool
  });

  static defaultProps = {
    level: 'Brand',
    levelsToShow: ['Brand', 'Genre', 'Packaging', 'Appliers'],
    dataFilters: Object.keys(NIELSEN_DATA_FILTERS),
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

  initialDataFiltersValue = () => {
    const { dataFilters, level } = this.props;

    return _.flow([
      _.filter(filter => Object.keys(NIELSEN_DATA_FILTERS).includes(filter)),
      _.reduce((acc, filter) => mergeObjects(acc, {
        [NIELSEN_DATA_FILTERS[filter].stateKey]: NIELSEN_DATA_FILTERS[filter].multi ? [] : null
      }), {})
    ])(dataFilters);
  }

  fetchData = (values = {}) => {
    const usefulValues = _.omitBy(
      value => _.isNil(value) || value.length === 0,
      values
    );

    const queryString = _.flow([
      _.values,
      _.filter(item => _.keys(usefulValues).includes(item.stateKey)),
      _.reduce(
        (acc, { stateKey, multi }) => [].concat(acc, multi
          ? values[stateKey].map(value => `${stateKey}[]=${value}`)
          : `${stateKey}=${values[stateKey]}`
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
    const { nielsenBrands, nielsenAreas } = this.props;
    const { chosenMetric, data } = this.state;

    const objectsThatHaveMetric = data.list.filter(object => object[chosenMetric]);

    const dataRaw = _.flow([
      _.groupBy('brandId'),
      _.entries,
      _.map(([ brandId, list ]) => list.reduce(
        (acc, object) => mergeObjects(acc, {
          values: [
            ...acc.values,
            {
              areaId: object.areaId,
              year: object.year,
              quarter: object.quarter,
              value: object[chosenMetric]
            }
          ]
        }),
        { name: nielsenBrands.table[brandId], values: [] }
      ))
    ])(objectsThatHaveMetric);

    const chartData = dataRaw.map(list => mergeObjects(
      { name: list.name },
      list.values.reduce(
        (acc, item) => mergeObjects(acc, {
          [`${nielsenAreas.table[item.areaId]}, Q${item.quarter}/${item.year}`]: item.value
        }),
        {}
      )
    ));

    return chartData;
  }

  barChartStacks = () => {
    const { nielsenAreas } = this.props;
    const { dataFilters, data } = this.state;

    const years = _.uniq(nielsenData.list.map(item => item.year)).sort();
    const quarters = _.uniq(nielsenData.list.map(item => item.quarter)).sort();

    return years
      // collect all possible periods for the current data
      .reduce((acc, year) => [
        ...acc,
        ...(quarters.map(quarter => `Q${quarter}/${year}`))
      ], [])
      // collect stacks [ [ 'data item for period 1', 'data item for period 2'] ]
      .map(period => dataFilters.areaIds.map(
        areaId => `${nielsenAreas.table[areaId]}, ${period}`
      ));
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
      levelsToShow
    } = this.props;

    const { chosenMetric, data } = this.state;

    const searchOnSubmit = (value) => window.alert(`It works, value: ${value}`);

    const metrics = this.getMetrics();
    const shouldShowMetrics = this.props.showMetricsFilters
      && !this.props.isLoading
      && metrics.length;

    return (
      <div>
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

        { !data.isLoading && data.length > 0 && (
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
