import React, { Component } from "react";
import { Animated, View, Easing } from 'react-native';


// Based off example code, from: https://facebook.github.io/react-native/docs/animations.html
export class FadeInView extends Component {
    state = {
        fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    }

    componentDidMount() {
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 1,
                duration: 500,
            }
        ).start();
    }

    render() {
        let { fadeAnim } = this.state;

        return (
            <Animated.View
                style={{
                    ...this.props.style,
                    opacity: fadeAnim,
                }}
                >
                {this.props.children}
            </Animated.View>
        );
    }
}
