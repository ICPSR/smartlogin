import Expo from "expo";
import React, { Component } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, View, StatusBar } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import isUUID from "validator/lib/isUUID";
import { FadeInView } from "../Animations.js";
import * as Global from "../Global.js";

// - Constants - //
// Amount of time (milliseconds) the user has to enter back into the QR screen without reauthenticating.
const REAUTH_TIMER = 120 * 1000;

// The moderate scale value passed in for the Link Account/QR Login buttons.
// Increase this to make the buttons bigger on larger devices.
const HOME_BUTTON_SCALE = 0.6;


// --- Home Screen --- //
export default class HomeScreen extends Component {
    // --- Instance Variables --- //
    // Has the user recently authenticated?
    HasRecentlyAuthenticated = false;


    // --- Callbacks --- //
    // Attempts to authenticate the user's fingerprint.
    attemptFingerprintAuthentication = async () => {
        // Allow user to bypass this if they recently authenticated.
        if(this.HasRecentlyAuthenticated || Global.DEBUG_SKIP_FINGERPRINT_AUTH){
            this.goToQRScreen_Login();
            return;
        }
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
                            { text: "Cancel", onPress: () => {Expo.Fingerprint.cancelAuthenticate(); this.dropdown.alertWithType("info", "hi", "onCancel"); }},
                        ],
                        { onDismiss: () => {Expo.Fingerprint.cancelAuthenticate(); this.dropdown.alertWithType("info", "hi", "onDismiss"); } }
                    )
                );
            }
            if(authenticated.success){
                this.HasRecentlyAuthenticated = true;
                this.startAuthenticationTimeout();
                this.goToQRScreen_Login();
            }
        } else if(!hasHardware) {
            this.dropdown.alertWithType("error", "Incompatible Device", "Current device does not have the hardware to use biometric scanning.");
        } else {
            this.dropdown.alertWithType("warn", "Not Enrolled", "Please activate biometric scanning on your device to continue.");
        }
    }

    // Callback for the QR screen when a code has been read
    async onQRRead(caller, code){
        if(isUUID(code.data, Global.UUID_VERSION)){
            try{
                let URL = "http://192.168.145.132:8080/passport/mydata/smartlogin/authorize/" + "example@umich.edu" + "/" + code.data;
                caller.dropdown.alertWithType("info", "Sending", "Sending request...");
                console.log("Sending user info to: " + URL);
                let response = await fetch(URL, {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sessionID: code.data,
                        userId: "example@umich.edu"
                    }),
                });
                console.log("Response Recieved:");
                console.log(response);
                // On Success
                if(response.ok){
                    caller.dropdown.alertWithType("success", "Success!", "Successfully logged in!");
                    await Global.delay(3000);
                    caller.props.navigation.goBack();
                } else {
                    throw new Error("Network error: Status - " + response.status);
                }
            } catch(error) {
                caller.dropdown.alertWithType("error", "Error!", error.message);
                await Global.delay(2000);
            }
        } else {
            caller.dropdown.alertWithType("error", "Try Again - Bad QR Code", "The QR code read was not from the ICPSR website's login page.");
            await Global.delay(2000);
        }
    }

    // --- Other --- //
    // A timer that, after some time, sets HasRecentlyAuthenticated to false.
    // Note: Should never be 2 instances of this running at the same time.
    // Note: Causes a warning for Android, as timers don't fire while in the background.
    //       Does not seem to affect correctness in this case however.
    startAuthenticationTimeout = async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                this.HasRecentlyAuthenticated = false;
            }, REAUTH_TIMER);
        });
    }

    // Navigates to the QR screen.
    goToQRScreen_Activation = () => {
        this.props.navigation.navigate("Intro", { state: "Second", backButton: true });
    }
    goToQRScreen_Login = () => {
        this.props.navigation.navigate("QR", { title: "Scan QR from the ICPSR login page.", qrCallback: this.onQRRead });
    }


    // --- Render --- //
    render() {
        let TouchableRounded = Global.TouchableRounded;
        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle="light-content"/>

                {/* Title */}
                <View style={Global.Styles.header}>
                    <Image source={require("../assets/icpsr-logo.png")} style={styles.logo}/>
                </View>

                <ScrollView style={Global.Styles.background}>
                    {/* Home Buttons */}
                    <FadeInView>
                        <View style={styles.homeButtonContainer}>
                            <TouchableRounded onPress={this.goToQRScreen_Activation} style={styles.homeButton} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require("../assets/key.png")} style={styles.icon}/>
                                    <Text style={[Global.Styles.boldText, { fontSize: moderateScale(20, HOME_BUTTON_SCALE) }]}>Link Account</Text>
                                </View>
                            </TouchableRounded>
                            <TouchableRounded onPress={this.attemptFingerprintAuthentication} style={styles.homeButton} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image source={require("../assets/qr.png")} style={styles.icon}/>
                                    <Text style={[Global.Styles.boldText, { fontSize: moderateScale(20, HOME_BUTTON_SCALE) }]}>QR Login</Text>
                                </View>
                            </TouchableRounded>
                        </View>
                    </FadeInView>

                    {/* Dropdown Alerts */}
                    <DropdownAlert ref={ref => (this.dropdown = ref)}/>
                </ScrollView>
            </View>
        );
    }

    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
    };
}

// --- Home Page Styles --- //
export const styles = StyleSheet.create({
    logo: {
        width: moderateScale(200),
        height: moderateScale(50),
        margin: 15,
        resizeMode: "contain",
    },
    homeButtonContainer: {
        marginTop: moderateScale(370, 0.4),
        flexDirection: "row",
        justifyContent: "space-around"
    },
    homeButton: {
        backgroundColor: Global.ForegroundColor,
        width: moderateScale(150, HOME_BUTTON_SCALE),
        height: moderateScale(150, HOME_BUTTON_SCALE),
        borderRadius: moderateScale(30),
    },
    icon: {
        width: moderateScale(100, HOME_BUTTON_SCALE),
        height: moderateScale(100, HOME_BUTTON_SCALE)
    },
});
