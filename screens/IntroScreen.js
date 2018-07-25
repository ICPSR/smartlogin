import Expo from "expo";
import React, { Component } from "react";
import { View, StyleSheet, StatusBar, Text } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { StackNavigator } from "react-navigation";
import DropdownAlert from 'react-native-dropdownalert';
import Touchable from 'react-native-platform-touchable';
import { FadeInView } from "../Animations.js";
import * as Global from "../Global.js";

// --- Intro Screen --- //
export default class IntroScreen extends Component {
    // Enum used for handling state
    static StateEnum = Object.freeze({ First: {}, Second: {} })

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
            this.props.navigation.navigate("QR", { title: "Scan QR from the activation page", qrCallback: this.onQRRead });
        }
    }

    // Goes back a screen.
    onBack = () => {
        this.props.navigation.goBack();
    }

    // Callback for the QR screen when a code has been read
    onQRRead = async (code) => {
        // TODO: This should handle some different stuff.

        if(isUUID(code.data, UUID_VERSION)){
            try{
                let URL = "http://192.168.145.106:8080/pcms/mydata/smartlogin/authorize/";
                console.log("Sending user info to: " + URL + userID + "/" + code.data);
                let response = await Global.fetchWithTimeout(URL + userID + "/" + code.data, {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sessionID: code.data,
                        userId: userID
                    }),
                });
                console.log("Response Recieved:");
                console.log(response);
                // On Success
                if(response.ok){
                    this.dropdown.alertWithType("success", "Success!", "Successfully read.");
                    await Global.delay(2000);
                    this.props.navigation.navigate("OTP", { response: response });
                } else {
                    throw new Error("Network error: Status - " + response.status);
                }
            } catch(error) {
                this.dropdown.alertWithType("error", "Try Again - Network Error", "Something went wrong! Please check your internet connection and try again.");
                console.log("Network Error Message: " + error);
                await Global.delay(2000);
            }
        } else {
            this.dropdown.alertWithType("error", "Try Again - Bad QR Code", "The QR code read was not from the ICPSR website's activation page.");
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
                    <FadeInView duration="1500">
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(100) }}>
                            <Text style={Global.Styles.boldText}>Welcome</Text>
                            <Text style={Global.Styles.boldText}>to</Text>
                            <FadeInView duration="1500" delay="1500">
                                <Text style={[Global.Styles.boldText, {fontSize: moderateScale(25)}]}>ICPSR SmartLogin</Text>
                            </FadeInView>

                            <FadeInView duration="1000" delay="3000" style={{marginTop: moderateScale(200)}}>
                                <Button onPress={this.onNext} text="Continue"/>
                            </FadeInView>
                        </View>
                    </FadeInView>
                : null }
                {/* Second State */}
                { this.state.currentState === IntroScreen.StateEnum.Second ?
                    <FadeInView duration="1000">
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(60) }}>
                            <Text style={Global.Styles.text}>To add this device to an account, login to your ICPSR account on your computer and click:</Text>
                            <Text style={[Global.Styles.underlineText, { color: Global.HighlightColor_2 }]}>Register a Device for SmartLogin</Text>
                            <Text style={[Global.Styles.text, {marginTop: moderateScale(175)}]}>A QR code should be displayed.</Text>
                            <Text style={Global.Styles.text}>Please scan this code.</Text>

                            <View style={{ marginTop: moderateScale(40) }}>
                                <Button onPress={this.onNext} text="QR Scan"/>
                            </View>
                        </View>

                        { backButton ?
                            <Touchable onPress={this.onBack} style={{ position: "absolute", marginTop: verticalScale(620), marginLeft: moderateScale(15) }} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                <Text style={Global.Styles.underlineText}>Back</Text>
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

});
