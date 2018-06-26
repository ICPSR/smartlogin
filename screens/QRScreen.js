import Expo, { Camera } from "expo";
import React, { Component } from "react";
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar } from "react-native";
import { StackNavigator } from "react-navigation"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DropdownAlert from 'react-native-dropdownalert';
import { GlobalStyles } from "./Styles.js"
import { delay } from "../Functions.js"


// --- QR Screen --- //
export default class QRScreen extends Component{
    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
    };

    // --- Constructor --- //
    constructor(props){
        super(props)

        // Binds the "this" object to the functions
        this._onBack = this._onBack.bind(this);
        this._onQRRead = this._onQRRead.bind(this);

        // State
        this.state = {
            HasPermission: null,
            type: Expo.Camera.Constants.Type.back,
            qrFunc: this._onQRRead,
        };


    }

    // Waits until we have permission before doing anything.
    async componentWillMount(){
        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CAMERA);
        this.setState({ HasPermission: status === "granted" });
    }

    // --- Callbacks --- //
    _onBack(){
        this.props.navigation.goBack();
    }

    async _onQRRead(code){
        // Stop QR from reading
        this.setState({ qrFunc: undefined });

        // TODO: Networking stuff goes here
        //this.dropdown.alertWithType("info", "QR Info", "Data: " + code.data);


        // On Success, return to the home screen.
        if(true){
            this.dropdown.alertWithType("success", "Success!", "Successfully logged in!");
            await delay(4000);
            this.props.navigation.goBack();
        }
        // Try again on failure.
        else{
            this.dropdown.alertWithType("error", "Try Again - Bad QR Code", "The QR code read was not from the ICPSR website's login page.");
            await delay(2000);
            // Stop QR from reading
            this.setState({ qrFunc: this._onQRRead });
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
                        <TouchableOpacity onPress={this._onBack} style={GlobalStyles.backButton} activeOpacity={0.6} underlayColor="white">
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
                        <TouchableOpacity style={{marginTop: verticalScale(550), marginLeft: "4%", width: scale(70)}} onPress={this._onBack}>
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

}

// --- QR Page Styles --- //
export const styles = StyleSheet.create({


});
