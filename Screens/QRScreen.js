import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { StackNavigator } from "react-navigation"
import Expo, { Camera } from "expo";
import DropdownAlert from 'react-native-dropdownalert';
import { GlobalStyles } from "./Styles.js"


// --- QR Screen --- //
export default class QRScreen extends Component{
    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
    };

    // --- Constructor --- //
    constructor(props){
        super(props)

        // State
        this.state = {
            HasPermission: null,
            type: Expo.Camera.Constants.Type.back,
        };

        // Binds the "this" object to the functions
        this._onBack = this._onBack.bind(this);
        this._onQRRead = this._onQRRead.bind(this);

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

    _onQRRead(code){
        this.dropdown.alertWithType("info", "QR Info", "Data: " + code.data);
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
                    <Camera style={{ flex: 1 }} type={this.state.type} barCodeTypes={[Camera.Constants.BarCodeType.qr]} onBarCodeRead={this._onQRRead}>
                        <TouchableOpacity style={{marginTop: "165%", marginLeft: "6%"}} onPress={this._onBack}>
                            <Text style={[GlobalStyles.underlineText, {fontSize: 22}]}>Back</Text>
                        </TouchableOpacity>
                    </Camera>

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
