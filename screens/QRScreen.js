import Expo, { Camera } from "expo";
import React, { Component } from "react";
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar } from "react-native";
import { StackNavigator } from "react-navigation"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import { GlobalStyles } from "../Styles.js"
import * as Global from "../Global.js"


// - Constants - //


// --- QR Screen --- //
export default class QRScreen extends Component{
    // --- Instance Variables --- //
    // The userID passed in by the MainScreen
    userID = "NO-ID";

    // --- Constructor --- //
    constructor(props){
        super(props)
        // React State
        this.state = {
            HasPermission: null,
            type: Expo.Camera.Constants.Type.back,
            qrFunc: this.onQRRead,
        };
    }


    // --- On Component Mount --- //
    async componentDidMount(){
        // Get nagivation params
        userID = this.props.navigation.getParam("userID", "NO-ID");

        // Get camera permissions
        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CAMERA);
        this.setState({ HasPermission: status === "granted" });
    }


    // --- Callbacks --- //
    // Goes back to the main screen.
    onBack = () => {
        this.props.navigation.goBack();
    }

    // Called when the camera reads any QR code.
    onQRRead = async (code) => {
        // Stop QR from reading
        this.setState({ qrFunc: undefined });

        // Networking
        const URL = "http://192.168.145.106:8080/pcms/mydata/smartlogin/authorize/"
        console.log("---------------");
        console.log("QR Scanned:");
        console.log(code.data);
        console.log("---------------");

        /*
        // TODO: Testing code that circumvents below networking code.
        if(true){
            this.dropdown.alertWithType("success", "Success!", "Successfully logged in!");
            await Global.delay(3000);
            this.props.navigation.goBack();
            return;
        }
        */

        // Make a POST request to the url if it's valid
        if(true){
            try{
                console.log("Sending user info to: " + URL + code.data);

                let response = await Global.fetchWithTimeout(URL + userID+"/"+code.data, {
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
                if(!response.ok){
                    throw new Error("Network error: Status - " + response.status);
                }

                // TODO: More stuff probably goes here after getting response


                // On Success, return to the home screen.
                this.dropdown.alertWithType("success", "Success!", "Successfully logged in!");
                await Global.delay(3000);
                this.props.navigation.goBack();
            } catch(error) {
                this.dropdown.alertWithType("error", "Try Again - Network Error", "Something went wrong! Please check your internet connection and try again.");
                console.error(error);
                await Global.delay(1500);
                this.setState({ qrFunc: this.onQRRead });
            }
        } else {
            // Try again on failure.
            this.dropdown.alertWithType("error", "Try Again - Bad QR Code", "The QR code read was not from the ICPSR website's login page.");
            await Global.delay(1500);
            this.setState({ qrFunc: this.onQRRead });
        }
    }


    // --- Render --- //
    render(){
        // Show nothing until the user has given us a response
        if(this.state.HasPermission === null){
            return <View style={GlobalStyles.background}/>;
        }
        // If the user has not given permission, show a prompt and a back button.
        else if(this.state.HasPermission === false){
            return (
                <View style={GlobalStyles.background}>
                    <StatusBar barStyle="light-content"/>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text style={GlobalStyles.boldText}>No Camera Access</Text>
                        <Text style={[GlobalStyles.text, { fontSize: moderateScale(13) } ]}>Please give the app permissions to use the camera.</Text>
                    </View>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={this.onBack} activeOpacity={Global.BUTTON_ACTIVE_OPACITY} underlayColor="white">
                        <Text style={GlobalStyles.text}>Back</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        // Show the QR camera screen.
        else {
            return(
                <View style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content"/>

                    {/* Header */}
                    <View style={[GlobalStyles.header, { paddingTop: Expo.Constants.statusBarHeight }]}>
                        <Text style={GlobalStyles.text}>Scan QR from the ICPSR login page.</Text>
                    </View>

                    {/* Camera */}
                    <Camera style={{ flex: 1 }} type={this.state.type} barCodeTypes={[Camera.Constants.BarCodeType.qr]} onBarCodeRead={this.state.qrFunc}/>

                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={this.onBack}>
                        <Text style={GlobalStyles.text}>Back</Text>
                    </TouchableOpacity>

                    {/* QR Border */}
                    <View style={{position: "absolute", alignSelf: "center", marginTop: "65%"}}>
                        <Image source={require("../assets/qr_border.png")} style={{width: scale(175), height: scale(175)}}/>
                    </View>

                    {/* Dropdown Alerts */}
                    <DropdownAlert ref={ref => (this.dropdown = ref)} closeInterval={5000}/>
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
