import React, { Component } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { StackNavigator } from "react-navigation"
import { GlobalStyles } from "./Styles.js"

// --- Home Screen --- //
export default class HomeScreen extends Component{
    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
    };

    // --- Constructor --- //
    constructor(props){
        super(props)

        // Binds the "this" object to the functions
        this._onBack = this._onBack.bind(this);
        this._onQRButtonPressed = this._onQRButtonPressed.bind(this);
    }

    // --- Callbacks --- //
    _onQRButtonPressed(){
        this.props.navigation.navigate("QR");
    }

    _onBack(){
        this.props.navigation.goBack();
    }

    // --- Render --- //
    render(){
        // Get Params from the nagivator
        const user = this.props.navigation.getParam("user", "");
        const pass = this.props.navigation.getParam("pass", "");

        return (
            <View style={GlobalStyles.background}>

                {/* Title */}
                <View style={GlobalStyles.header}>
                    <Text style={styles.headerText}>ICPSR</Text>
                </View>

                <Text style={GlobalStyles.text}>{"Username: " + user}</Text>
                <Text style={GlobalStyles.text}>{"Password: " + pass}</Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this._onQRButtonPressed} style={GlobalStyles.bigButton} activeOpacity={0.6} underlayColor="white">
                        <Text style={GlobalStyles.boldText}>QR Login</Text>
                    </TouchableOpacity>
                </View>

                {/* Back Button */}
                <View style={{marginTop: "90%", marginLeft: "4%"}}>
                    <TouchableOpacity onPress={this._onBack} style={GlobalStyles.backButton} activeOpacity={0.6} underlayColor="white">
                        <Text style={GlobalStyles.text}>Back to Login</Text>
                    </TouchableOpacity>
                </View>


            </View>
        );
    }

}

// --- Home Page Styles --- //
export const styles = StyleSheet.create({
    headerText: {
        //fontFamily: "BEHATRICE",
        fontSize: 30,
        fontWeight: 'bold',
        color: "white",
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-around"
    },


});
