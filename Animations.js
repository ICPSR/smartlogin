import React, { Component } from "react";
import { Animated, View, Easing } from 'react-native';
import * as Global from "./Global.js";

// Based off example code, from: https://facebook.github.io/react-native/docs/animations.html
export class FadeInView extends Component {
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
        }
    }

    async componentDidMount() {
        let dur = this.props.duration !== null ? parseInt(this.props.duration) : 500;
        if(this.props.delay !== null){
            await Global.delay(parseInt(this.props.delay));
        }
        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: dur, }).start();
    }

    render() {
        return (
            <Animated.View style={{...this.props.style, opacity: this.state.fadeAnim }}>
                {this.props.children}
            </Animated.View>
        );
    }
}
