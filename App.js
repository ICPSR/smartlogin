import React, { Component } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { StackNavigator } from "react-navigation"
import Expo from "expo";
import FingerprintPopup from "./Fingerprint";
//import RNCamera from "react-native-camera";

// All the screens in the App
/*
const Screens = StackNavigator({
    Login: { screen: LoginScreen },
    Home: { screen: HomeScreen }
});*/

// --- Main App Class --- //
export default class App extends Component {
    // --- Constructor --- //
    constructor(props){
        super(props)

        // Binds the "this" object to the functions
        this._setFingerprintPopup = this._setFingerprintPopup.bind(this);
        this._onCredentialsEntered = this._onCredentialsEntered.bind(this);
        this._onUsernameUpdated = this._onUsernameUpdated.bind(this);
        this._onPasswordUpdated = this._onPasswordUpdated.bind(this);

        // The current state of this screen in the App, represented in a pseudo enum
        this.ScreenStateEnum = Object.freeze({ Neutral: {}, CredentialsWindow: {}, FingerprintWindow: {} });
        this.state = { ScreenState: this.ScreenStateEnum.Neutral };

        // The current credentials entered in
        this.SubmittedUsername = "";
        this.SubmittedPassword = "";
    }

    static navigationOptions = {
        title: "Login"
    };

    // --- Render --- //
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


                {/* Main Buttons */}
                {this.state.ScreenState != this.ScreenStateEnum.CredentialsWindow ?
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={this._setCredentialsFields(true)} style={styles.bigButton} underlayColor="white">
                            <Text style={styles.text}>Username/Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._setFingerprintPopup(true)} style={styles.bigButton} underlayColor="white">
                            <Text style={styles.text}>Fingerprint Scan</Text>
                        </TouchableOpacity>
                    </View>
                : false }


                {/* Username/Password Windows */}
                {this.state.ScreenState === this.ScreenStateEnum.CredentialsWindow ?
                    <View style={{marginTop: "20%"}}>
                        <View style={styles.textInputContainer}>
                            <TextInput style={styles.textInput} placeholder="Username" onChangeText={this._onUsernameUpdated} onSubmitEditing={this._onCredentialsEntered}/>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextInput style={styles.textInput} placeholder="Password" onChangeText={this._onPasswordUpdated} onSubmitEditing={this._onCredentialsEntered} secureTextEntry={true}/>
                        </View>

                        <View style={{alignItems: "center", justifyContent: "center", margin: 30}}>
                            <TouchableOpacity onPress={this._onCredentialsEntered} style={styles.button} underlayColor="white">
                                <Text style={styles.text}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._setCredentialsFields(false)} style={{marginTop: 30}} underlayColor="white">
                                <Text style={styles.smallText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                : false }


                {/* Fingerprint Popup */}
                {this.state.ScreenState === this.ScreenStateEnum.FingerprintWindow ?
                    <FingerprintPopup onPopupDismissed={this._setFingerprintPopup(false)}/>
                : false }


            </View>
        );
    }

    // --- State machine related --- //
    // Toggles the credentials window part of the state machine
    _setCredentialsFields(isVisible){
        return () => {
            this.setState(currentState => {
                if(isVisible) return { ScreenState: this.ScreenStateEnum.CredentialsWindow };
                return { ScreenState: this.ScreenStateEnum.Neutral };
            });
        }
    }

    // Toggles the fingerprint window part of the state machine
    _setFingerprintPopup(isVisible){
        return () => {
            this.setState(currentState => {
                if(isVisible) return { ScreenState: this.ScreenStateEnum.FingerprintWindow };
                return { ScreenState: this.ScreenStateEnum.Neutral };
            });
        }
    }

    // --- Callbacks --- //
    // Called as the user types their user/pass.
    _onUsernameUpdated(text){
        this.SubmittedUsername = text;
    }
    _onPasswordUpdated(text){
        this.SubmittedPassword = text;
    }

    // Called when the user submits their user/pass
    _onCredentialsEntered(){
        // TODO: Do network stuff here
        Alert.alert("Username: " + this.SubmittedUsername + "  Password: " + this.SubmittedPassword);


        // On success, continue to the home screen.
        if(true){
            this._toHomeScreen();
        }
    }

    // --- Screen Transitions --- //
    // Transitions to the home app screen.
    _toHomeScreen(){

    }

}

// --- Data Structures and Helper Functions --- //
// Class that represents various state information for the app.
class AppInfo {
    constructor(){
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
    buttonContainer: {
        marginTop: "60%",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    bigButton: {
        backgroundColor: "teal",
        width: 250,
        height: 250,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    button: {
        backgroundColor: "teal",
        width: 200,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    textContainer: {
        marginTop: 50,
        backgroundColor: "#005050",
        alignItems: "center",
        justifyContent: "center",
    },
    textInputContainer: {
        margin: 30,
    },
    textInput: {
        height: 40,
        padding: 10,
        fontSize: 20,
        color: "white",
    },
    text: {
        fontSize: 20,
        padding: 10,
        color: "white",
        fontWeight: 'bold',
    },
    smallText: {
        fontSize: 18,
        padding: 10,
        color: "white",
        textDecorationLine: "underline",
    }
});
