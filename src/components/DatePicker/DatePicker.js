// import from vendors
import React from 'react';
import ReactDatePicker from 'react-datepicker';

// import from styles
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

export default class DatePicker extends React.Component {

  render() {
    return <ReactDatePicker {...this.props} />;
  }

}
