// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';

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

const mapStateToProps = ({ kantarBrands, kantarData, kantarFilters }) => ({
  kantarBrands,
  kantarData,
  kantarFilters
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
        filters: 'penetration'
      }
    };
  }

  brandOptions = () => {
    const table = this.props.kantarBrands.table;
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

  onFilterSelectChange = (selectedFilter) => {
    const dataFilters = mergeObjects(
      this.state.dataFilters,
      { filters: selectedFilter.value }
    );

    this.setState({ dataFilters });
  }

  barChartData = () => {
    const { kantarData, kantarBrands } = this.props;
    const { filters } = this.state.dataFilters;

    const brandIds = [...(new Set(kantarData.list.map(item => item.brandId)))];

    const data = kantarData.list.reduce(
      (acc, item) => mergeObjects(acc, {
        [item.brandId]: mergeObjects(
          acc[item.brandId],
          item[filters] ? { [`${item.year} q${item.quarter}`]: item[filters] } : {}
        )
      }),
      brandIds.reduce(
        (acc, brandId) => mergeObjects(acc, { [brandId]: {} }),
        {}
      )
    );

    return Object
      .keys(data)
      .reduce((acc, brandId) => [
        ...acc,
        mergeObjects(
          { name: kantarBrands.table[brandId] },
          Object
            .keys(data[brandId])
            .sort()
            .reduce((acc, key) => mergeObjects(acc, { [key]: data[brandId][key] }), {})
        )
      ], []);
  }

  render() {
    const { kantarBrands, kantarFilters } = this.props;
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
          <Col xs={12} md={8} mdOffset={2}>
            <MultipleSelect
              label='Choose brands'
              options={this.brandOptions()}
              multi
              isLoading={kantarBrands.isLoading}
              onChange={this.onBrandSelectChange}
            />
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
            { barChartData.length > 0 && <BarChart data={this.barChartData()} /> }
          </Col>
        </Grid>

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
