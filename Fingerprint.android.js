import React, { Component } from "react";
import FingerprintScanner from "react-native-fingerprint-scanner";
import PropTypes from "prop-types"
import { Alert, Image, Text, TouchableOpacity, View, ViewPropTypes, StyleSheet } from 'react-native';

//import ShakingText from './ShakingText.component';

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
      backgroundColor: '#ffffff',
    },
    logo: {
      marginVertical: 45,
    },
    heading: {
      textAlign: 'center',
      color: '#00a4de',
      fontSize: 21,
    },
    description: (error) => ({
      textAlign: 'center',
      color: error ? '#ea3d13' : '#a5a5a5',
      height: 65,
      fontSize: 18,
      marginVertical: 10,
      marginHorizontal: 20,
    }),
    buttonContainer: {
      padding: 20,
    },
    buttonText: {
      color: '#8fbc5a',
      fontSize: 15,
      fontWeight: 'bold',
  },
});

// Export class
export default FingerprintPopup;
