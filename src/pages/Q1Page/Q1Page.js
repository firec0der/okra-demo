// import from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

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
import NielsenPeriodsBarChart from '../../containers/NielsenPeriodsBarChart/NielsenPeriodsBarChart';

export default class Q1Page extends React.Component {

  render() {
    const dataFilters = [
      NIELSEN_AREA_FILTER,
      NIELSEN_APPLIER_FILTER,
      NIELSEN_GENRE_FILTER,
      NIELSEN_PACKAGING_FILTER
    ];

    const requiredFilters = [
      NIELSEN_AREA_FILTER
    ];

    const values = {
      [NIELSEN_DATA_FILTERS_CONFIG[NIELSEN_CHANNEL_FILTER].key]: 1,
      [NIELSEN_DATA_FILTERS_CONFIG[NIELSEN_LEVEL_FILTER].key]: 2,
      [NIELSEN_DATA_FILTERS_CONFIG[NIELSEN_GENRE_FILTER].key]: 1,
      [NIELSEN_DATA_FILTERS_CONFIG[NIELSEN_AREA_FILTER].key]: [1],
    };

    return (
      <div className='home-page'>
        <Grid style={{ marginBottom: '30px' }}>
          <Col xs={12} md={8} mdOffset={2}>
            <h4 className="text-center">
              What is the market share of female deodorants in supermarkets?
            </h4>
          </Col>
        </Grid>

        <NielsenPeriodsBarChart
          dataFilters={dataFilters}
          values={values}
          requiredFilters={requiredFilters}
        />
      </div>
    );
  }

}
