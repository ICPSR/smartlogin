import Expo from "expo";
import React, { Component } from "react";
import { Alert, AsyncStorage, View, StyleSheet, StatusBar, Text } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import { StackActions, NavigationActions } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';
import { FadeInView } from "../Animations.js";
import * as Global from "../Global.js";


// --- OTP Screen --- //
export default class OTPScreen extends Component {
    // The OTP to display.
    OTP = "XXX-XXX";

    // Enum used for handling state
    static StateEnum = Object.freeze({ Verifying: {}, Verified: {} })

    // --- Constructor --- //
    constructor(props){
        super(props);
        this.state = {
            currentState: OTPScreen.StateEnum.Verifying
        }
    }

    // --- OnComponentMount --- //
    onComponentMount(){
        let response = navigation.getParam("response", null);
        if(response === null) console.log("No Response Recieved");

        // TODO: Get code from response.
        OTP = response.ok;


        // TODO: Make a GET fetch request right here, and have the server respond when the user enters the code???

    }

    // Called when the user successfully entered the OTP to the website
    onVerified = async () => {
        // Mark this device as one with a linked account, used to start app on home screen instead.
        try{
            await AsyncStorage.setItem("@AccountLinked", "true");
        } catch(error) {
            console.log("Error saving data: " + error);
        }
        this.setState({currentState: OTPScreen.StateEnum.Verified});
    }

    // Called after the user presses the Finished button
    onDone = () => {
        // Recreate navigation stack.
        const reset = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Home" })]
        });
        this.props.navigation.dispatch(reset);
    }

    // Called if the user presses the cancel button here.
    onCancel = () => {
        Alert.alert("Cancel Registration", "Are you sure you want to cancel the Smart Login activation process?",
        [
            {text: "Yes", onPress: () => { this.props.navigation.popToTop(); }},
            {text: "Nevermind", onPress: () => {  }, style: "cancel"},
        ]
        );
    }


    // --- Render --- //
    render() {
        let Button = Global.Button;

        return (
            <View style={Global.Styles.background}>
                <StatusBar barStyle="light-content"/>
                {/* Verifying */}
                { this.state.currentState === OTPScreen.StateEnum.Verifying ?
                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(100) }}>
                        <Text style={Global.Styles.boldText}>One Last Step...</Text>

                        <Text style={Global.Styles.text}>{"To verify it's really you, please enter the code below into the ICPSR website:"}</Text>
                        <Text style={[Global.Styles.text, {fontSize: moderateScale(25), marginTop: moderateScale(100)}]}>{this.OTP}</Text>

                        <Touchable onPress={this.onCancel} style={{ marginTop: moderateScale(100) }} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                            <Text style={Global.Styles.underlineText}>Cancel</Text>
                        </Touchable>

                        { Global.DEBUG_COMPONENTS ?
                            <View style={{marginTop: moderateScale(50)}}>
                                <Button onPress={this.onVerified} text="DEBUG: Skip"/>
                            </View>
                        : null }
                    </View>
                : null }
                {/* Verified */}
                { this.state.currentState === OTPScreen.StateEnum.Verified ?
                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(100) }}>
                        <FadeInView duration="1000">
                            <Text style={Global.Styles.boldText}>All Done!</Text>
                        </FadeInView>
                        <FadeInView duration="500" delay="1000">
                            <Text style={[Global.Styles.text, {marginTop: moderateScale(30)}]}>
                                Your device is now linked with your ICPSR account!
                            </Text>
                            <Text style={[Global.Styles.text, {marginTop: moderateScale(10)}]}>
                                {"To login using SmartLogin, simply select "}
                                <Text style={[Global.Styles.boldText, {fontSize: moderateScale(18), color: Global.HighlightColor_1}]}>
                                    QR Login
                                </Text>
                                {" on the home screen and scan the code on the MyData login page."}
                            </Text>
                        </FadeInView>
                        <FadeInView duration="500" delay="2000" style={{marginTop: moderateScale(50)}}>
                            <Button onPress={this.onDone} text="Finished"/>
                        </FadeInView>
                    </View>
                : null }

            </View>
        );
    }

    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
        gesturesEnabled: false,
    };
}


// --- OTP Page Styles --- //
export const styles = StyleSheet.create({
    continueButton: {
        backgroundColor: Global.ForegroundColor,
        width: moderateScale(200, .2),
        height: moderateScale(60, .2),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scale(30),
    },
});
