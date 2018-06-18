import React, { Component } from "react";
import { createStackNavigator } from "react-navigation"

// Screens
import LoginScreen from "./LoginScreen.js"
import HomeScreen from "./HomeScreen.js"


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
