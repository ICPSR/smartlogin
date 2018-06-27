import Expo, { Camera } from "expo";
import React, { Component } from "react";
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar } from "react-native";
import { StackNavigator } from "react-navigation"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import { GlobalStyles } from "../Styles.js"
import { delay } from "../Functions.js"


// --- QR Screen --- //
export default class QRScreen extends Component{
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
    async componentWillMount(){
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

        // TODO: Testing code that circumvents below networking code.
        if(true){
            this.dropdown.alertWithType("success", "Success!", "Successfully logged in!");
            await delay(3000);
            this.props.navigation.goBack();
            return;
        }

        // Networking
        const URL_PATTERN = "/pcms/mydata/smartlogin/authorize/";
        console.log("QR Scanned:");
        console.log(code.data);
        console.log("Matches pattern? - " + code.data.includes(URL_PATTERN));

        // Make a POST request to the url if it's valid
        if(code.data.includes(URL_PATTERN)){
            try{
                console.log("Sending user info...");

                let response = await fetch(code.data, {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({
                        userID: "",
                        email: ""
                    }),
                });
                if(!response.ok){
                    throw new Error("Network response was not ok.")
                }

                console.log("Recieved Response: ");
                console.log(response.json());

                // TODO: More stuff probably goes here after getting response


                // On Success, return to the home screen.
                this.dropdown.alertWithType("success", "Success!", "Successfully logged in!");
                await delay(3000);
                this.props.navigation.goBack();
            } catch(error) {
                this.dropdown.alertWithType("error", "Try Again - Network Error", "Something went wrong! Please check your internet connection and try again.");
                console.error(error);
                await delay(1500);
                this.setState({ qrFunc: this.onQRRead });
            }
        } else {
            // Try again on failure.
            this.dropdown.alertWithType("error", "Try Again - Bad QR Code", "The QR code read was not from the ICPSR website's login page.");
            await delay(1500);
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
                        <Text style={GlobalStyles.boldText}>No camera access. Please allow the app to access the camera.</Text>
                    </View>
                    {/* Back Button */}
                    <View style={{marginBottom: "4%", marginLeft: "4%"}}>
                        <TouchableOpacity onPress={this.onBack} style={styles.backButton} activeOpacity={0.6} underlayColor="white">
                            <Text style={GlobalStyles.text}>Back</Text>
                        </TouchableOpacity>
                    </View>
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
                    <Camera style={{ flex: 1 }} type={this.state.type} barCodeTypes={[Camera.Constants.BarCodeType.qr]} onBarCodeRead={this.state.qrFunc}>
                        {/* Back Button */}
                        <TouchableOpacity style={{marginTop: verticalScale(550), marginLeft: "4%", width: scale(70)}} onPress={this.onBack}>
                            <Text style={[GlobalStyles.underlineText, {fontSize: moderateScale(22), borderWidth: scale(2), borderColor: "black", backgroundColor: "grey"}]}>Back</Text>
                        </TouchableOpacity>
                    </Camera>

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
    backButton: {
        backgroundColor: "#605f5e",
        width: scale(150),
        height: verticalScale(60),
        alignItems: "center",
        justifyContent: "center",
    },
});
