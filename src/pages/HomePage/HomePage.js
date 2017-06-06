// import from vendors
import React from 'react';

// import from components
import BarChart from '../../components/BarChart/BarChart';

// import from styles
import './HomePage.scss';

export default class HomePage extends React.Component {

  render() {
    const barChartData = [
      { name: 'Unilever', 2007: 29.1, 2008: 31.28, 2009: 39.62 },
      { name: 'P&G', 2007: 14.63, 2008: 13.04, 2009: 10.1 },
      { name: 'Beiersdorf', 2007: 20.3, 2008: 18.9, 2009: 25.96 },
    ];

    return (
      <div>
        <BarChart data={barChartData} />
      </div>
    );
  }

}
