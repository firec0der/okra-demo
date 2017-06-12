// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from components
import SearchBar from '../../components/SearchBar/SearchBar';
import BarChart from '../../components/BarChart/BarChart';
import PieChart from '../../components/PieChart/PieChart';
import MultipleSelect from '../../components/Select/Select';

// import from styles
import './HomePage.scss';

// import from utils
import { mergeObjects } from '../../utils/object';

// import from modules
import { fetchKantarData } from '../../modules/kantarData';

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
  fetchKantarData
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
    fetchKantarData: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      dataFilters: {
        brandIds: [],
        filters: 'penetration',
        areaIds: []
      }
    };
  }

  brandOptions = () => {
    const table = this.props.kantarBrands.table;
    return Object.keys(table).map(id => ({ value: id, label: table[id] }));
  };

  areaOptions = () => {
    const table = this.props.kantarAreas.table;
    return Object.keys(table).map(id => ({ value: id, label: table[id] }));
  };

  filtersOption = () => {
    const { list, dictionary } = this.props.kantarFilters;

    return list.map(key => ({ value: key, label: dictionary[key] }));
  };

  onBrandSelectChange = (selectedBrands) => {
    const brandIds = selectedBrands.map(value => value.value);
    const dataFilters = mergeObjects(this.state.dataFilters, { brandIds });

    const fetchKantarData = () => this.props.fetchKantarData(dataFilters);

    this.setState({ dataFilters }, fetchKantarData);
  }

  onAreaSelectChange = (selectedAreas) => {
    const areaIds = selectedAreas.map(value => value.value);
    const dataFilters = mergeObjects(this.state.dataFilters, { areaIds });

    const fetchKantarData = () => this.props.fetchKantarData(dataFilters);

    this.setState({ dataFilters }, fetchKantarData);
  }

  onFilterSelectChange = (selectedFilter) => {
    const dataFilters = mergeObjects(
      this.state.dataFilters,
      { filters: selectedFilter.value }
    );

    this.setState({ dataFilters });
  }

  barChartData = () => {
    const { kantarData, kantarBrands, kantarAreas } = this.props;
    const { filters, areaIds } = this.state.dataFilters;

    return _.flow([
      _.groupBy('brandId'),
      _.entries,
      _.map(([ brandId, list ]) => list
        .map(i => mergeObjects(i, { period: `Q${i.quarter}/${i.year}` }))
        .sort((a, b) => {
          const aVal = `${a.year} ${a.quarter}`;
          const bVal = `${b.year} ${b.quarter}`;
          if (aVal > bVal) { return 1; }
          if (bVal < aVal) { return -1; }
          return 0;
        })
        .reduce(
          (acc, object) => mergeObjects(
            acc,
            object[filters] ? { [object.period]: object[filters] } : {}
          ),
          { name: kantarBrands.table[brandId] }
      ))
    ])(kantarData.list);
  }

  render() {
    const { kantarBrands, kantarFilters, kantarAreas } = this.props;
    const { dataFilters } = this.state;

    const searchOnSubmit = (value) => window.alert(`It works, value: ${value}`);

    const barChartData = this.barChartData();

    const filter = !kantarFilters.isLoading
      ? { value: dataFilters.filters, label: kantarFilters.dictionary[dataFilters.filters] }
      : {};

    return (
      <div className='home-page'>
        <Grid className='top-content'>
          <Col xs={12} md={6} mdOffset={3}>
            <img className='unilever-logo' src={UnileverLargeLogo} />
            <SearchBar onSubmit={searchOnSubmit} />
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
            { !kantarFilters.isLoading && (
              <MultipleSelect
                label='Choose filters'
                options={this.filtersOption()}
                isLoading={kantarFilters.isLoading}
                onChange={this.onFilterSelectChange}
                value={filter}
                clearable={false}
              />
            ) }
          </Col>
        </Grid>

        <Grid>
          <Col xs={12} md={4} mdOffset={2}>
            <MultipleSelect
              label='Choose areas'
              options={this.areaOptions()}
              multi
              isLoading={kantarAreas.isLoading}
              onChange={this.onAreaSelectChange}
            />
          </Col>
        </Grid>

        { barChartData.length > 0 && (
          <Grid>
            <Col xs={12} md={10} mdOffset={1} style={{ marginBottom: '30px' }}>
              <BarChart chartHeight={450} data={this.barChartData()} />
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
