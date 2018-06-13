import React, { Component } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import DummyDum from "./Dummy";
import FingerprintPopup from "./Fingerprint";
//import RNCamera from "react-native-camera";

// --- Main App Class --- //
export default class App extends Component {
    // Constructor
    constructor(props){
        super(props)
        this._onFingerprintCallback = this._onFingerprintCallback.bind(this);

        // Add global state stuff here.
        this.state = { fingerprintWindowOpen: true };
    }

    // Can add functions here for use as callback functions
    _onPressButton(buttonNum){
        return () => {
            Alert.alert("hiya, you pressed button number " + buttonNum + "!");
        }
    }

    _onFingerprintCallback(){
        this.setState(currentState => {  return { fingerprintWindowOpen: false };  });
    }

    render() {
        const fingerprintWindow = <FingerprintPopup onPopupDismissed={this._onFingerprintCallback}/>;

        return (
            // Outermost view, don't have anything outside of this
            <View style={{flex: 1}}>

                {/* Title */}
                <View style={styles.titleView}>
                    <Text style={styles.title}>ICPSR</Text>
                </View>

                {/* Body */}
                <View style={styles.textContainer}>
                    <Text style={styles.text}>International Leader in Data Stewardship</Text>
                    <Text style={styles.text}>10,000 studies, comprising of 4.8 million variables</Text>
                    <Text style={styles.text}>Data Stewardship and Social Science Research Projects</Text>
                    <Text style={styles.text}>776 member institutions</Text>
                </View>

                {/* Fingerprint Scanner */}
                {this.state.fingerprintWindowOpen ? fingerprintWindow : false }

                {/* Buttons */}
                <Button onPress={this._onPressButton(1)} title="Press Me 1" color="green"/>
                <Button onPress={this._onPressButton(2)} title="Press Me 2" color="red"/>

            </View>
        );
    }
}

// <DummyDum></DummyDum>
// <FingerprintScanner onPopupDismissed=fingerprintCallback/>


// --- Data Structures and Helper Functions --- //
// Class that represents various state information for the app.
class AppInfo {
    constructor(){
        // Current state of the app, represented with a pesudo-enum
        this.StateEnum = Object.freeze({  })
        this.State = '';

        // User's username
        this.username = '';
        // User's password (obviously not going to be stored in plaintext in an actual app)
        this.password = '';

        // TEMP: Simulates the first time login / no fignerprint setup persistant state.
        this.fingerprintSet = false;
    }
}


// --- Style Sheet --- //
const styles = StyleSheet.create({
    titleView: {
        backgroundColor: "teal",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 100,
        fontWeight: 'bold',
        color: "white",
    },
    textContainer: {
        flex: 1,
        backgroundColor: "#005050",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 20,
        color: "white",
        fontWeight: 'bold',
    },
});
