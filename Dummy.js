import React, { Component } from "react";
import FingerprintScanner from "react-native-fingerprint-scanner";
import PropTypes from "prop-types"
import { AlertIOS } from 'react-native';

class DummyDum extends Component {
    render(){
        return false;
    }
}

// Props that this component uses.
DummyDum.propTypes = {
    // Callback when the popup gets dismissed
    hi: PropTypes.any.isRequired,
};

// Export class
export default DummyDum;
