import Expo from "expo";
import React, { Component } from "react";
import { View, StyleSheet, StatusBar, Text } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import { GlobalStyles } from "../Styles.js";
import { FadeInView } from "../Animations.js";
import * as Global from "../Global.js";


const CONTINUE_BUTTON_SCALE = 0.2;

// --- Intro Screen --- //
export default class IntroScreen extends Component {
    // Enum used for handling state
    static StateEnum = Object.freeze({ First: {}, Second: {} })

    // --- Constructor --- //
    constructor(props){
        super(props);
        this.state = {
            currentState: IntroScreen.StateEnum.First
        }
    }

    // Moves to the next state, or to the QR screen.
    onNext = () => {
        if(this.state.currentState === IntroScreen.StateEnum.First){
            this.setState({currentState: IntroScreen.StateEnum.Second});
        } else if(this.state.currentState === IntroScreen.StateEnum.Second){
            this.props.navigation.navigate("QR", { title: "Scan QR from the activation page", screenToGoTo: "OTP", URL: "" });
        }
    }

    // --- Render --- //
    render() {
        let TouchableRounded = Global.TouchableRounded;

        return(
            <View style={GlobalStyles.background}>
                <StatusBar barStyle="light-content"/>
                {/* First State */}
                {this.state.currentState === IntroScreen.StateEnum.First ?
                    <FadeInView duration="1500">
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(100) }}>
                            <Text style={GlobalStyles.boldText}>Welcome</Text>
                            <Text style={GlobalStyles.boldText}>to</Text>
                            <FadeInView duration="1500" delay="1500">
                                <Text style={[GlobalStyles.boldText, {fontSize: moderateScale(25)}]}>ICPSR SmartLogin</Text>
                            </FadeInView>

                            <FadeInView duration="1000" delay="3000">
                                <TouchableRounded onPress={this.onNext} style={[styles.continueButton, {marginTop: moderateScale(200)}]} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                    <Text style={[GlobalStyles.boldText, {fontSize: moderateScale(20, CONTINUE_BUTTON_SCALE)}]}>Continue</Text>
                                </TouchableRounded>
                            </FadeInView>
                        </View>
                    </FadeInView>
                : false }
                {/* Second State */}
                {this.state.currentState === IntroScreen.StateEnum.Second ?
                    <FadeInView duration="1000">
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(70) }}>
                            <Text style={GlobalStyles.text}>To add this device to your account, login to your ICPSR account on your computer and click</Text>
                            <Text style={GlobalStyles.underlineText}>Register a Device for SmartLogin</Text>
                            <Text style={[GlobalStyles.text, {marginTop: moderateScale(170)}]}>A QR code should be displayed.</Text>
                            <Text style={GlobalStyles.text}>Please scan this code</Text>

                            <TouchableRounded onPress={this.onNext} style={[styles.continueButton, {marginTop: moderateScale(50)}]} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                <Text style={[GlobalStyles.boldText, {fontSize: moderateScale(20, CONTINUE_BUTTON_SCALE)}]}>QR Scan</Text>
                            </TouchableRounded>
                        </View>
                    </FadeInView>
                : false }

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
    continueButton: {
        backgroundColor: "teal",
        width: moderateScale(200, CONTINUE_BUTTON_SCALE),
        height: moderateScale(60, CONTINUE_BUTTON_SCALE),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scale(30),
    },
});
