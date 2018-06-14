import React, { Component } from "react";
import { Alert, Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DummyDum from "./Dummy";
import FingerprintPopup from "./Fingerprint";
//import RNCamera from "react-native-camera";

// --- Main App Class --- //
export default class App extends Component {
    // Constructor
    constructor(props){
        super(props)

        // Binds the "this" object to the functions
        this._setFingerprintPopup = this._setFingerprintPopup.bind(this);

        // Add global state stuff here.
        this.state = { fingerprintWindowOpen: false };
    }

    // Can add functions here for use as callback functions
    _onPressButton(buttonNum){
        return () => {
            Alert.alert("hiya, you pressed button number " + buttonNum + "!");
        }
    }

    _setFingerprintPopup(isVisible){
        return () => {
            this.setState(currentState => { return { fingerprintWindowOpen: isVisible }; });
        }
    }

    render() {
        return (
            // Outermost view, don't have anything outside of this
            <View style={styles.background}>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>ICPSR</Text>
                </View>

                {/* Body */}
                <View style={styles.textContainer}>
                    <Text style={styles.text}>International Leader in Data Stewardship</Text>
                    <Text style={styles.text}>10,000 studies, comprising of 4.8 million variables</Text>
                    <Text style={styles.text}>Data Stewardship and Social Science Research Projects</Text>
                    <Text style={styles.text}>776 member institutions</Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this._onPressButton(1)} style={styles.button} underlayColor="white">
                        <Text style={styles.text}>Username/Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this._setFingerprintPopup(true)} style={styles.button} underlayColor="white">
                        <Text style={styles.text}>Fingerprint Scan</Text>
                    </TouchableOpacity>
                </View>

                {/* Fingerprint Scanner */}
                {this.state.fingerprintWindowOpen ? <FingerprintPopup onPopupDismissed={this._setFingerprintPopup(false)}/> : false }


            </View>
        );
    }
}

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
    background: {
        flex: 1,
        backgroundColor: "#005050",
    },
    titleContainer: {
        marginTop: 25,
        backgroundColor: "teal",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        //fontFamily: "BEHATRICE",
        fontSize: 100,
        fontWeight: 'bold',
        color: "white",
    },
    button: {
        backgroundColor: "teal",
        width: 250,
        height: 250,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    buttonContainer: {
        marginTop: "60%",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    textContainer: {
        marginTop: 50,
        backgroundColor: "#005050",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 20,
        padding: 10,
        color: "white",
        fontWeight: 'bold',
    },
});
