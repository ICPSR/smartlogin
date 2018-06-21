import React, { Component } from "react";
import { Alert, AsyncStorage, Button, Image, Keyboard, Platform, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, StatusBar } from "react-native";
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
        this._attemptFingerprintAuthentication = this._attemptFingerprintAuthentication.bind(this);

        // The current state of this screen in the App, represented in a pseudo enum
        this.ScreenStateEnum = Object.freeze({ Neutral: {}, CredentialsWindow: {} });
        this.state = { ScreenState: this.ScreenStateEnum.Neutral, LinkedUsername: null, LinkedPassword: null };

        // The current credentials entered in
        this.SubmittedUsername = "";
        this.SubmittedPassword = "";
    }

    // --- On Component Mount --- //
    async componentDidMount(){
        // Check if there's an account linked to the app already.
        try{
            let linkedUsername = await AsyncStorage.getItem("@LinkedUsername");
            let linkedPassword = await AsyncStorage.getItem("@LinkedPassword");

            // TODO: Do networking stuff here to verify that this username/password pair matches.


            // Set their state
            this.setState({ LinkedUsername: linkedUsername, LinkedPassword: linkedPassword });

            // Go straight to attempting a fingerprint authentication if there's a linked account already
            if(linkedUsername !== null && linkedPassword !== null){
                this._attemptFingerprintAuthentication();
            } else {
                this.setState({ScreenState: this.ScreenStateEnum.CredentialsWindow });
            }
        } catch(error){
            this.dropdown.alertWithType("error", "Error", "Error retriving credentials.");
        }

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
    async _onCredentialsEntered(){
        // TODO: Networking stuff goes here


        // On success, continue to the home screen.
        if(true){
            // Set this as the new linked Account
            await AsyncStorage.setItem("@LinkedUsername", this.SubmittedUsername);
            await AsyncStorage.setItem("@LinkedPassword", this.SubmittedPassword);

            // Set their state
            this.setState({ LinkedUsername: this.SubmittedUsername, LinkedPassword: this.SubmittedPassword });

            // Clear both fields
            this.SubmittedUsername = "";
            this.SubmittedPassword = "";

            // Reset state back to neutral
            this.setState(currentState => {
                return { ScreenState: this.ScreenStateEnum.Neutral };
            });

            this.dropdown.alertWithType("success", "Success", "New Account linked!");
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
            if(this.state.LinkedUsername !== null && this.state.LinkedPassword !== null){
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
                    //this.dropdown.alertWithType("success", "Success", "Authentication succeeded.");
                    this.props.navigation.navigate("QR");
                } else {
                    //this.dropdown.alertWithType("error", "Failed", "Authentication failed or canceled.");
                }
            } else {
                this.dropdown.alertWithType("warn", "No Account Linked", "Please link your account to this phone before attempting a QR Login.");
            }
        } else if(!hasHardware) {
            this.dropdown.alertWithType("error", "Incompatible Device", "Current device does not have the hardware to use biometric scanning.");
        } else {
            this.dropdown.alertWithType("warn", "Not Enrolled", "Please activate biometric scanning on your device to use.");
        }
    }


    // --- Render --- //
    render() {
        return (
            // Outermost view, don't have anything outside of this
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={GlobalStyles.background}>

                    <StatusBar barStyle="light-content"/>

                    {/* Title */}
                    <View style={GlobalStyles.header}>
                        <Text style={styles.headerText}>ICPSR</Text>
                    </View>

                    {/* Main Buttons */}
                    {this.state.ScreenState === this.ScreenStateEnum.Neutral ?
                        <FadeInView>
                            {this.state.LinkedUsername !== null ?
                                <View style={styles.usernameContainer}>
                                    <Text style={[GlobalStyles.boldText, { fontSize: 30 }]}>{this.state.LinkedUsername}</Text>
                                </View>
                            : false }

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={this._setCredentialsFields(true)} style={GlobalStyles.bigButton} activeOpacity={0.6} underlayColor="white">
                                    <Image source={require("../Assets/key.png")} style={{width: 100, height: 100}}/>
                                    <Text style={GlobalStyles.boldText}>Link Account</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this._attemptFingerprintAuthentication} style={GlobalStyles.bigButton} activeOpacity={0.6} underlayColor="white">
                                    <Image source={require("../Assets/qr.png")} style={{width: 100, height: 100}}/>
                                    <Text style={GlobalStyles.boldText}>QR Login</Text>
                                </TouchableOpacity>
                            </View>
                        </FadeInView>
                    : false }


                    {/* Username/Password Windows */}
                    {this.state.ScreenState === this.ScreenStateEnum.CredentialsWindow ?
                        <FadeInView>
                            <View style={{marginTop: "7%"}}>
                                <View style={styles.textInputContainer}>
                                    <TextInput style={styles.textInput} placeholder="Username" onChangeText={this._onUsernameUpdated} onSubmitEditing={this._onCredentialsEntered} placeholderTextColor={"grey"} autoFocus={true}/>
                                </View>
                                <View style={styles.textInputContainer}>
                                    <TextInput style={styles.textInput} placeholder="Password" onChangeText={this._onPasswordUpdated} onSubmitEditing={this._onCredentialsEntered} placeholderTextColor={"grey"} secureTextEntry={true}/>
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
                    <DropdownAlert style={{position: "absolute"}} ref={ref => (this.dropdown = ref)} closeInterval={5000}/>

                </View>
            </TouchableWithoutFeedback>
        );
    }
}

// --- Login Page Styles --- //
export const styles = StyleSheet.create({
    headerText: {
        fontFamily: "icpsr-font",
        fontSize: 70,
        fontWeight: 'bold',
        color: "white",
    },
    buttonContainer: {
        marginTop: 350,
        height: 140,
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
    usernameContainer: {
        position: "absolute",
        alignSelf: "center",
        marginTop: "15%",
    },
    textInputContainer: {
        margin: 20,
        padding: 5,
        borderWidth: 2,
        borderColor: "grey",
        borderRadius: 5,
    },
    textInput: {
        height: 40,
        padding: 10,
        fontSize: 20,
        color: "white",
    },
});
