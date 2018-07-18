import Expo from "expo";
import React, { Component } from "react";
import { Alert, Image, Platform, StyleSheet, Text, TextInput, View, StatusBar } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import { FadeInView } from "../Animations.js";
import * as Global from "../Global.js";

// - Constants - //
// Amount of time (milliseconds) the user has to enter back into the QR screen without reauthenticating.
const REAUTH_TIMER = 120 * 1000;

// The moderate scale value passed in for the Link Account/QR Login buttons.
// Increase this to make the buttons bigger on larger devices.
const MAIN_BUTTON_SCALE = 0.6;



// --- Main Screen --- //
export default class MainScreen extends Component {
    // --- Instance Variables --- //
    // Has the user recently authenticated?
    HasRecentlyAuthenticated = false;


    // --- Callbacks --- //
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
    goToQRScreen_Login = () => {
        this.props.navigation.navigate("QR", { title: "Scan QR from the ICPSR login page.", success: "Successfully logged in!", screenToGoTo: "", URL: "http://192.168.145.106:8080/pcms/mydata/smartlogin/authorize/" });
    }
    goToQRScreen_Activation = () => {
        this.props.navigation.navigate("QR", { title: "Scan QR from the activation page", success: "Successfully read.", screenToGoTo: "OTP", URL: "" });
    }


    // --- Render --- //
    render() {
        let TouchableRounded = Global.TouchableRounded;
        return (
            <View style={Global.Styles.background}>
                <StatusBar barStyle="light-content"/>

                {/* Title */}
                <View style={[Global.Styles.header, { height: verticalScale(100) }]}>
                    <Text style={styles.headerText} adjustsFontSizeToFit={true}>ICPSR</Text>
                </View>

                {/* Email Display + Main Buttons */}
                <FadeInView>
                    <View style={styles.mainButtonContainer}>
                        <TouchableRounded onPress={this.goToQRScreen_Activation} style={styles.mainButton} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Image source={require("../assets/key.png")} style={styles.icon}/>
                                <Text style={[Global.Styles.boldText, { fontSize: moderateScale(20, MAIN_BUTTON_SCALE) }]}>Link Account</Text>
                            </View>
                        </TouchableRounded>
                        <TouchableRounded onPress={this.attemptFingerprintAuthentication} style={styles.mainButton} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Image source={require("../assets/qr.png")} style={styles.icon}/>
                                <Text style={[Global.Styles.boldText, { fontSize: moderateScale(20, MAIN_BUTTON_SCALE) }]}>QR Login</Text>
                            </View>
                        </TouchableRounded>
                    </View>
                </FadeInView>

                {/* Dropdown Alerts */}
                <DropdownAlert ref={ref => (this.dropdown = ref)}/>
            </View>
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
    mainButtonContainer: {
        marginTop: moderateScale(350, 0.4),
        flexDirection: "row",
        justifyContent: "space-around"
    },
    mainButton: {
        backgroundColor: "teal",
        width: moderateScale(150, MAIN_BUTTON_SCALE),
        height: moderateScale(150, MAIN_BUTTON_SCALE),
        borderRadius: moderateScale(30),
    },
    icon: {
        width: moderateScale(100, MAIN_BUTTON_SCALE),
        height: moderateScale(100, MAIN_BUTTON_SCALE)
    },
});
