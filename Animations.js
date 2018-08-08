import React, { Component } from "react";
import { Animated, View, Easing } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import * as Global from "./Global.js";

// Based off example code, from: https://facebook.github.io/react-native/docs/animations.html
// TODO: Weird Caviet - Can only have 1 child component ONLY if there is a Touchable/TouchableRounded/Button inside of it. Maybe fix this in the future.
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
    addPropToButtonsRecursive = (children, prop) => {
        return React.Children.map(children, child => {
            let isButton = React.isValidElement(child) &&
                (child.type === Global.TouchableRounded ||
                 child.type === Global.Button ||
                 child.type === Touchable);
            if (isButton && child.props) {
                let childProps = prop;
                childProps.children = this.addPropToButtonsRecursive(child.props.children, prop);
                let newChild = React.cloneElement(child, childProps);
                return newChild;
            }
            return child;
        });
    }

    render() {
        // While the animation is playing, disable all buttons.
        const children = this.addPropToButtonsRecursive(this.props.children, { disabled: !this.state.finished });
        return (
            <Animated.View style={{...this.props.style, opacity: this.state.fadeAnim }}>
                {children}
            </Animated.View>
        );
    }
}
