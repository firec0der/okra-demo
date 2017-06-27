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
import KANTAR_PROP_TYPES from '../../../constants/kantarPropTypes';
import { colorPalette } from '../../../constants/colors';

// import from utils
import { mergeObjects } from '../../../utils/object';

const mapStateToProps = state => ({
  metrics: state.metrics,
  kantarAreas: state.kantarAreas,
  kantarBrands: state.kantarBrands,
});

class KantarPeriodsBarChart extends React.Component {

  static propTypes = mergeObjects(KANTAR_PROP_TYPES, {
    usePeriodFilters: PropTypes.bool,
    dataFiltersValues: PropTypes.object,
    metric: PropTypes.string,
  });

  static defaultProps = {
    usePeriodFilters: true,
    dataFiltersValues: {},
    metric: 'penetration'
  };

  constructor(...args) {
    super(...args);

    this.state = { data: { items: [], isLoading: false } };
  }

  componentDidMount() {
    this.fetchData(this.props.dataFiltersValues);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.dataFiltersValues, this.props.dataFiltersValues)) {
      this.fetchData(nextProps.dataFiltersValues);
    }
  }

  fetchData = (values = {}) => {
    const usefulValues = _.omitBy(
      value => _.isNil(value) || value.length === 0,
      values
    );

    const usefulValuesKeys = Object.keys(usefulValues);

    const shouldFetchData = usefulValuesKeys.length > 0;

    if (!shouldFetchData) {
      return;
    }

    const queryStringParts = _.flow([
      _.values,
      _.filter(filter => _.keys(usefulValues).includes(filter.key)),
      _.reduce(
        (acc, { key, multi }) => [].concat(acc, multi
          ? values[key].map(value => `${key}[]=${value}`)
          : `${key}=${values[key]}`
        ),
        []
      ),
    ])(DATA_FILTERS_CONFIG);

    const queryString = (
      this.props.usePeriodFilters
        ? [...queryStringParts, `periodFrom=${values.periodFrom}`, `periodTo=${values.periodTo}`]
        : queryStringParts
    ).join('&');

    this.setState(
      { data: { items: [], isLoading: true } },
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
    ])(this.state.data.items);
  };

  renderBarStacks = () => {
    const {
      kantarBrands: { dictionary: brandsDict },
      kantarAreas: { dictionary: areasDict },
      dataFiltersValues
    } = this.props;

    const areaIds = dataFiltersValues[DATA_FILTERS_CONFIG[AREA_FILTER].key];

    const brands = _.flow([
      _.uniqBy('brandId'),
      _.map(item => brandsDict[item.brandId])
    ])(this.state.data.items);

    return areaIds.reduce((acc, areaId, i) => {
      const areaName = areasDict[areaId];

      return [].concat(
        acc,
        brands.map((brandName, j) => (
          <Bar
            key={`${areaName}-${brandName}`}
            stackId={i + 1}
            fill={colorPalette[j + 14]}
            dataKey={`${areaName}, ${brandName}`}
          />
        ))
      );
    }, []);
  };

  render() {
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
        { !data.isLoading && data.items.length > 0 && (
          <Grid>
            <Col xs={12} md={8} mdOffset={2} style={{ marginBottom: '30px', backgroundColor: '#fff' }}>
              <ResponsiveContainer width='100%' height={300}>
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
