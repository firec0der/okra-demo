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
import { DATA_FILTERS_CONFIG, AREA_FILTER } from '../../../constants/dataFilters';
import DATA_FILTERS_PROP_TYPES from './dataFiltersPropTypes';
import { colorPalette } from '../../../constants/colors';

// import from components
import DataFilters from '../../../components/DataFilters/DataFilters';
import DatePicker from '../../../components/DatePicker/DatePicker';

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
  nielsenSubcategories: state.nielsenSubcategories,
});

class NielsenPeriodsBarChart extends React.Component {

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
    metric: 'numericDistribution'
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

    const shouldFetchData = usefulValuesKeys.length > 0
      && requiredFiltersKeys.every(key => usefulValuesKeys.includes(key));

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
      )
    ])(DATA_FILTERS_CONFIG);

    const queryString = (
      showPeriodFilters
        ? [...queryStringParts, `periodFrom=${values.periodFrom}`, `periodTo=${values.periodTo}`]
        : queryStringParts
    ).join('&');

    this.setState(
      { data: { items: [], isLoading: false } },
      () => fetch(`${API_BASE_URL}/nielsen/data?${queryString}`)
        .then(response => response.json())
        .then(json => this.setState({ data: { items: json, isLoading: false } }))
    );
  }

  barChartData = () => {
    const {
      nielsenBrands: { dictionary: brandsDict },
      nielsenAreas: { dictionary: areasDict },
      metric
    } = this.props;

    return _.flow([
      _.filter(item => item[metric] && item.date),
      _.groupBy('date'),
      _.entries,
      _.map(([ date, list ]) => list.reduce((acc, item) => mergeObjects(acc, {
          [`${areasDict[item.areaId]}, ${brandsDict[item.brandId]}`]: item[metric]
        }),
        { name: moment(date).format('MMM, YY').toUpperCase() }
      ))
    ])(this.state.data.items);
  }

  renderBarStacks = () => {
    const {
      nielsenBrands: { dictionary: brandsDict },
      nielsenAreas: { dictionary: areasDict },
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
            fill={colorPalette[j]}
            dataKey={`${areaName}, ${brandName}`}
          />
        ))
      );
    }, []);
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
      nielsenSubcategories,
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
          dataSetName='nielsen'
          nielsenAppliers={nielsenAppliers}
          nielsenAreas={nielsenAreas}
          nielsenBrands={nielsenBrands}
          nielsenChannels={nielsenChannels}
          nielsenGenres={nielsenGenres}
          nielsenLevels={nielsenLevels}
          nielsenManufacturers={nielsenManufacturers}
          nielsenPackagings={nielsenPackagings}
          nielsenSubcategories={nielsenSubcategories}
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
                  dropdownMode="select"
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
                  dropdownMode="select"
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

export default connect(mapStateToProps)(NielsenPeriodsBarChart);
