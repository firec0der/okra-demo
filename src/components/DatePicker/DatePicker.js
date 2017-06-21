// import from vendors
import React from 'react';
import ReactDatePicker from 'react-datepicker';

// import from styles
import 'react-datepicker/src/stylesheets/datepicker.scss';
import './DatePicker.scss';

export default class DatePicker extends React.Component {

  render() {
    return <ReactDatePicker {...this.props} />;
  }

}
