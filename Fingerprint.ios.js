import React, { Component } from "react";
import FingerprintScanner from "react-native-fingerprint-scanner";
import PropTypes from "prop-types"
import { AlertIOS, StyleSheet } from 'react-native';

// --- IOS --- //
class FingerprintPopup extends Component {
    componentDidMount(){
        FingerprintScanner.authenticate({description: "Scan your fingerprint to continue"})
            .then(() => { this.props.onPopupDismissed(); AlertIOS.alert("Success"); })
            .catch((error) => { this.props.onPopupDismissed(); AlertIOS.alert(error.message); });
    }

    render(){
        return false;
    }
}

// Props that this component uses.
FingerprintPopup.propTypes = {
    // Callback when the popup gets dismissed
    onPopupDismissed: PropTypes.func.isRequired,
};

// Export class
export default FingerprintPopup;
