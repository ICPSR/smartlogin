import React, { Component } from "react";
import { View } from "react-native";
import { createStackNavigator } from "react-navigation"
import Expo from "expo";
import { GlobalStyles } from "./Screens/Styles.js"

// Screens
import LoginScreen from "./Screens/LoginScreen.js"
import QRScreen from "./Screens/QRScreen.js"

// --- App Export --- //
export default class App extends Component {
    // --- Constructor --- //
    constructor(props){
        super(props);
        this.state = { DoneLoading: false, };
    }

    // Loads fonts on mount
    async componentDidMount(){
        await Expo.Font.loadAsync({
            'icpsr-font': require('./assets/fonts/Behatrice-Regular.ttf'),
        });
        this.setState({ DoneLoading: true });
    }

    // --- Render --- //
    render(){
        let root = null;
        if(this.state.DoneLoading){
            root = <RootStack/>;
        } else {
            root = <View style={GlobalStyles.background}></View>
        }
        return root;
    }
}

// Stack Navigator
const RootStack = createStackNavigator(
    {
        Login: LoginScreen,
        QR: QRScreen,
    },
    {
        initialRouteName: "Login",
    }
);
