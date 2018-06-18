import React, { Component } from "react";
import { createStackNavigator } from "react-navigation"

// Screens
import LoginScreen from "./Screens/LoginScreen.js"
import HomeScreen from "./Screens/HomeScreen.js"


// --- App Export --- //
export default class App extends Component {
    render(){
        return <RootStack/>;
    }
}

// Stack Navigator
const RootStack = createStackNavigator(
    {
        Login: LoginScreen,
        Home: HomeScreen,
    },
    {
        initialRouteName: "Login",
    }
);
