// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';
import moment from 'moment';

// import from constants
import { DATA_FILTERS_CONFIG } from '../../constants/dataFilters';

// import from components
import MetricsFilters from '../../components/MetricsFilters/MetricsFilters';

// import from containers
import NielsenPeriodsLineChart from '../Nielsen/PeriodsLineChart/NielsenPeriodsLineChart';
import KantarPeriodsLineChart from '../Kantar/PeriodsLineChart/KantarPeriodsLineChart';
import NwbPeriodsLineChart from '../Nwb/PeriodsLineChart/NwbPeriodsLineChart';

// import from utils
import { mergeObjects } from '../../utils/object';

const dataSetChartContainerMap = {
  nielsen: NielsenPeriodsLineChart,
  kantar: KantarPeriodsLineChart,
  nwb: NwbPeriodsLineChart
};

class PeriodsLineChart extends React.Component {

  static propTypes = {
    header: PropTypes.string,
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    dataFiltersValues: PropTypes.object,
    requiredFilters: PropTypes.arrayOf(PropTypes.string),

    chosenMetric: PropTypes.string,
    shouldShowMetrics: PropTypes.bool,
    showPeriodFilters: PropTypes.bool,
  };

  static defaultProps = {
    dataFilters: Object.keys(DATA_FILTERS_CONFIG),
    dataFiltersValues: {},
    requiredFilters: [],
    chosenMetric: 'numericDistribution',
    shouldShowMetrics: true,
    showPeriodFilters: true
  };

  constructor(props, ...args) {
    super(props, ...args);

    const dataFiltersValues = mergeObjects(
      props.dataFiltersValues,
      props.showPeriodFilters
        ? { periodFrom: moment(2016, 'YYYY').unix(), periodTo: moment().unix() }
        : {}
    );

    this.state = {
      chosenMetric: props.chosenMetric,
      dataFiltersValues
    };
  }

  onMetricFilterChange = chosenMetric => this.setState({ chosenMetric });

  onDataFiltersChange = (values, callback = () => {}) => {
    console.log(values);
    this.setState(
      { dataFiltersValues: mergeObjects(this.state.dataFiltersValues, values) },
      () => callback(this.state.dataFiltersValues)
    );
  }

  getDataSetName = () => {
    const { metrics } = this.props;
    const { chosenMetric } = this.state;

    const metricObject = _.flow([
      _.reduce((acc, { items }) => [...acc, ...items], []),
      _.find(object => object.value === chosenMetric)
    ])(metrics.list);

    if (_.isEmpty(metricObject)) { return null; }

    return metricObject.dataset || null;
  }

  render() {
    const { metrics, header } = this.props;
    const { chosenMetric, dataFiltersValues } = this.state;

    const shouldShowMetrics = !metrics.list.isLoading && metrics.list.length;

    const dataSetName = this.getDataSetName();

    const LineChartContainer = dataSetChartContainerMap[dataSetName];

    return (
      <div>
        { !_.isNil(header) && (
          <Grid style={{ marginBottom: '30px' }}>
            <Col xs={12} md={8} mdOffset={2}>
              <h1 className='text-center'>{ header }</h1>
            </Col>
          </Grid>
        ) }

        { shouldShowMetrics && (
          <Grid style={{ marginBottom: '30px' }}>
            <Col xs={12} md={8} mdOffset={2}>
              <MetricsFilters
                metrics={metrics.list}
                selectedValue={chosenMetric}
                onChange={this.onMetricFilterChange}
              />
            </Col>
          </Grid>
        ) }

        { !_.isNil(LineChartContainer) && (
          <LineChartContainer
            metric={chosenMetric}
            datasetName={dataSetName}
            dataFilters={this.props.dataFilters}
            dataFiltersValues={this.state.dataFiltersValues}
            requiredFilters={this.props.requiredFilters}
            onDataFiltersChange={this.onDataFiltersChange}
            showPeriodFilters
          />
        ) }
      </div>
    );
  }

}

export default connect(
  ({ metrics }) => ({ metrics })
)(PeriodsLineChart);
