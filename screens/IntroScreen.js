import Expo from "expo";
import React, { Component } from "react";
import { View, StyleSheet, StatusBar, Text } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { StackNavigator } from "react-navigation";
import DropdownAlert from 'react-native-dropdownalert';
import Touchable from 'react-native-platform-touchable';
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
            this.props.navigation.navigate("QR", { title: "Scan QR from the activation page", success: "Successfully read.", screenToGoTo: "OTP", URL: "" });
        }
    }

    onBack = () => {
        this.props.navigation.goBack();
    }

    // --- Render --- //
    render() {
        let Button = Global.Button;
        let backButton = this.props.navigation.getParam("backButton", "false");

        return(
            <View style={Global.Styles.background}>
                <StatusBar barStyle="light-content"/>
                {/* First State */}
                {this.state.currentState === IntroScreen.StateEnum.First ?
                    <FadeInView duration="1500">
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(100) }}>
                            <Text style={Global.Styles.boldText}>Welcome</Text>
                            <Text style={Global.Styles.boldText}>to</Text>
                            <FadeInView duration="1500" delay="1500">
                                <Text style={[Global.Styles.boldText, {fontSize: moderateScale(25)}]}>ICPSR SmartLogin</Text>
                            </FadeInView>

                            <FadeInView duration="1000" delay="3000">
                                <Button onPress={this.onNext} style={{marginTop: moderateScale(200)}} text="Continue"/>
                            </FadeInView>
                        </View>
                    </FadeInView>
                : false }
                {/* Second State */}
                {this.state.currentState === IntroScreen.StateEnum.Second ?
                    <FadeInView duration="1000">
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(70) }}>
                            <Text style={Global.Styles.text}>To add this device to an account, login to your ICPSR account on your computer and click</Text>
                            <Text style={Global.Styles.underlineText}>Register a Device for SmartLogin</Text>
                            <Text style={[Global.Styles.text, {marginTop: moderateScale(165)}]}>A QR code should be displayed.</Text>
                            <Text style={Global.Styles.text}>Please scan this code</Text>

                            <Button onPress={this.onNext} style={{marginTop: moderateScale(50)}} text="QR Scan"/>
                        </View>

                        {backButton === "true" ?
                            <Touchable onPress={this.onBack} style={{ position: "absolute", marginTop: verticalScale(600), marginLeft: moderateScale(15) }} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                                <Text style={Global.Styles.underlineText}>Back</Text>
                            </Touchable>
                        : false }
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