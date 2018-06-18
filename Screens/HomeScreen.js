import React, { Component } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { StackNavigator } from "react-navigation"
import { GlobalStyles } from "./Styles.js"

// --- Home Screen --- //
export default class HomeScreen extends Component{
    // --- Navigation Options --- //
    static navigationOptions = {
        header: null,
        //title: "Home"
    };

    // --- Constructor --- //
    constructor(props){
        super(props)

    }


    render(){
        // Get Params from the nagivator
        const user = this.props.navigation.getParam("user", "");
        const pass = this.props.navigation.getParam("pass", "");

        return (
            <View style={GlobalStyles.background}>
                <Text style={GlobalStyles.text}>{user}</Text>
                <Text style={GlobalStyles.text}>{pass}</Text>


            </View>
        );
    }

}

// --- Home Page Styles --- //
export const styles = StyleSheet.create({


});
