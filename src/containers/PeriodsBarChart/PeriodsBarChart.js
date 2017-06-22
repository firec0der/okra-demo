// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from constants
import { DATA_FILTERS_CONFIG } from '../../constants/dataFilters';

// import from components
import MetricsFilters from '../../components/MetricsFilters/MetricsFilters';

// import from containers
import NielsenPeriodsBarChart from '../Nielsen/PeriodsBarChart/NielsenPeriodsBarChart';
import KantarPeriodsBarChart from '../Kantar/PeriodsBarChart/KantarPeriodsBarChart';
import NwbPeriodsBarChart from '../Nwb/PeriodsBarChart/NwbPeriodsBarChart';

// import from utils
import { mergeObjects } from '../../utils/object';

const dataSetChartContainerMap = {
  nielsen: NielsenPeriodsBarChart,
  kantar: KantarPeriodsBarChart,
  nwb: NwbPeriodsBarChart
};

class PeriodsBarChart extends React.Component {

  static propTypes = {
    header: PropTypes.string,
    values: PropTypes.object,
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    requiredFilters: PropTypes.arrayOf(PropTypes.string),
    chosenMetric: PropTypes.string
  };

  static defaultProps = {
    dataFilters: Object.keys(DATA_FILTERS_CONFIG),
    requiredFilters: [],
    chosenMetric: 'numericDistribution'
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = { chosenMetric: props.chosenMetric };
  }

  onMetricFilterChange = chosenMetric => {
    this.setState({ chosenMetric });
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
    const { chosenMetric } = this.state;

    const shouldShowMetrics = !metrics.list.isLoading && metrics.list.length;

    const dataSetName = this.getDataSetName();

    const BarChartContainer = dataSetChartContainerMap[dataSetName];

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

        { !_.isNil(BarChartContainer) && (
          <BarChartContainer
            metric={chosenMetric}
            datasetName={dataSetName}
            dataFilters={this.props.dataFilters}
            values={this.props.values}
            showPeriodFilters
          />
        ) }
      </div>
    );
  }

}

export default connect(
  ({ metrics }) => ({ metrics })
)(PeriodsBarChart);
