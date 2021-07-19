import React from 'react';
import Alert from '@material-ui/lab/Alert';

class Alerts extends React.Component {
  render() {
    return (
        <Alert severity={this.props.type}>{this.props.msg}</Alert>
    );
  }
}

export default Alerts;
