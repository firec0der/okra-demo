// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';
import moment from 'moment';

// import from constants
import { DATA_FILTERS_CONFIG } from '../../constants/dataFilters';
import KANTAR_PROP_TYPES from '../../constants/kantarPropTypes';
import NIELSEN_PROP_TYPES from '../../constants/nielsenPropTypes';
import NWB_PROP_TYPES from '../../constants/nwbPropTypes';

// import from components
import MetricsFilters from '../../components/MetricsFilters/MetricsFilters';
import DataFilters from '../../components/DataFilters/DataFilters';

// import from containers
import NielsenPeriodsBarChart from '../Nielsen/PeriodsBarChart/NielsenPeriodsBarChart';
import KantarPeriodsBarChart from '../Kantar/PeriodsBarChart/KantarPeriodsBarChart';
import NwbPeriodsBarChart from '../Nwb/PeriodsBarChart/NwbPeriodsBarChart';

// import from utils
import { mergeObjects } from '../../utils/object';

const dataSetChartContainerMap = {
  nielsen: NielsenPeriodsBarChart,
  kantar: KantarPeriodsBarChart,
  nwb: NwbPeriodsBarChart,
};

class PeriodsBarChart extends React.Component {

  static propTypes = mergeObjects(KANTAR_PROP_TYPES, NIELSEN_PROP_TYPES, NWB_PROP_TYPES, {
    header: PropTypes.string,
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    dataFiltersValues: PropTypes.object,
    requiredFilters: PropTypes.arrayOf(PropTypes.string),

    chosenMetric: PropTypes.string,
    shouldShowMetrics: PropTypes.bool,
    showPeriodFilters: PropTypes.bool,
  });

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
      barChartContainer: null,
      dataFiltersValues
    };
  }

  componentDidMount() {
    const dataSetName = this.getDataSetName(this.state.chosenMetric);
    this.setState({ barChartContainer: dataSetChartContainerMap[dataSetName] });
  }

  onMetricFilterChange = chosenMetric => {
    const previousDataSetName = this.getDataSetName(this.state.chosenMetric);
    const nextDataSetName = this.getDataSetName(chosenMetric);

    this.setState(
      mergeObjects(
        { chosenMetric },
        nextDataSetName !== previousDataSetName
          ? { barChartContainer: dataSetChartContainerMap[nextDataSetName] }
          : {}
      )
    );
  }

  onDataFiltersChange = (values, callback = () => {}) => this.setState(
    { dataFiltersValues: mergeObjects(this.state.dataFiltersValues, values) },
    () => callback(this.state.dataFiltersValues)
  );

  getDataSetName = chosenMetric => {
    const { metrics } = this.props;

    const metricObject = _.flow([
      _.reduce((acc, { items }) => [...acc, ...items], []),
      _.find(object => object.value === chosenMetric)
    ])(metrics.list);

    if (_.isEmpty(metricObject)) { return null; }

    return metricObject.dataset || null;
  }

  renderDataFilters() {
    const { chosenMetric } = this.state;

    const dataSetName = this.getDataSetName(chosenMetric);

    const propsForDataSet = {
      kantar: [
        'kantarAreas',
        'kantarBrands',
        'kantarGenres',
        'kantarLevels',
        'kantarManufacturers',
        'kantarPackagings',
        'kantarSubcategories'
      ],
      nielsen: [
        'nielsenAppliers',
        'nielsenAreas',
        'nielsenBrands',
        'nielsenChannels',
        'nielsenGenres',
        'nielsenLevels',
        'nielsenManufacturers',
        'nielsenPackagings',
        'nielsenSubcategories'
      ],
      nwb: [
        'nwbBrands',
        'nwbGenres',
        'nwbManufacturers',
        'nwbSubcategories'
      ]
    };

    const props = propsForDataSet[dataSetName]
      .reduce((acc, propKey) => mergeObjects(acc, { [propKey]: this.props[propKey] }), {});

    return (
      <DataFilters
        values={this.props.dataFiltersValues}
        onChange={this.onDataFiltersChange}
        dataFilters={this.props.dataFilters}
        dataSetName={dataSetName}
        usePeriodFilters
        {...props}
      />
    )
  }

  render() {
    const { metrics, header } = this.props;
    const { chosenMetric, barChartContainer: BarChartContainer } = this.state;

    const shouldShowMetrics = !metrics.list.isLoading && metrics.list.length;

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

        <div>
          { this.renderDataFilters() }
        </div>

        <div style={{ height: '300px' }}>
          { !_.isNil(BarChartContainer) && (
            <BarChartContainer
              metric={chosenMetric}
              datasetName={this.getDataSetName(chosenMetric)}
              dataFilters={this.props.dataFilters}
              dataFiltersValues={this.state.dataFiltersValues}
              requiredFilters={this.props.requiredFilters}
              onDataFiltersChange={this.onDataFiltersChange}
              showPeriodFilters
            />
          ) }
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  metrics: state.metrics,

  kantarAreas: state.kantarAreas,
  kantarBrands: state.kantarBrands,
  kantarGenres: state.kantarGenres,
  kantarLevels: state.kantarLevels,
  kantarManufacturers: state.kantarManufacturers,
  kantarPackagings: state.kantarPackagings,
  kantarSubcategories: state.kantarSubcategories,

  nielsenAppliers: state.nielsenAppliers,
  nielsenAreas: state.nielsenAreas,
  nielsenBrands: state.nielsenBrands,
  nielsenChannels: state.nielsenChannels,
  nielsenGenres: state.nielsenGenres,
  nielsenLevels: state.nielsenLevels,
  nielsenManufacturers: state.nielsenManufacturers,
  nielsenPackagings: state.nielsenPackagings,
  nielsenSubcategories: state.nielsenSubcategories,

  nwbBrands: state.nwbBrands,
  nwbGenres: state.nwbGenres,
  nwbManufacturers: state.nwbManufacturers,
  nwbSubcategories: state.nwbSubcategories,
});

export default connect(mapStateToProps)(PeriodsBarChart);
