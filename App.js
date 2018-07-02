import Expo from "expo";
import React, { Component } from "react";
import { Dimensions, Platform, View } from "react-native";
import { createStackNavigator } from "react-navigation"
import { GlobalStyles } from "./Styles.js"

// Screens
import MainScreen from "./screens/MainScreen.js"
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
        console.log("---------------- Device Information ----------------");
        console.log("Device Name: " + Expo.Constants.deviceName);
        console.log("Platform: " + Platform.OS);
        console.log("Version: " + Platform.Version);
        let {height, width} = Dimensions.get("window");
        console.log("Dimensions: " + height + " x " + width);
        console.log("Year Class: " + Expo.Constants.deviceYearClass);
        console.log("---------------- Device Information End ----------------");

        // Load assets
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
        await Expo.Font.loadAsync({
            'Behatrice-Regular': require('./assets/fonts/Behatrice-Regular.ttf'),
        });
        this.setState({ DoneLoading: true });
    }

    // --- Render --- //
    render(){
        if(this.state.DoneLoading){
            return <RootStack/>;
        } else {
            return <View style={GlobalStyles.background}></View>
        }
    }
}

// Stack Navigator
const RootStack = createStackNavigator(
    {
        Main: MainScreen,
        QR: QRScreen,
    },
    {
        initialRouteName: "Main",
    }
);
