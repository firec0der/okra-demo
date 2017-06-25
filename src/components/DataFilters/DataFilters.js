// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Col, Row, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import _ from 'lodash/fp';
import moment from 'moment';
import classNames from 'classnames';

// import from components
import DataFilter from '../DataFilter/DataFilter';
import DatePicker from '../DatePicker/DatePicker';

// import from constants
import { DATA_FILTERS_CONFIG } from '../../constants/dataFilters';

// import from utils
import { mergeObjects } from '../../utils/object';

// import from styles
import './DataFilters.scss';

export default class DataFilters extends React.Component {

  static propTypes = {
    header: PropTypes.string,
    dataFilters: PropTypes.arrayOf(PropTypes.string),
    dataSetName: PropTypes.string.isRequired,
    values: PropTypes.object,
    onChange: PropTypes.func,
    showPeriodFilters: PropTypes.bool,
  };

  static defaultProps = {
    header: 'These filters are being used for your query',
    onChange: values => {},
    dataSetName: 'nielsen',
    showPeriodFilters: true
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      values: this.initialValues(),
      expanded: true,
    };
    this.onChangeCallbacks = this.onChangeCallbacks();
  }

  componentDidMount() {
    this.props.onChange(this.state.values);
  }

  onChangeSingle = (property, value) => {
    const values = mergeObjects(this.state.values, {
      [property]: value ? parseInt(value.value) : null
    });

    this.setState({ values }, () => this.props.onChange(this.state.values));
  };

  onChangeMultiple = (stateKey, arrayWithValues) => {
    const values = mergeObjects(this.state.values, {
      [stateKey]: arrayWithValues.map(value => parseInt(value.value))
    });

    this.setState({ values }, () => this.props.onChange(this.state.values));
  };

  onPeriodChange = (property, value) => {
    const values = mergeObjects(this.state.values, {
      [property]: value ? moment(value).unix() : null
    });

    this.setState({ values }, () => this.props.onChange(this.state.values));
  }

  getDictionary = propKey => _.getOr({}, `${propKey}.dictionary`, this.props);
  getIsLoading = propKey => _.getOr(false, `${propKey}.isLoading`, this.props);

  getSelectedValue = filter => {
    const { dataSetName } = this.props;

    // it's impossible, but anyway, something bad could happen.
    if (!DATA_FILTERS_CONFIG[filter]) { return null; }

    const { key, multi } = DATA_FILTERS_CONFIG[filter];

    const propKey = `${dataSetName}PropKey`;
    const dictionary = this.getDictionary(
      DATA_FILTERS_CONFIG[filter][propKey]
    );

    if (_.isEmpty(dictionary) || !this.state.values[key]) { return null; }

    if (!multi) {
      return {
        label: dictionary[this.state.values[key]],
        value: this.state.values[key]
      };
    }

    return this.state.values[key].map(id => ({ label: dictionary[id], value: id }));
  };

  initialValues = () => {
    const { values, showPeriodFilters } = this.props;

    const getValue = filter => values && values[DATA_FILTERS_CONFIG[filter].key]
      ? values[DATA_FILTERS_CONFIG[filter].key]
      : DATA_FILTERS_CONFIG[filter].multi
        ? []
        : null;

    const initialValues = Object
      .keys(DATA_FILTERS_CONFIG)
      .reduce((acc, filterName) => mergeObjects(acc, {
        [DATA_FILTERS_CONFIG[filterName].key]: getValue(filterName)
      }), {});

    if (!showPeriodFilters) { return initialValues; }

    return mergeObjects(initialValues, {
      // make sure that timestamps are here. values must be INTs.
      periodFrom: values.periodFrom,
      periodTo: values.periodTo
    });
  };

  configForCurrentSetup = () => {
    const { dataFilters, dataSetName } = this.props;

    // Get all available filters for current data set.
    const filtersForCurrentDataSet = Object
      .keys(DATA_FILTERS_CONFIG)
      .filter(filterName => DATA_FILTERS_CONFIG[filterName][`${dataSetName}PropKey`]);

    // Assemble configs for all requested filters.
    return dataFilters
      .filter(filterName => filtersForCurrentDataSet.includes(filterName))
      .reduce((acc, filterName) => mergeObjects(acc, {
        [filterName]: DATA_FILTERS_CONFIG[filterName]
      }), {});
  }

  onChangeCallbacks = () => {
    const configForCurrentDataSet = this.configForCurrentSetup();

    return Object
      .keys(configForCurrentDataSet)
      .reduce((acc, filterName) => mergeObjects(acc, {
        [filterName]: DATA_FILTERS_CONFIG[filterName].multi
          ? this.onChangeMultiple.bind(null, configForCurrentDataSet[filterName].key)
          : this.onChangeSingle.bind(null, configForCurrentDataSet[filterName].key)
      }), {});
  }

  renderFilters = () => {
    const { showPeriodFilters, dataSetName } = this.props;

    const periodFilters = showPeriodFilters
      ? [
        <FormGroup key='periodFrom'>
          <ControlLabel>Period from</ControlLabel>
          <DatePicker
            customInput={<FormControl />}
            selected={moment.unix(this.state.values.periodFrom)}
            showYearDropdown
            showMonthDropdown
            dropdownMode='select'
            onChange={this.onPeriodChange.bind(null, 'periodFrom')}
          />
        </FormGroup>,
        <FormGroup key='periodTo'>
          <ControlLabel>Period to</ControlLabel>
          <DatePicker
            customInput={<FormControl />}
            selected={moment.unix(this.state.values.periodTo)}
            showYearDropdown
            showMonthDropdown
            dropdownMode='select'
            onChange={this.onPeriodChange.bind(null, 'periodTo')}
          />
        </FormGroup>
      ]
      : [];

    const configForCurrentDataSet = this.configForCurrentSetup();

    const dataFilterProps = filterName => {
      const config = configForCurrentDataSet[filterName];

      return {
        key: filterName,
        value: this.getSelectedValue(filterName),
        label: config.label,
        multi: config.multi,
        dictionary: this.getDictionary(config[`${dataSetName}PropKey`]),
        isLoading: this.getIsLoading(config[`${dataSetName}PropKey`]),
        onChange: this.onChangeCallbacks[filterName]
      };
    };

    const filters = _.flow([
      _.keys,
      _.map(filterName => <DataFilter {...dataFilterProps(filterName)} />)
    ])(configForCurrentDataSet);

    return _.flow([
      _.chunk(4),
      _.map((row, i) => (
        <Row key={row.map(item => item.key).join('+')}>
          { row.map((item, j) => (
            <Col key={j} xs={12} md={3}>
              { item }
            </Col>
          )) }
        </Row>
      ))
    ])([...filters, ...periodFilters]);
  }

  expandContainer = () => this.setState({ expanded: !this.state.expanded });

  render() {
    const { header } = this.props;
    const { expanded } = this.state;

    const containerClassName = classNames('data-filters', { '-expanded': expanded });

    const headerProps = mergeObjects(
      { className: 'data-filters-header' },
      !expanded ? { onClick: this.expandContainer } : {}
    );

    return (
      <Grid>
        <Row>
          <Col md={8} mdOffset={2}>
            <div className={containerClassName}>
              <div {...headerProps}>{ header }</div>

              { expanded && [
                <div className='data-filters-body' key='body'>
                  { this.renderFilters() }
                </div>,
                <div className='data-filters-footer' key='footer'>
                  <Button onClick={this.expandContainer}>Confirm</Button>
                </div>
              ] }
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

}
