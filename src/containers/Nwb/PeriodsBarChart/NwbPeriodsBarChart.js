// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
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
import { DATA_FILTERS_CONFIG } from '../../../constants/dataFilters';
import DATA_FILTERS_PROP_TYPES from './dataFiltersPropTypes';
import { colorPalette } from '../../../constants/colors';

// import from components
import DataFilters from '../../../components/DataFilters/DataFilters';
import DatePicker from '../../../components/DatePicker/DatePicker';

// import from utils
import { mergeObjects } from '../../../utils/object';

const mapStateToProps = state => ({
  metrics: state.metrics,
  nwbBrands: state.nwbBrands,
  nwbGenres: state.nwbGenres,
  nwbManufacturers: state.nwbManufacturers,
  nwbSubcategories: state.nwbSubcategories,
});

class NwbPeriodsBarChart extends React.Component {

  static propTypes = mergeObjects(DATA_FILTERS_PROP_TYPES, {
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    dataFiltersValues: PropTypes.object,
    onDataFiltersChange: PropTypes.func.isRequired,
    requiredFilters: PropTypes.arrayOf(PropTypes.string),
    showPeriodFilters: PropTypes.bool,
    metric: PropTypes.string,
  });

  static defaultProps = {
    dataFilters: [],
    dataFiltersValues: {},
    onDataFiltersChange: () => {},
    requiredFilters: [],
    showPeriodFilters: true,
    metric: 'beValue'
  };

  constructor(...args) {
    super(...args);

    this.state = {
      data: {
        items: [],
        isLoading: false
      }
    };
  }

  onDataFiltersChange = values => this.props.onDataFiltersChange(values, this.fetchData);

  onDateChange = (key, value) => this.onDataFiltersChange({ [key]: moment(value).unix() });

  fetchData = (values = {}) => {
    const { requiredFilters, showPeriodFilters } = this.props;

    const usefulValues = _.omitBy(
      value => _.isNil(value) || value.length === 0,
      values
    );

    const usefulValuesKeys = Object.keys(usefulValues);
    const requiredFiltersKeys = requiredFilters.map(
      filter => DATA_FILTERS_CONFIG[filter].key
    );

    const shouldFetchData = usefulValuesKeys.length > 0 &&
      requiredFiltersKeys.every(key => usefulValuesKeys.includes(key));

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
      showPeriodFilters
        ? [...queryStringParts, `periodFrom=${values.periodFrom}`, `periodTo=${values.periodTo}`]
        : queryStringParts
    ).join('&');

    this.setState(
      { data: { items: [], isLoading: true } },
      () => fetch(`${API_BASE_URL}/nwb/data?${queryString}`)
        .then(response => response.json())
        .then(json => this.setState({ data: { items: json, isLoading: false } }))
    );
  }

  barChartData = () => {
    const {
      nwbBrands: { dictionary: brandsDict },
      metric
    } = this.props;
    const { data } = this.state;

    return _.flow([
      _.filter(item => item[metric] && item.date),
      _.groupBy('date'),
      _.entries,
      _.map(([ date, list ]) => list.reduce(
        (acc, item) => mergeObjects(acc, { [brandsDict[item.brandId]]: item[metric] }),
        { name: 'Q' + moment(date).format('Q\' YY').toUpperCase() }
      ))
    ])(data.items);
  };

  renderBarStacks = () => {
    const {
      nwbBrands: { dictionary: brandsDict },
      dataFiltersValues
    } = this.props;
    const { data: { items } } = this.state;

    const brands = _.flow([
      _.uniqBy('brandId'),
      _.map(item => brandsDict[item.brandId])
    ])(items);

    return brands.map((brandName, i) => (
      <Bar
        key={brandName}
        stackId={1}
        dataKey={brandName}
        fill={colorPalette[i]}
      />
    ));
  };

  render() {
    const {
      nwbBrands,
      nwbGenres,
      nwbManufacturers,
      nwbSubcategories,
      showPeriodFilters
    } = this.props;

    const { data } = this.state;

    const barChartProps = {
      width: 600,
      height: 450,
      data: this.barChartData(),
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      barGap: 0
    };

    const datePickerFromSelected = moment.unix(this.props.dataFiltersValues.periodFrom);
    const datePickerToSelected = moment.unix(this.props.dataFiltersValues.periodTo);

    return (
      <div>
        <DataFilters
          values={this.props.dataFiltersValues}
          onChange={this.onDataFiltersChange}
          dataFilters={this.props.dataFilters}
          dataSetName='nwb'
          nwbBrands={nwbBrands}
          nwbGenres={nwbGenres}
          nwbManufacturers={nwbManufacturers}
          nwbSubcategories={nwbSubcategories}
        />

        { showPeriodFilters && (
          <Grid>
            <Col xs={12} md={3} style={{ marginBottom: '30px' }}>
              <FormGroup>
                <ControlLabel>Period from</ControlLabel>
                <DatePicker
                  customInput={<FormControl />}
                  selected={datePickerFromSelected}
                  showYearDropdown
                  showMonthDropdown
                  onChange={this.onDateChange.bind(null, 'periodFrom')}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={3} style={{ marginBottom: '30px' }}>
              <FormGroup>
                <ControlLabel>Period to</ControlLabel>
                <DatePicker
                  customInput={<FormControl />}
                  selected={datePickerToSelected}
                  showYearDropdown
                  showMonthDropdown
                  onChange={this.onDateChange.bind(null, 'periodTo')}
                />
              </FormGroup>
            </Col>
          </Grid>
        ) }

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

export default connect(mapStateToProps)(NwbPeriodsBarChart);