// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from constants
import {
  NIELSEN_LEVEL_FILTER,
  NIELSEN_MANUFACTURER_FILTER,
  NIELSEN_CHANNEL_FILTER,
  NIELSEN_AREA_FILTER,
  NIELSEN_BRAND_FILTER,
  NIELSEN_APPLIER_FILTER,
  NIELSEN_GENRE_FILTER,
  NIELSEN_PACKAGING_FILTER
} from '../../constants/nielsenDataFilters';

// import from containers
import NielsenBarChart from '../../containers/NielsenBarChart/NielsenBarChart';

export default class NielsenBarchart extends React.Component {

  render() {
    const searchOnSubmit = (value) => window.alert(`It works, value: ${value}`);

    const nielsenLevel = 'Genre';
    const dataFilters = [
      NIELSEN_LEVEL_FILTER,
      NIELSEN_MANUFACTURER_FILTER,
      NIELSEN_CHANNEL_FILTER,
      NIELSEN_AREA_FILTER,
      NIELSEN_BRAND_FILTER,
      NIELSEN_APPLIER_FILTER,
      NIELSEN_GENRE_FILTER,
      NIELSEN_PACKAGING_FILTER
    ];
    const requiredFilters = [
      NIELSEN_BRAND_FILTER,
      NIELSEN_AREA_FILTER
    ];

    return (
      <div className='home-page'>
        <NielsenBarChart
          level={nielsenLevel}
          dataFilters={dataFilters}
          requiredFilters={requiredFilters}
        />
      </div>
    );
  }

}
