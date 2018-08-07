import React, { Component } from "react";
import { Animated, View, Easing } from 'react-native';
import * as Global from "./Global.js";

// Based off example code, from: https://facebook.github.io/react-native/docs/animations.html
export class FadeInView extends Component {
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
            finished: false
        }
    }

    async componentDidMount() {
        let dur = this.props.duration !== null ? parseInt(this.props.duration) : 500;
        if(this.props.delay !== null){
            await Global.delay(parseInt(this.props.delay));
        }
        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: dur, }).start( (finished) => {
            this.setState(() => {
                return { finished: true };
            });
        });
    }

    // Recursively applies a prop to all children.
    addPropRecursive = (children, prop) => {
        return React.Children.map(children, child => {
            if (React.isValidElement(child) && child.props) {
                let childProps = prop;
                childProps.children = this.addPropRecursive(child.props.children, prop);
                return React.cloneElement(child, childProps);
            }
            return child;
        });
    }

    render() {
        // While the animation is playing, disable all buttons.
        const children = this.addPropRecursive(this.props.children, { disabled: !this.state.finished });
        return (
            <Animated.View style={{...this.props.style, opacity: this.state.fadeAnim }}>
                {children}
            </Animated.View>
        );
    }
}
