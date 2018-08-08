import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Touchable from 'react-native-platform-touchable';
import Expo, { Constants } from "expo";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Contains a set of useful components, functions, and constants used by the project

// Constants //
// Opacity of buttons when they're pressed down.
export const BUTTON_ACTIVE_OPACITY = 0.6;

// UUID version used by ICPSR website
const UUID_VERSION = 4;

// Debug Only buttons used for development.
// Turns on and off certain buttons/components.
export const DEBUG_COMPONENTS = true;

// Skips fingerprint authentication.
export const DEBUG_SKIP_FINGERPRINT_AUTH = true;

// Sets the @AccountLinked variable to false on startup.
export const DEBUG_FORCE_NO_ACCOUNT = false;

// Allows you to send a UUID manually as if you read a QR code.
// Only works when you press the Debug: Manual QR in the QR screen.
export const DEBUG_QR_UUID = "832e1a5c-11ea-4938-becd-6d129d65a926";

// Components //
// A rounded button component that automatically chooses between TouchableOpacity for iOS and TouchableNativeFeedback for Android
// Wrapper around Touchable used to clean up the weird boilerplate due to TouchableNativeFeedback not being able to handle rounded buttons
// Requires there to be only a single child.
export class TouchableRounded extends Component {
    render() {
        if(Platform.OS === "ios"){
            return (
                <Touchable {...this.props}>
                    {this.props.children}
                </Touchable>
            );
        } else {
            let radius = StyleSheet.flatten(this.props.style).borderRadius;
            return (
                <View style={{ borderRadius: radius, overflow: 'hidden' }}>
                    <Touchable {...this.props} foreground={Touchable.Ripple("#fff", true)}>
                        {this.props.children}
                    </Touchable>
                </View>
            );
        }
    }
}

// Simple Button component with text inside that uses TouchableRounded
// Props: onPress -> callback when button is pressed. text -> text to display on button
export class Button extends Component {
    render() {
        return(
            <TouchableRounded activeOpacity={BUTTON_ACTIVE_OPACITY} underlayColor="white" style={Styles.button} {...this.props}>
                <Text style={[Styles.boldText, {fontSize: moderateScale(20, .2)}]}>{this.props.text}</Text>
            </TouchableRounded>
        );
    }
}



// Functions //
// Simple delay function for timing
export function delay(time) {
    return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(), time);
    });
}


// Wrapper for the fetch() call that provides timeout functionality.
export async function fetchWithTimeout(URL, init){
    const TIMEOUT = 5 * 1000;   // timeout in milliseconds
    let timer;

    // Run both promises simultaneously.
    let result = await Promise.race([
        // Makes the fetch request and waits for it.
        new Promise(async (resolve, reject) => {
            let response = await fetch(URL, init);
            resolve(response);
        }),
        // Aborts the fetch when the timer finishes.
        new Promise((resolve, reject) => {
            timer = setTimeout(() => {
                // TODO: When react native updates their fetch api, uncomment this.
                //abortController.abort();
                reject(new Error("Request timed out"));
            }, TIMEOUT);
        })
    ]);

    // Cleans the timer up if it's still running.
    clearTimeout(timer);

    // On a successful response, return the promised object.
    return result;
}


// Styles //
export const BackgroundColor = "#005050";   // Midnight Green / Eagle Green
export const ForegroundColor = "#008080";   // Teal
export const TextColor = "#ffffff";         // White
export const HighlightColor_1 = "#00a9a5";  // Persian Green
export const HighlightColor_2 = "#8fbfe0";  // Dark Sky Blue
export const HighlightColor_3 = "#20bf55";  // Clover Green
export const HighlightColor_4 = "#50514f";  // Dark Liver (Dark Highlight)

export const Styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: BackgroundColor,
    },
    header: {
        backgroundColor: ForegroundColor,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
    },
    text: {
        fontSize: moderateScale(18),
        padding: moderateScale(10),
        color: TextColor,
    },
    boldText: {
        fontSize: moderateScale(20),
        padding: moderateScale(10),
        color: TextColor,
        fontWeight: 'bold',
    },
    underlineText: {
        fontSize: moderateScale(18),
        padding: moderateScale(10),
        color: TextColor,
        textDecorationLine: "underline",
    },
    button: {
        backgroundColor: ForegroundColor,
        minWidth: moderateScale(200, 0.2),
        height: moderateScale(60, 0.2),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: moderateScale(30, 0.2),
    },
});
