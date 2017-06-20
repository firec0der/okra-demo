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
  NIELSEN_PACKAGING_FILTER,
  NIELSEN_DATA_FILTERS_CONFIG
} from '../../constants/nielsenDataFilters';

// import from containers
import NielsenBarChart from '../../containers/NielsenBarChart/NielsenBarChart';

export default class NielsenBarChartPage extends React.Component {

  render() {
    const searchOnSubmit = (value) => window.alert(`It works, value: ${value}`);

    const dataFilters = [
      NIELSEN_BRAND_FILTER,
      NIELSEN_CHANNEL_FILTER,
      NIELSEN_AREA_FILTER,
      NIELSEN_APPLIER_FILTER,
      NIELSEN_GENRE_FILTER,
      NIELSEN_PACKAGING_FILTER
    ];

    const requiredFilters = [
      NIELSEN_BRAND_FILTER,
      NIELSEN_AREA_FILTER
    ];

    const values = {
      [NIELSEN_DATA_FILTERS_CONFIG[NIELSEN_LEVEL_FILTER].key]: 1,
      [NIELSEN_DATA_FILTERS_CONFIG[NIELSEN_MANUFACTURER_FILTER].key]: 1,
      [NIELSEN_DATA_FILTERS_CONFIG[NIELSEN_BRAND_FILTER].key]: [1, 4],
      [NIELSEN_DATA_FILTERS_CONFIG[NIELSEN_AREA_FILTER].key]: [1],
    };

    const header =
      "Nielsen barchart with predefined Brand level, " +
      "Unilever manufacturer, Axe and Rexona brands and T Brasil area";

    // dataFilters={dataFilters}

    return (
      <div className='home-page'>
        <NielsenBarChart
          header={header}
          requiredFilters={requiredFilters}
          values={values}
        />
      </div>
    );
  }

}
