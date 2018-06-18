import React, { Component } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { createStackNavigator } from "react-navigation"
import Expo from "expo";
import { Styles } from "./Styles.js"

// --- Login Screen --- //
export default class LoginScreen extends Component {
    // --- Navigation Options --- //
    static navigationOptions = {
        title: "Login"
    };

    // --- Constructor --- //
    constructor(props){
        super(props)

        // Binds the "this" object to the functions
        this._setFingerprintPopup = this._setFingerprintPopup.bind(this);
        this._onCredentialsEntered = this._onCredentialsEntered.bind(this);
        this._onUsernameUpdated = this._onUsernameUpdated.bind(this);
        this._onPasswordUpdated = this._onPasswordUpdated.bind(this);

        // The current state of this screen in the App, represented in a pseudo enum
        this.ScreenStateEnum = Object.freeze({ Neutral: {}, CredentialsWindow: {}, FingerprintWindow: {} });
        this.state = { ScreenState: this.ScreenStateEnum.Neutral };

        // The current credentials entered in
        this.SubmittedUsername = "";
        this.SubmittedPassword = "";
    }



    // --- State machine related --- //
    // Toggles the credentials window part of the state machine
    _setCredentialsFields(isVisible){
        return () => {
            this.setState(currentState => {
                if(isVisible) return { ScreenState: this.ScreenStateEnum.CredentialsWindow };
                return { ScreenState: this.ScreenStateEnum.Neutral };
            });
        }
    }

    // Toggles the fingerprint window part of the state machine
    _setFingerprintPopup(isVisible){
        return () => {
            this.setState(currentState => {
                if(isVisible) return { ScreenState: this.ScreenStateEnum.FingerprintWindow };
                return { ScreenState: this.ScreenStateEnum.Neutral };
            });
        }
    }



    // --- Callbacks --- //
    // Called as the user types their user/pass.
    _onUsernameUpdated(text){
        this.SubmittedUsername = text;
    }
    _onPasswordUpdated(text){
        this.SubmittedPassword = text;
    }

    // Called when the user submits their user/pass
    _onCredentialsEntered(){
        // TODO: Do network stuff here
        Alert.alert("Username: " + this.SubmittedUsername + "  Password: " + this.SubmittedPassword);

        // On success, continue to the home screen.
        if(true){
            this._toHomeScreen();
        }
    }



    // --- Screen Transitions --- //
    // Transitions to the home app screen.
    _toHomeScreen(){

    }


    // --- Render --- //
    render() {
        return (
            // Outermost view, don't have anything outside of this
            <View style={Styles.background}>

                {/* Title */}
                <View style={Styles.titleContainer}>
                    <Text style={Styles.title}>ICPSR</Text>
                </View>


                {/* Body */}
                <View style={Styles.textContainer}>
                    <Text style={Styles.text}>International Leader in Data Stewardship</Text>
                    <Text style={Styles.text}>10,000 studies, comprising of 4.8 million variables</Text>
                    <Text style={Styles.text}>Data Stewardship and Social Science Research Projects</Text>
                    <Text style={Styles.text}>776 member institutions</Text>
                </View>


                {/* Main Buttons */}
                {this.state.ScreenState != this.ScreenStateEnum.CredentialsWindow ?
                    <View style={Styles.buttonContainer}>
                        <TouchableOpacity onPress={this._setCredentialsFields(true)} style={Styles.bigButton} underlayColor="white">
                            <Text style={Styles.text}>Username/Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._setFingerprintPopup(true)} style={Styles.bigButton} underlayColor="white">
                            <Text style={Styles.text}>Fingerprint Scan</Text>
                        </TouchableOpacity>
                    </View>
                : false }


                {/* Username/Password Windows */}
                {this.state.ScreenState === this.ScreenStateEnum.CredentialsWindow ?
                    <View style={{marginTop: "20%"}}>
                        <View style={Styles.textInputContainer}>
                            <TextInput style={Styles.textInput} placeholder="Username" onChangeText={this._onUsernameUpdated} onSubmitEditing={this._onCredentialsEntered}/>
                        </View>
                        <View style={Styles.textInputContainer}>
                            <TextInput style={Styles.textInput} placeholder="Password" onChangeText={this._onPasswordUpdated} onSubmitEditing={this._onCredentialsEntered} secureTextEntry={true}/>
                        </View>

                        <View style={{alignItems: "center", justifyContent: "center", margin: 30}}>
                            <TouchableOpacity onPress={this._onCredentialsEntered} style={Styles.button} underlayColor="white">
                                <Text style={Styles.text}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._setCredentialsFields(false)} style={{marginTop: 30}} underlayColor="white">
                                <Text style={Styles.smallText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                : false }


                {/* Fingerprint Popup */}
                {this.state.ScreenState === this.ScreenStateEnum.FingerprintWindow ?
                    <FingerprintPopup onPopupDismissed={this._setFingerprintPopup(false)}/>
                : false }


            </View>
        );
    }
}
