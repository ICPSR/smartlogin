import Expo, { Camera } from "expo";
import React, { Component } from "react";
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar } from "react-native";
import { StackNavigator } from "react-navigation";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import Touchable from 'react-native-platform-touchable';
import isUUID from "validator/lib/isUUID";
import * as Global from "../Global.js";

// - Constants - //
// UUID version used by ICPSR website
const UUID_VERSION = 4;

// Shortcut -> makes any qr read valid and continues, makes no POST request.
const DEBUG_SHORTCUT_QR_READ = true;

// --- QR Screen --- //
export default class QRScreen extends Component{
    // --- Instance Variables --- //
    // The text on the header.
    title = "";

    // The screen to navigate to after reading the QR screen.
    // Calls navigation.goBack() if this is the empty string.
    screenToGoTo = "";

    // The URL pattern used.
    URL = "";

    // Are we in the middle of processing a QR scan?
    isProcessingQR = false;

    // --- Constructor --- //
    constructor(props){
        super(props)
        // React State
        this.state = {
            HasPermission: null,
            type: Expo.Camera.Constants.Type.back,
        };
    }


    // --- On Component Mount --- //
    async componentDidMount(){
        // Get nagivation params
        title = this.props.navigation.getParam("title", "TITLE MISSING");
        success = this.props.navigation.getParam("success", "SUCCESS MESSAGE MISSING");
        screenToGoTo = this.props.navigation.getParam("screenToGoTo", "SCREEN MISSING");
        URL = this.props.navigation.getParam("URL", "URL MISSING");

        // Get camera permissions
        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CAMERA);
        this.setState({ HasPermission: status === "granted" });
    }


    // --- Callbacks --- //
    // Continues to the next screen, or goes back.
    onContinue = () => {
        if(screenToGoTo !== ""){
            this.props.navigation.navigate(screenToGoTo);
        } else {
            this.onBack();
        }
    }

    // Goes back to the main screen.
    onBack = () => {
        this.props.navigation.goBack();
    }

    // Called when the camera reads any QR code.
    onQRRead = async (code) => {
        // Does nothing if we're already reading a code.
        if(this.isProcessingQR) {
            return;
        }
        this.isProcessingQR = true;

        // Networking
        console.log("---------------");
        console.log("QR Scanned:");
        console.log(code.data);
        console.log("---------------");

        if(DEBUG_SHORTCUT_QR_READ){
            this.dropdown.alertWithType("success", "Success!", success);
            await Global.delay(3000);
            this.onContinue();
            this.isProcessingQR = false;
            return;
        }

        // Make a POST request to the url if it's valid
        if(isUUID(code.data, UUID_VERSION)){
            try{
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
                    this.dropdown.alertWithType("success", "Success!", success);
                    await Global.delay(3000);
                    this.onContinue();
                    this.isProcessingQR = false;
                } else {
                    throw new Error("Network error: Status - " + response.status);
                }
            } catch(error) {
                this.dropdown.alertWithType("error", "Try Again - Network Error", "Something went wrong! Please check your internet connection and try again.");
                console.log("Network Error Message: " + error);
                await Global.delay(2000);
                this.isProcessingQR = false;
            }
        } else {
            // Try again on failure.
            this.dropdown.alertWithType("error", "Try Again - Bad QR Code", "The QR code read was not from the ICPSR website's login page.");
            await Global.delay(2000);
            this.isProcessingQR = false;
        }
    }


    // --- Render --- //
    render(){
        // Show nothing until the user has given us a response
        if(this.state.HasPermission === null){
            return <View style={Global.Styles.background}/>;
        }
        // If the user has not given permission, show a prompt and a back button.
        else if(this.state.HasPermission === false){
            return (
                <View style={Global.Styles.background}>
                    <StatusBar barStyle="light-content"/>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text style={Global.Styles.boldText}>No Camera Access</Text>
                        <Text style={[Global.Styles.text, { fontSize: moderateScale(13) } ]}>Please give the app permissions to use the camera.</Text>
                    </View>
                    {/* Back Button */}
                    <Touchable style={styles.backButton} onPress={this.onBack} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                        <Text style={Global.Styles.text}>Back</Text>
                    </Touchable>
                </View>
            );
        }
        // Show the QR camera screen.
        else {
            return(
                <View style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content"/>

                    {/* Header */}
                    <View style={[Global.Styles.header, { paddingTop: Expo.Constants.statusBarHeight }]}>
                        <Text style={Global.Styles.text}>{title}</Text>
                    </View>

                    {/* Camera */}
                    <Camera style={{ flex: 1 }} type={this.state.type} barCodeTypes={[Camera.Constants.BarCodeType.qr]} onBarCodeRead={this.onQRRead}/>

                    {/* Back Button */}
                    <Touchable style={styles.backButton} onPress={this.onBack}>
                        <Text style={Global.Styles.text}>Back</Text>
                    </Touchable>

                    {/* QR Border */}
                    <View style={{position: "absolute", alignSelf: "center", marginTop: "65%"}}>
                        <Image source={require("../assets/qr_border.png")} style={{width: scale(175), height: scale(175)}}/>
                    </View>

                    {/* Dropdown Alerts */}
                    <DropdownAlert ref={ref => (this.dropdown = ref)}/>
                </View>
            );
        }
    }


    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
    };
}

// --- QR Page Styles --- //
export const styles = StyleSheet.create({
    backButton:{
        position: "absolute",
        backgroundColor: "#605f5e",
        marginTop: verticalScale(615),
        marginLeft: moderateScale(15),
        borderWidth: scale(2),
        borderColor: "black",
    }
});
