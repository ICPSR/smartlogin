import React, { Component } from "react";
import FingerprintScanner from "react-native-fingerprint-scanner";
import PropTypes from "prop-types"
import { Alert, Image, Text, TouchableOpacity, View, ViewPropTypes, StyleSheet, Platform } from 'react-native';

// --- Android --- //
class FingerprintPopup extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        // TODO: Need to convert project to regular react-native in order to call any library functions here.
        /*
        FingerprintScanner.authenticate({ onAttempt: this.onAuthenticationAttempted })
        .then(() => { Alert.alert("Fingerprint Authentication", "Authenticated sucessfully"); this.props.onPopupDismissed(); })
        .catch((error) => { Alert.alert("Fingerprint Authentication", "Authentication Failed: " + Platform.Version + " " + error.message) });
        */
    }

    onAuthenticationAttempted = (error) => {
        Alert.alert("Fingerprint Authentication", "Attempting Authentication")
    };

    componentWillUnmount(){
        //FingerprintScanner.release();
    }

    render() {
        const { style, onPopupDismissed } = this.props;

        return (
            <View style={styles.container}>
                <View style={[styles.contentContainer, style]}>

                    <Image style={styles.logo} source={require('./Assets/finger_print.png')}/>

                    <Text style={styles.heading}>Fingerprint Authentication</Text>
                    <Text>Scan your fingerprint to continue</Text>

                    <TouchableOpacity style={styles.buttonContainer} onPress={onPopupDismissed}>
                        <Text style={styles.buttonText}>Cancel</Text>
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

// --- Style Sheet --- //
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 164, 222, 0.9)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 400,
        height: 400,
        backgroundColor: '#ffffff',
    },
    logo: {
        marginVertical: 45,
        width: 100,
        height: 100,
        paddingLeft: 50,
        paddingRight: 50,
    },
    heading: {
        textAlign: 'center',
        color: '#00a4de',
        fontSize: 25,
    },
    buttonContainer: {
        padding: 20,
        borderWidth: 2,
        borderColor: "grey",
        marginTop: 40,
    },
    buttonText: {
        color: '#8fbc5a',
        fontSize: 15,
        fontWeight: 'bold',
    },
});

// Export class
export default FingerprintPopup;
