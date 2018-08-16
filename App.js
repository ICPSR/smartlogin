import Expo, { AppLoading } from "expo";
import React, { Component } from "react";
import { AsyncStorage, Dimensions, Platform, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import SockJS from "sockjs-client"
import * as Global from "./Global.js";

// Screens
import IntroScreen from "./screens/IntroScreen.js";
import HomeScreen from "./screens/HomeScreen.js";
import QRScreen from "./screens/QRScreen.js";
import OTPScreen from "./screens/OTPScreen.js";


// --- App Export --- //
export default class App extends Component {
    // Modules
    Stomp = require('@stomp/stompjs');

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
        let { height, width } = Dimensions.get("window");
        console.log("Dimensions: " + height + " x " + width);
        console.log("Year Class: " + Expo.Constants.deviceYearClass);
        console.log("Device ID: " + Expo.Constants.deviceId);
        console.log("---------------- Device Information End ----------------");

        // Lock the screen to portrait mode
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);

        /*
        const URL = "http://141.211.88.103:8080/passport/ws-activate";
        let socket = new SockJS(URL);
        let client = Stomp.over(socket);
        let ret = client.connect("user", "pass", function(frame){
            // On Success
            console.log("Connection Successful");
            // Subscribe
            let subscription = client.subscribe("/topic/greeting", function(message){
                let messageJSON = JSON.parse(message.body);
                console.log("Message Recieved: " + messageJSON.value);
            });
            // Send message
            client.send("/app/greeting", {}, JSON.stringify({
                "sender" : "Phoneboy",
                "message" : "Hi I'm a phone"
            }));
        }, function(frame){
            // On Failure
            console.log("Connection Failed");
        });

        await Global.delay(3000);
        //client.disconnect(() => { console.log("Disconnected"); });
        */
    }

    // --- Render --- //
    render(){
        if(this.state.DoneLoading){
            return <RootStack/>;
        } else {
            return <AppLoading startAsync={this.loadResources} onFinish={() => this.setState({ DoneLoading: true })} onError={console.warn}/>;
        }
    }

    // Loads resources
    loadResources = async () => {
        // Load fonts
        const fontPromise = Expo.Font.loadAsync({
            'BEHATRICE': require('./assets/fonts/BEHATRICE.ttf'),
        });

        // Load images
        const images = [
            require("./assets/icpsr-logo.png"),
            require("./assets/key.png"),
            require("./assets/qr.png"),
            require("./assets/qr_border.png")
        ];
        const imagePromise = images.map((image) => Expo.Asset.fromModule(image).downloadAsync());

        // Configure the RootStack based on the state of the app.
        const stackPromise = new Promise(async (resolve, reject) => {
            const screens = {
                Intro: IntroScreen,
                Home: HomeScreen,
                QR: QRScreen,
                OTP: OTPScreen,
            }
            try {
                if(Global.DEBUG_FORCE_NO_ACCOUNT){
                    await AsyncStorage.removeItem("@AccountLinked");
                }
                const isLinked = await AsyncStorage.getItem("@AccountLinked");
                if(isLinked === null){
                    RootStack = createStackNavigator(screens, { initialRouteName: "Intro" });
                } else {
                    RootStack = createStackNavigator(screens, { initialRouteName: "Home" });
                }
                resolve();
            } catch(error) {
                reject("Error getting data: " + error);
            }
        });

        // Return promises
        return Promise.all([ fontPromise, imagePromise, stackPromise ]);
    }
}
