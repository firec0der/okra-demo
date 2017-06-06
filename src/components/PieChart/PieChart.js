// import from vendor
import React from 'react';
import PropTypes from 'prop-types';
import { PieChart as RCHPieChart, Pie, ResponsiveContainer } from 'recharts';

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
      outerRadius: 100,
      fill: '#8884d8',
      innerRadius: 10
    };

    return (
      <ResponsiveContainer width='100%' height={300}>
        <RCHPieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <Pie {...pieProps} />
        </RCHPieChart>
      </ResponsiveContainer>
    );
  }

}
