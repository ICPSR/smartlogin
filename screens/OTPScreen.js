import Expo from "expo";
import React, { Component } from "react";
import { AsyncStorage, View, StyleSheet, StatusBar, Text } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import { StackActions, NavigationActions } from 'react-navigation';
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
        // TODO: Need to know how to generate this code.


        // TODO: Make a GET fetch request right here, and have the server respond when the user enters the code???

    }

    // Called when the user successfully entered the OTP to the website
    onVerified = async () => {
        // Mark this device as one with a linked account, used to start app on main screen instead.
        try{
            await AsyncStorage.setItem("@AccountLinked", "true");
        } catch(error) {
            console.log("Error saving data: " + error);
        }
        this.setState({currentState: OTPScreen.StateEnum.Verified});
    }

    // Called after the user presses the MoveToMain button
    onDone = () => {
        // Recreate navigation stack.
        const reset = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Main" })]
        });
        this.props.navigation.dispatch(reset);
    }


    // --- Render --- //
    render() {
        let Button = Global.Button;

        return (
            <View style={Global.Styles.background}>
                <StatusBar barStyle="light-content"/>
                {/* Verifying */}
                {this.state.currentState === OTPScreen.StateEnum.Verifying ?
                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(100) }}>
                        <Text style={Global.Styles.boldText}>One Last Step...</Text>

                        <Text style={Global.Styles.text}>{"To verify it's really you, please enter the code below into the ICPSR website:"}</Text>
                        <Text style={[Global.Styles.text, {fontSize: moderateScale(25), marginTop: moderateScale(100)}]}>{this.OTP}</Text>

                        <View style={{marginTop: moderateScale(50)}}>
                            <Button onPress={this.onVerified} text="DEBUG: Skip"/>
                        </View>
                    </View>
                : false }
                {/* Verified */}
                {this.state.currentState === OTPScreen.StateEnum.Verified ?
                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: moderateScale(100) }}>
                        <FadeInView duration="1000">
                            <Text style={Global.Styles.boldText}>All Done!</Text>
                        </FadeInView>
                        <FadeInView duration="500" delay="1000">
                            <Text style={[Global.Styles.text, {marginTop: moderateScale(30)}]}>
                                Your device is now linked with your ICPSR account!
                            </Text>
                            <Text style={[Global.Styles.text, {marginTop: moderateScale(10)}]}>
                                To login using SmartLogin, simply select QR Scan on the main app screen and scan the code on the MyData login page.
                            </Text>
                        </FadeInView>
                        <FadeInView duration="500" delay="2000" style={{marginTop: moderateScale(50)}}>
                            <Button onPress={this.onDone} text="Finished"/>
                        </FadeInView>
                    </View>
                : false }

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
        backgroundColor: "teal",
        width: moderateScale(200, .2),
        height: moderateScale(60, .2),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: scale(30),
    },
});
