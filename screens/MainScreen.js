import Expo from "expo";
import React, { Component } from "react";
import { Alert, AsyncStorage, Button, Image, Keyboard, Platform, StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback, StatusBar } from "react-native";
import { createStackNavigator } from "react-navigation"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import { GlobalStyles } from "../Styles.js"
import { FadeInView } from "../Animations.js"
import { delay, BUTTON_ACTIVE_OPACITY } from "../Global.js"


// - Constants - //
// Amount of time (milliseconds) the user has to enter back into the QR screen without reauthenticating.
const REAUTH_TIMER = 120 * 1000;

// The moderate scale value passed in for the Link Account/QR Login buttons.
// Increase this to make the buttons bigger on larger devices.
const MAIN_BUTTON_SCALE = 0.6;

// The moderate scale value for the Username/Password/Submit/Cancel buttons.
const LOGIN_BUTTON_SCALE = 0.2;


// --- Main Screen --- //
export default class MainScreen extends Component {
    // --- Instance Variables --- //
    // The current credentials entered in
    SubmittedUsername = "";
    SubmittedPassword = "";

    // Has the user recently authenticated?
    HasRecentlyAuthenticated = false;

    // Enum used for handling state
    static ScreenStateEnum = Object.freeze({ Neutral: {}, CredentialsWindow: {} });


    // --- Constructor --- //
    constructor(props){
        super(props)
        // React state
        this.state = {
            ScreenState: MainScreen.ScreenStateEnum.Neutral,
            LinkedUsername: null,
            LinkedPassword: null
        };
    }


    // --- On Component Mount --- //
    async componentDidMount(){
        // Check if there's an account linked to the app already.
        try{
            let linkedUsername = await AsyncStorage.getItem("@LinkedUsername");
            let linkedPassword = await AsyncStorage.getItem("@LinkedPassword");

            // Check the servers to verify that this username/password pair still matches.
            //TODO: Do networking stuff here

            // Set their state
            this.setState({ LinkedUsername: linkedUsername, LinkedPassword: linkedPassword });

            // Go straight to attempting a fingerprint authentication if there's a linked account already
            if(linkedUsername !== null && linkedPassword !== null && !this.HasRecentlyAuthenticated){
                await delay(500);
                this.attemptFingerprintAuthentication();
            } else {
                this.setState({ ScreenState: MainScreen.ScreenStateEnum.CredentialsWindow });
            }
        } catch(error){
            this.dropdown.alertWithType("error", "Error", "Error retriving credentials: " + error);
        }
    }


    // --- State machine related --- //
    // Transitions to the main screen state, clearing the info in the credentials window.
    toMainWindow = () => {
        this.SubmittedUsername = "";
        this.SubmittedPassword = "";
        this.setState({ ScreenState: MainScreen.ScreenStateEnum.Neutral });
    }

    // Transitions to the credentials window.
    toCredentialsWindow = () => {
        this.setState({ ScreenState: MainScreen.ScreenStateEnum.CredentialsWindow });
    }


    // --- Callbacks --- //
    // Called as the user types their user/pass.
    onUsernameUpdated = (text) => {
        this.SubmittedUsername = text;
    }
    onPasswordUpdated = (text) => {
        this.SubmittedPassword = text;
    }

    // TODO: All this stuff relating to the Linked Username/Password will probably need to be rewritten in the future when implementing actually logging in.
    // Called when the user submits their user/pass
    onCredentialsEntered = async () => {
        // Check the entered information for validity.
        if(this.SubmittedUsername === "" || this.SubmittedPassword === "") {
            this.dropdown.alertWithType("warn", "Missing Credentials", "Please enter both a username and password.");
            this.SubmittedPassword = "";
        }

        // Check the servers to see if the credentials are valid
        // TODO: Networking stuff goes here

        // On success, go back to the home screen.
        else{
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
                return { ScreenState: MainScreen.ScreenStateEnum.Neutral };
            });

