// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from components
import SearchBar from '../../components/SearchBar/SearchBar';
import StackedBarChart from '../../components/StackedBarChart/StackedBarChart';
import PieChart from '../../components/PieChart/PieChart';
import MultipleSelect from '../../components/Select/Select';
import PropertyFilters from '../../components/PropertyFilters/PropertyFilters';

// import from styles
import './HomePage.scss';

// import from utils
import { mergeObjects } from '../../utils/object';

// import from modules
import { fetchKantarData, clearKantarData } from '../../modules/kantarData';

// import from assets
import UnileverLargeLogo from '../../assets/images/UL-large-logo.png';

const pieChartData = [
  { name: 'Sector A', value: 400 }, { name: 'Sector B', value: 300 },
  { name: 'Sector C', value: 300 }, { name: 'Sector D', value: 200 }
];

const mapStateToProps = (state) => ({
  kantarBrands: state.kantarBrands,
  kantarData: state.kantarData,
  kantarFilters: state.kantarFilters,
  kantarAreas: state.kantarAreas,
});

const mapDispatchToProps = {
  fetchKantarData,
  clearKantarData
};

class HomePage extends React.Component {

  static propTypes = {
    kantarBrands: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      table: PropTypes.object,
    }),
    kantarAreas: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      table: PropTypes.object,
    }),
    kantarData: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      list: PropTypes.array,
    }),
    kantarFilters: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      list: PropTypes.array.isRequired,
      dictionary: PropTypes.object.isRequired,
    }),
    fetchKantarData: PropTypes.func.isRequired,
    clearKantarData: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      dataFilters: {
        brandIds: [],
        property: 'penetration',
        areaIds: []
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsKeys = ['kantarBrands', 'kantarAreas', 'kantarData', 'kantarFilters'];

    return !_.isEqual(_.pick(propsKeys, nextProps), _.pick(propsKeys, this.props))
      || !_.isEqual(this.state.dataFilters, nextState.dataFilters)
  }

  fetchData = (dataFilters) => {
    const { brandIds, areaIds } = dataFilters;
    const { fetchKantarData } = this.props;

    if (brandIds.length && areaIds.length) {
      fetchKantarData({ brandIds, areaIds });
    }
  };

  brandOptions = () => {
    const table = this.props.kantarBrands.table;
    return Object.keys(table).map(id => ({ value: id, label: table[id] }));
  };

  areaOptions = () => {
    const table = this.props.kantarAreas.table;
    return Object.keys(table).map(id => ({ value: id, label: table[id] }));
  };

  onBrandSelectChange = (selectedBrands) => {
    const brandIds = selectedBrands.map(value => value.value);
    const dataFilters = mergeObjects(this.state.dataFilters, { brandIds });

    this.setState({ dataFilters }, dataFilters.brandIds.length
      ? () => this.fetchData(dataFilters)
      : this.props.clearKantarData
    );
  }

  onAreaSelectChange = (selectedAreas) => {
    const areaIds = selectedAreas.map(value => value.value);
    const dataFilters = mergeObjects(this.state.dataFilters, { areaIds });

    this.setState({ dataFilters }, () => this.fetchData(dataFilters));
  }

  onPropertyFilterChange = (property) => {
    const dataFilters = mergeObjects(this.state.dataFilters, { property });

    this.setState({ dataFilters });
  }

  barChartData = () => {
    const { kantarData, kantarBrands, kantarAreas } = this.props;
    const { dataFilters } = this.state;

    const dataRaw = _.flow([
      _.groupBy('brandId'),
      _.entries,
      _.map(([ brandId, list ]) => list
        .reduce(
          (acc, object) => mergeObjects(acc, {
            values: [
              ...acc.values,
              {
                areaId: object.areaId,
                year: object.year,
                quarter: object.quarter,
                value: object[dataFilters.property]
              }
            ]
          }),
          { name: kantarBrands.table[brandId], values: [] }
        )
      )
    ])(kantarData.list);

    const chartData = dataRaw.map(list => mergeObjects(
      { name: list.name },
      list.values.reduce(
        (acc, item) => mergeObjects(acc, {
          [`${kantarAreas.table[item.areaId]}, Q${item.quarter}/${item.year}`]: item.value
        }),
        {}
      )
    ));

    return chartData;
  }

  barChartStacks = () => {
    const { kantarData, kantarAreas } = this.props;
    const { dataFilters } = this.state;

    const years = _.uniq(kantarData.list.map(item => item.year)).sort();
    const quarters = _.uniq(kantarData.list.map(item => item.quarter)).sort();

    return years
      // collect all possible periods for the current data
      .reduce((acc, year) => [
        ...acc,
        ...(quarters.map(quarter => `Q${quarter}/${year}`))
      ], [])
      // collect stacks [ [ 'data item for period 1', 'data item for period 2'] ]
      .map(period => dataFilters.areaIds.map(
        areaId => `${kantarAreas.table[areaId]}, ${period}`
      ));
  }

  render() {
    const { kantarBrands, kantarAreas, kantarData, kantarFilters } = this.props;
    const { dataFilters } = this.state;

    const searchOnSubmit = (value) => window.alert(`It works, value: ${value}`);

    const filters = _.flow(
      _.entries,
      _.map(([ value, label ]) => ({ value, label }))
    )(kantarFilters.dictionary);

    return (
      <div className='home-page'>
        <Grid className='top-content'>
          <Col xs={12} md={6} mdOffset={3}>
            <img className='unilever-logo' src={UnileverLargeLogo} />
            <SearchBar onSubmit={searchOnSubmit} />
          </Col>
        </Grid>

        <Grid style={{ marginBottom: '30px' }}>
          <Col xs={12} md={8} mdOffset={2}>
            <PropertyFilters
              onChange={this.onPropertyFilterChange}
              selected={dataFilters.property}
              filters={filters}
            />
          </Col>
        </Grid>

        <Grid>
          <Col xs={12} md={4} mdOffset={2}>
            <MultipleSelect
              label='Choose brands'
              options={this.brandOptions()}
              multi
              isLoading={kantarBrands.isLoading}
              onChange={this.onBrandSelectChange}
            />
          </Col>
          <Col xs={12} md={4}>
            <MultipleSelect
              label='Choose areas'
              options={this.areaOptions()}
              multi
              isLoading={kantarAreas.isLoading}
              onChange={this.onAreaSelectChange}
            />
          </Col>
        </Grid>

        { kantarData.list.length > 0 && (
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

        { /*
        <Grid>
          <Col xs={12} md={8} mdOffset={2}>
            <PieChart data={pieChartData} />
          </Col>
        </Grid>
         */ }
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
