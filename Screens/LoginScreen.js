import React, { Component } from "react";
import { Alert, Button, Image, Platform, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { createStackNavigator } from "react-navigation"
import Expo from "expo";
import DropdownAlert from 'react-native-dropdownalert';
import { GlobalStyles } from "./Styles.js"
import { FadeInView } from "./Animations.js"

// Fonts
//import ICPSRFont from "./Assets/fonts/BEHATRICE.ttf"


// --- Login Screen --- //
export default class LoginScreen extends Component {
    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
    };

    // --- Constructor --- //
    constructor(props){
        super(props)

        // Binds the "this" object to the functions
        this._onCredentialsEntered = this._onCredentialsEntered.bind(this);
        this._onUsernameUpdated = this._onUsernameUpdated.bind(this);
        this._onPasswordUpdated = this._onPasswordUpdated.bind(this);
        this._transitionToHome = this._transitionToHome.bind(this);
        this._attemptFingerprintAuthentication = this._attemptFingerprintAuthentication.bind(this);

        // The current state of this screen in the App, represented in a pseudo enum
        this.ScreenStateEnum = Object.freeze({ Neutral: {}, CredentialsWindow: {} });
        this.state = { ScreenState: this.ScreenStateEnum.Neutral };

        // The current credentials entered in
        this.SubmittedUsername = "";
        this.SubmittedPassword = "";
    }

    // --- State machine related --- //
    // Toggles the credentials window part of the state machine
    _setCredentialsFields(isVisible){
        return () => {
            this.setState(currentState => {
                if(isVisible) return { ScreenState: this.ScreenStateEnum.CredentialsWindow };
                else{
                    this.SubmittedUsername = "";
                    this.SubmittedPassword = "";
                    return { ScreenState: this.ScreenStateEnum.Neutral };
                }
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
        // TODO: Networking stuff goes here


        // On success, continue to the home screen.
        if(true){
            // Reset state back to neutral before nagivating
            this.setState(currentState => {
                return { ScreenState: this.ScreenStateEnum.Neutral };
            });
            // Navigate
            this._transitionToHome();
            // Clear both fields
            this.SubmittedUsername = "";
            this.SubmittedPassword = "";
        }
        // Clear the password field on failure
        else {
            this.SubmittedPassword = "";
        }
    }

    // Attempts to authenticate the user's fingerprint.
    async _attemptFingerprintAuthentication(){
        let hasHardware = await Expo.Fingerprint.hasHardwareAsync();
        let isEnrolled = await Expo.Fingerprint.isEnrolledAsync();
        if(hasHardware && isEnrolled){
            let authenticated;
            if(Platform.OS == "ios"){
                authenticated = await Expo.Fingerprint.authenticateAsync("Scan to login.");
            } else if(Platform.OS == "android"){
                // TODO: We seem to get stuck in this await statement after we already call cancelAuthenticate, until we get here again.
                // Can confirm this by putting a message in the else statement of the authenticated.success. Check to see if this is a problem on a real android.
                authenticated = await Expo.Fingerprint.authenticateAsync(
                    Alert.alert(
                        "Fingerprint Authentication",
                        "Place your finger to scan.",
                        [
                            {text: "Cancel", onPress: () => {Expo.Fingerprint.cancelAuthenticate(); this.dropdown.alertWithType("info", "hi", "onCancel"); }},
                        ],
                        { onDismiss: () => {Expo.Fingerprint.cancelAuthenticate(); this.dropdown.alertWithType("info", "hi", "onDismiss"); } }
                    )
                );
            }
            if(authenticated.success){
                this.dropdown.alertWithType("success", "Success", "Authentication succeeded.");
                _transitionToHome();
            } else {
                //this.dropdown.alertWithType("error", "Failed", "Authentication failed or canceled.");
            }
        } else if(!hasHardware) {
            this.dropdown.alertWithType("error", "Incompatible Device", "Current device does not have the hardware to use this functionality.");
        } else {
            this.dropdown.alertWithType("error", "Not Enrolled", "Please activate biometric scanning on your device to use.");
        }
    }


    // Transitions to the Home State
    _transitionToHome(){
        this.props.navigation.navigate("Home", { user: this.SubmittedUsername, pass: this.SubmittedPassword });
    }



    // --- Render --- //
    render() {
        return (
            // Outermost view, don't have anything outside of this
            <View style={GlobalStyles.background}>

                {/* Title */}
                <View style={GlobalStyles.header}>
                    <Text style={styles.headerText}>ICPSR</Text>
                </View>


                {/* Body */}
                <View style={styles.textContainer}>
                    <Text style={GlobalStyles.boldText}>International Leader in Data Stewardship</Text>
                    <Text style={GlobalStyles.boldText}>10,000 studies, comprising of 4.8 million variables</Text>
                    <Text style={GlobalStyles.boldText}>Data Stewardship and Social Science Research Projects</Text>
                    <Text style={GlobalStyles.boldText}>776 member institutions</Text>
                </View>


                {/* Main Buttons */}
                {this.state.ScreenState != this.ScreenStateEnum.CredentialsWindow ?
                    <FadeInView>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={this._setCredentialsFields(true)} style={GlobalStyles.bigButton} activeOpacity={0.6} underlayColor="white">
                                <Image source={require("../Assets/key.png")} style={{marginBottom: 20, width: 100, height: 100}}/>
                                <Text style={GlobalStyles.boldText}>Username/Password</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._attemptFingerprintAuthentication} style={GlobalStyles.bigButton} activeOpacity={0.6} underlayColor="white">
                                <Image source={require("../Assets/fingerprint.png")} style={{marginBottom: 20, width: 100, height: 100}}/>
                                <Text style={GlobalStyles.boldText}>Fingerprint Scan</Text>
                            </TouchableOpacity>
                        </View>
                    </FadeInView>
                : false }


                {/* Username/Password Windows */}
                {this.state.ScreenState === this.ScreenStateEnum.CredentialsWindow ?
                    <FadeInView>
                        <View style={{marginTop: "20%"}}>
                            <View style={styles.textInputContainer}>
                                <TextInput style={styles.textInput} placeholder="Username" onChangeText={this._onUsernameUpdated} onSubmitEditing={this._onCredentialsEntered} autoFocus={true}/>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TextInput style={styles.textInput} placeholder="Password" onChangeText={this._onPasswordUpdated} onSubmitEditing={this._onCredentialsEntered} secureTextEntry={true}/>
                            </View>

                            <View style={{alignItems: "center", justifyContent: "center", margin: 30}}>
                                <TouchableOpacity onPress={this._onCredentialsEntered} style={styles.button} activeOpacity={0.6} underlayColor="white">
                                    <Text style={GlobalStyles.boldText}>Submit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this._setCredentialsFields(false)} style={{marginTop: 30}} activeOpacity={0.6} underlayColor="white">
                                    <Text style={GlobalStyles.underlineText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </FadeInView>
                : false }

                {/* Dropdown Alerts */}
                <DropdownAlert ref={ref => (this.dropdown = ref)} closeInterval={5000}/>

            </View>
        );
    }
}

// --- Login Page Styles --- //
export const styles = StyleSheet.create({
    headerText: {
        fontFamily: "icpsr-font",
        fontSize: 100,
        fontWeight: 'bold',
        color: "white",
    },
    buttonContainer: {
        marginTop: "60%",
        flexDirection: "row",
        justifyContent: "space-around"
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
});