            this.dropdown.alertWithType("success", "Success", "New Account linked!");
        }
    }

    // Attempts to authenticate the user's fingerprint.
    attemptFingerprintAuthentication = async () => {
        // Allow user to bypass this if they recently authenticated.
        if(this.HasRecentlyAuthenticated){
            this.goToQRScreen();
            return;
        }
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
                    this.HasRecentlyAuthenticated = true;
                    this.startAuthenticationTimeout();
                    this.goToQRScreen();
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


    // --- Other --- //
    // A timer that, after some time, sets HasRecentlyAuthenticated to false.
    // Note: Should never be 2 instances of this running at the same time.
    startAuthenticationTimeout = async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                this.HasRecentlyAuthenticated = false;
            }, REAUTH_TIMER);
        });
    }

    // Navigates us to the QR screen.
    goToQRScreen = () => {
        // TODO: Need to send an actual UserID here.
        this.props.navigation.navigate("QR", { userID: this.state.LinkedUsername });
    }


    // --- Render --- //
    render() {
        return (
            // Outermost view, don't have anything outside of this
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={GlobalStyles.background}>

                    <StatusBar barStyle="light-content"/>

                    {/* Title */}
                    <View style={[GlobalStyles.header, { height: verticalScale(100) }]}>
                        <Text style={styles.headerText} adjustsFontSizeToFit={true}>ICPSR</Text>
                    </View>

                    {/* Main Buttons */}
                    {this.state.ScreenState === MainScreen.ScreenStateEnum.Neutral ?
                        <FadeInView>
                            {this.state.LinkedUsername !== null ?
                                <View style={styles.usernameDisplayContainer}>
                                    <Text style={[GlobalStyles.boldText, { fontSize: moderateScale(30, 0.6) }]}>{this.state.LinkedUsername}</Text>
                                </View>
                            : false }

                            <View style={styles.mainButtonContainer}>
                                <TouchableOpacity onPress={this.toCredentialsWindow} style={styles.mainButton} activeOpacity={BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                    <Image source={require("../assets/key.png")} style={styles.icon}/>
                                    <Text style={[GlobalStyles.boldText, { fontSize: moderateScale(20, MAIN_BUTTON_SCALE) }]}>Link Account</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.attemptFingerprintAuthentication} style={styles.mainButton} activeOpacity={BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                    <Image source={require("../assets/qr.png")} style={styles.icon}/>
                                    <Text style={[GlobalStyles.boldText, { fontSize: moderateScale(20, MAIN_BUTTON_SCALE) }]}>QR Login</Text>
                                </TouchableOpacity>
                            </View>
                        </FadeInView>
                    : false }


                    {/* Username/Password Windows */}
                    {this.state.ScreenState === MainScreen.ScreenStateEnum.CredentialsWindow ?
                        <FadeInView>
                            <View style={{marginTop: "7%"}}>
                                <View style={styles.textInputContainer}>
                                    <TextInput style={styles.textInput} placeholder="Username" onChangeText={this.onUsernameUpdated} onSubmitEditing={this.onCredentialsEntered} placeholderTextColor={"grey"} autoFocus={true}/>
                                </View>
                                <View style={styles.textInputContainer}>
                                    <TextInput style={styles.textInput} placeholder="Password" onChangeText={this.onPasswordUpdated} onSubmitEditing={this.onCredentialsEntered} placeholderTextColor={"grey"} secureTextEntry={true}/>
                                </View>

                                <View style={{alignItems: "center", justifyContent: "center", margin: scale(30)}}>
                                    <TouchableOpacity onPress={this.onCredentialsEntered} style={styles.submitButton} activeOpacity={BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                        <Text style={[GlobalStyles.boldText, { fontSize: moderateScale(20, LOGIN_BUTTON_SCALE) }]}>Submit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.toMainWindow} style={{marginTop: moderateScale(30)}} activeOpacity={BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                        <Text style={[GlobalStyles.underlineText, { fontSize: moderateScale(18, LOGIN_BUTTON_SCALE) }]}>Cancel</Text>
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

    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
    };
}

// --- Main Page Styles --- //
export const styles = StyleSheet.create({
    headerText: {
        fontFamily: "Behatrice-Regular",
        fontSize: moderateScale(100),
        paddingLeft: 10,
        fontWeight: 'bold',
        color: "white",
    },
    usernameDisplayContainer: {
        position: "absolute",
        alignSelf: "center",
        marginTop: "15%",
    },
    mainButtonContainer: {
        marginTop: moderateScale(350),
        flexDirection: "row",
        justifyContent: "space-around"
    },
    mainButton: {
        backgroundColor: "teal",
        width: moderateScale(150, MAIN_BUTTON_SCALE),
        height: moderateScale(150, MAIN_BUTTON_SCALE),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: moderateScale(30),
    },
    icon: {
        width: moderateScale(100, MAIN_BUTTON_SCALE),
        height: moderateScale(100, MAIN_BUTTON_SCALE)
    },
    submitButton: {
        backgroundColor: "teal",
        width: moderateScale(200, LOGIN_BUTTON_SCALE),
        height: moderateScale(60, LOGIN_BUTTON_SCALE),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scale(30),
    },
    textInputContainer: {
        margin: moderateScale(20, LOGIN_BUTTON_SCALE),
        padding: moderateScale(5, LOGIN_BUTTON_SCALE),
        borderWidth: moderateScale(2, LOGIN_BUTTON_SCALE),
        borderColor: "grey",
        borderRadius: moderateScale(5, LOGIN_BUTTON_SCALE),
    },
    textInput: {
        height: moderateScale(40, LOGIN_BUTTON_SCALE),
        padding: moderateScale(10, LOGIN_BUTTON_SCALE),
        fontSize: moderateScale(20, LOGIN_BUTTON_SCALE),
        color: "white",
    },
});
