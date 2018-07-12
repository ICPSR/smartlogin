import Expo, { AppLoading } from "expo";
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

    // Print out information.
    async componentDidMount(){
        console.log("---------------- Device Information ----------------");
        console.log("Device Name: " + Expo.Constants.deviceName);
        console.log("Platform: " + Platform.OS);
        console.log("Version: " + Platform.Version);
        let {height, width} = Dimensions.get("window");
        console.log("Dimensions: " + height + " x " + width);
        console.log("Year Class: " + Expo.Constants.deviceYearClass);
        console.log("---------------- Device Information End ----------------");

        // Lock the screen to portrait mode
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
    }

    // --- Render --- //
    render(){
        if(this.state.DoneLoading){
            return <RootStack/>;
        } else {
            return <AppLoading startAsync={this.loadResources} onFinish={() => this.setState({ DoneLoading: true })} onError={console.warn}/>
        }
    }

    // Loads resources
    async loadResources(){
        // Load fonts
        const fontPromise = Expo.Font.loadAsync({
            'Behatrice-Regular': require('./assets/fonts/Behatrice-Regular.ttf'),
        });

        // Load images
        const images = [
            require("./assets/key.png"),
            require("./assets/qr.png"),
            require("./assets/qr_border.png")
        ];
        const imagePromise = images.map((image) => Expo.Asset.fromModule(image).downloadAsync());

        // Return promises
        return Promise.all([ fontPromise, imagePromise ]);
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
