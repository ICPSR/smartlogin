import React, { Component } from "react";
import FingerprintScanner from "react-native-fingerprint-scanner";
import PropTypes from "prop-types"
import { Alert, Image, Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';

//import ShakingText from './ShakingText.component';
//import styles from "./FingerprintPopupAndroid.component.styles";

// --- Android --- //
class FingerprintPopup extends Component{
    constructor(props){
        super(props);
        this.state = { errorMessage: undefined };
    }

    componentDidMount(){
        FingerprintScanner.authenticate({ onAttempt: this.onAuthenticationAttempted })
            .then(() => { this.props.onPopupDismissed(); Alert.alert("Fingerprint Authentication", "Authenticated sucessfully") })
            .catch((error) => { this.setState({ errorMessage: error.message }); /*this.description.shake();*/ });
    }

    componentWillUnmount(){
        FingerprintScanner.release();
    }

    onAuthenticationAttempted = (error) => {
        this.setState({ errorMessage: error.message });
        //this.description.shake();
    };

    render() {
        const { errorMessage } = this.state;
        const { style, handlePopupDismissed } = this.props;

        return (
            <View style={styles.container}>
                <View style={[styles.contentContainer, style]}>

                    <Image
                        style={styles.logo}
                        source={require('./Assets/finger_print.png')}
                        />

                    <Text style={styles.heading}>
                        Fingerprint{'\n'}Authentication
                    </Text>
                    <ShakingText
                        ref={(instance) => { this.description = instance; }}
                        style={styles.description(!!errorMessage)}>
                        {errorMessage || 'Scan your fingerprint on the\ndevice scanner to continue'}
                    </ShakingText>

                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={handlePopupDismissed}
                        >
                        <Text style={styles.buttonText}>
                            BACK TO MAIN
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

// Props that this component uses.
FingerprintPopup.propTypes = {
    style: ViewPropTypes.style,
    onPopupDismissed: PropTypes.func.isRequired,
};

// Export class
export default FingerprintPopup;
