import { Button } from '@material-ui/core';
import React from 'react';

class ChangeLocationButton extends React.Component {
  render() {
    return (
        <Button data-testid="change-location-button" variant="outlined" onClick={() => { window.location = this.props.location }}>{this.props.text}</Button>
    );
  }
}

export default ChangeLocationButton;
