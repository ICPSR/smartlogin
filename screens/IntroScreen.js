import Expo from "expo";
import React, { Component } from "react";
import { View, Platform, StyleSheet, StatusBar, Text } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { StackNavigator } from "react-navigation";
import DropdownAlert from 'react-native-dropdownalert';
import Touchable from 'react-native-platform-touchable';
import isUUID from "validator/lib/isUUID";
import { FadeInView } from "../Animations.js";
import * as Global from "../Global.js";

// --- Intro Screen --- //
export default class IntroScreen extends Component {
    // Enum used for handling state
    static StateEnum = Object.freeze({ First: {}, Second: {}, Third: {} })

    // --- Constructor --- //
    constructor(props){
        super(props);
        let state = this.props.navigation.getParam("state", "First");
        this.state = {
            currentState: IntroScreen.StateEnum[state]
        }
    }

    // Moves to the next state, or to the QR screen.
    onNext = () => {
        if(this.state.currentState === IntroScreen.StateEnum.First){
            this.setState({currentState: IntroScreen.StateEnum.Second});
        } else if(this.state.currentState === IntroScreen.StateEnum.Second){
            this.setState({currentState: IntroScreen.StateEnum.Third});
        } else if(this.state.currentState === IntroScreen.StateEnum.Third){
            this.props.navigation.navigate("QR", { title: "Scan QR from the activation page", qrCallback: this.onQRRead });
        }
    }

    // Goes back a screen.
    onBack = () => {
        this.props.navigation.goBack();
    }

    // Callback for the QR screen when a code has been read
    async onQRRead(caller, code){
        // TODO: This should handle some different stuff.
        if(isUUID(code.data, Global.UUID_VERSION)){
            try{
                let URL = Global.URL_STUB + "/mydata/smartlogin/activation/activate/device-post";
                caller.dropdown.alertWithType("info", "Sending", "Sending request...");
                console.log("Sending user info to: " + URL);
                let response = await fetch(URL, {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sessionID: code.data,
                        os: Platform.OS,
                        version: Platform.Version.toString(),
                    }),
                });
                console.log("Response Recieved:");
                console.log(response);
                // On Success
                if(response.ok){
                    // Extract key and place in secure storage.
                    let respText = await response.text();
                    let respJSON = JSON.parse(respText);
                    console.log(respJSON);
                    await Expo.SecureStore.setItemAsync("Key", respJSON.key, { keychainAccessible: Expo.SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
                    // Display success message and continue.
                    caller.dropdown.alertWithType("success", "Success!", "Successfully connected!");
                    await Global.delay(3000);
                    caller.props.navigation.navigate("OTP", { code: respJSON.confirmCode });
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


    // --- Render --- //
    render() {
        let Button = Global.Button;
        let backButton = this.props.navigation.getParam("backButton", "false");

        return(
            <View style={Global.Styles.background}>
                <StatusBar barStyle="light-content"/>
                {/* First State */}
                { this.state.currentState === IntroScreen.StateEnum.First ?
                    <View style={{ marginTop: moderateScale(80) }}>
                        <FadeInView duration="1500" style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={Global.Styles.boldText}>Welcome</Text>
                            <Text style={Global.Styles.boldText}>to</Text>
                        </FadeInView>
                        <FadeInView duration="1500" delay="1500" style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(20) }}>
                            <Text style={[Global.Styles.boldText, {fontSize: moderateScale(32)}]}>SmartLogin</Text>
                            <Text style={[Global.Styles.boldText, {fontSize: moderateScale(16)}]}>for ICPSR</Text>
                        </FadeInView>
                        <FadeInView duration="1000" delay="3000" style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(200) }}>
                            <Touchable onPress={this.onNext} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                <Text style={styles.nextText}>Continue</Text>
                            </Touchable>
                        </FadeInView>
                    </View>
                : null }
                {/* Second State */}
                { this.state.currentState === IntroScreen.StateEnum.Second ?
                    <FadeInView duration="1500">
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(100) }}>
                            <Text style={Global.Styles.text}>SmartLogin is a new, easy way to log into your MyData account for ICPSR using your mobile device.</Text>
                            <Text style={Global.Styles.text}>After set up, all you have to do is scan the QR code on the login page and you're in!</Text>
                            <Touchable onPress={this.onNext} style={{ marginTop: verticalScale(200) }} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                <Text style={styles.nextText}>Let's get started</Text>
                            </Touchable>
                        </View>
                    </FadeInView>
                : null }
                {/* Third State */}
                { this.state.currentState === IntroScreen.StateEnum.Third ?
                    <FadeInView duration="1000" style={{flex: 1}}>
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(60) }}>
                            <Text style={Global.Styles.text}>To add this device to an account, login to your ICPSR account on your computer and click the link:</Text>
                            <Text style={Global.Styles.underlineText}>Register a Device for SmartLogin</Text>
                            <Text style={[Global.Styles.text, { marginTop: moderateScale(175) }]}>A QR code should be displayed.</Text>
                            <Text style={Global.Styles.text}>Please scan this code.</Text>
                            <View style={{ marginTop: moderateScale(40) }}>
                                <Button onPress={this.onNext} text="QR Scan"/>
                            </View>
                        </View>
                        { backButton !== "false" ?
                            <Touchable onPress={this.onBack} style={{ position: "absolute", marginTop: verticalScale(620), marginLeft: moderateScale(15) }} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                <Text style={styles.nextText}>Back</Text>
                            </Touchable>
                        : null }
                    </FadeInView>
                : null }
            </View>
        );
    }

    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
    };
}


// --- Intro Page Styles --- //
export const styles = StyleSheet.create({
    nextText: {
        ...StyleSheet.flatten(Global.Styles.underlineText),
        fontSize: moderateScale(22),
        color: Global.HighlightColor_1,
    },
});
