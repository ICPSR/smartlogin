import Expo, { Camera } from "expo";
import React, { Component } from "react";
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar } from "react-native";
import { StackNavigator } from "react-navigation";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import Touchable from 'react-native-platform-touchable';
import * as Global from "../Global.js";


// --- QR Screen --- //
export default class QRScreen extends Component{
    // --- Instance Variables --- //
    // The text on the header.
    title = "";

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

        // Get camera permissions
        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CAMERA);
        this.setState({ HasPermission: status === "granted" });
    }


    // --- Callbacks --- //
    // Continues to the next screen, or goes back. Used only for the Debug Skip button.
    DEBUGONLY_onContinue = () => {
        if(title === "Scan QR from the activation page"){
            this.props.navigation.navigate("OTP", { response: null });
        } else {
            this.onBack();
        }
    }

    // Manually enters the QR code stored in Global.js
    DEBUGONLY_onManualQR = () => {
        let code = { data: Global.DEBUG_QR_UUID };
        this.onQRRead(code);
    }

    // Goes back to the home screen.
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
        console.log("---------------");
        console.log("QR Scanned:");
        console.log(code.data);
        console.log("---------------");
        // Callback
        let qrCallback = this.props.navigation.getParam("qrCallback", null);
        await qrCallback(this, code);
        this.isProcessingQR = false;
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
                    <Touchable style={styles.backButton} onPress={this.onBack} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white" foreground={Touchable.Ripple("#fff", true)}>
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
                    <View style={Global.Styles.header}>
                        <Text style={Global.Styles.text}>{title}</Text>
                    </View>

                    {/* Camera */}
                    <Camera style={{ flex: 1 }} type={this.state.type} barCodeTypes={[Camera.Constants.BarCodeType.qr]} onBarCodeRead={this.onQRRead}/>

                    {/* QR Border */}
                    <View style={{position: "absolute", alignSelf: "center", marginTop: verticalScale(250)}}>
                        <Image source={require("../assets/qr_border.png")} style={{width: moderateScale(175), height: moderateScale(175)}}/>
                    </View>

                    {/* Back Button */}
                    <Touchable style={styles.backButton} onPress={this.onBack} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white" foreground={Touchable.Ripple("#fff", true)}>
                        <Text style={Global.Styles.text}>Back</Text>
                    </Touchable>

                    {/* DEBUG ONLY: Skip and Manual QR entering */}
                    { Global.DEBUG_COMPONENTS ?
                        <Touchable style={[styles.backButton, { marginLeft: scale(210) }]} onPress={this.DEBUGONLY_onContinue} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white" foreground={Touchable.Ripple("#fff", true)}>
                            <Text style={Global.Styles.text}>DEBUG: Skip</Text>
                        </Touchable>
                    : null }
                    { Global.DEBUG_COMPONENTS ?
                        <Touchable style={[styles.backButton, { marginLeft: scale(160), marginTop: verticalScale(550) }]} onPress={this.DEBUGONLY_onManualQR} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white" foreground={Touchable.Ripple("#fff", true)}>
                            <Text style={Global.Styles.text}>DEBUG: Manual QR</Text>
                        </Touchable>
                    : null }

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
        backgroundColor: Global.HighlightColor_4,
        marginTop: verticalScale(615),
        marginLeft: moderateScale(15),
        borderWidth: scale(2),
        borderColor: "black",
    }
});
