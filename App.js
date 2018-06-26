import Expo from "expo";
import React, { Component } from "react";
import { View } from "react-native";
import { createStackNavigator } from "react-navigation"
import { GlobalStyles } from "./screens/Styles.js"

// Screens
import LoginScreen from "./screens/LoginScreen.js"
import QRScreen from "./screens/QRScreen.js"

// --- App Export --- //
export default class App extends Component {
    // --- Constructor --- //
    constructor(props){
        super(props);
        this.state = { DoneLoading: false, };
    }

    // Loads fonts on mount
    async componentDidMount(){
        console.log("hi");
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
        await Expo.Font.loadAsync({
            'Behatrice-Regular': require('./assets/fonts/Behatrice-Regular.ttf'),
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
