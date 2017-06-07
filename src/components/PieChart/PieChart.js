// import from vendor
import React from 'react';
import PropTypes from 'prop-types';
import {
  PieChart as RechartPieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

// import from constants
import { colorPalette } from '../../constants/colors';

export default class PieChart extends React.Component {

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    }).isRequired)
  };

  static defaultProps = {
    data: []
  };

  render() {
    const { data } = this.props;

    const pieProps = {
      data,
      label: true,
      outerRadius: 100
    };

    return (
      <ResponsiveContainer width='100%' height={300}>
        <RechartPieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <Pie {...pieProps}>
            { data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorPalette[index]} />
            )) }
          </Pie>
        </RechartPieChart>
      </ResponsiveContainer>
    );
  }

}
