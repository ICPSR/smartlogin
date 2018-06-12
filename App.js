import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";
//import RNCamera from "react-native-camera";


// Class that represents various state information for the app.
class AppInto {
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




// Main App Class
export default class App extends Component {
    render() {
        return (
            // Outermost view, don't have anything outside of this
            <View style={{flex: 1}}>

                {/* Title */}
                <View style={styles.titleView}>
                    <Text style={styles.title}>ICPSR</Text>
                </View>

                {/* Body */}
                <View style={styles.container}>
                    <Text>Open up App.js to start working on your app!</Text>
                    <Text>Changes you make will automatically reload.</Text>
                    <Text>Shake your phone to open the developer menu.</Text>
                    <Text>Test text 12345 xDDD.</Text>
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleView: {
        //backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 100,
        fontWeight: 'bold',
        color: "green",
    },
    container: {
        flex: 1,
        backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
    },
});
