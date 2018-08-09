import React, { Component } from "react";
import { Animated, View, Easing } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import * as Global from "./Global.js";

// Based off example code, from: https://facebook.github.io/react-native/docs/animations.html
// TODO: Weird Caviet - Cannot have a Touchable/TouchableRounded/Button as a first order child, but can if it's a 2nd or deeper order. Might want to look into this later.
export class FadeInView extends Component {
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
            finished: false
        }
    }

    async componentDidMount() {
        // Delay
        let dur = this.props.duration !== null ? parseInt(this.props.duration) : 500;
        if(this.props.delay !== null){
            await Global.delay(parseInt(this.props.delay));
        }
        // Start animation after the delay, set finished to true when done
        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: dur, }).start( (finished) => {
            this.setState(() => {
                return { finished: true };
            });
        });
    }

    // Recursively applies a prop to all children.
    addPropToButtonsRecursive = (children, prop) => {
        return React.Children.map(children, child => {
            if (React.isValidElement(child) && child.props) {
                let isButton = (child.type === Global.TouchableRounded || child.type === Global.Button || child.type === Touchable);
                console.log(child.type);
                console.log(isButton);
                if(isButton){
                    console.log(child.type + "");
                }
                let childProps = prop;
                childProps.children = this.addPropToButtonsRecursive(child.props.children, prop);
                if(isButton){
                    return React.cloneElement(child, childProps);
                }
                return child;
            }
            return child;
        });
    }

    addProp = (children) => {
        return React.Children.map(children, child => {
            if (React.isValidElement(child) && child.props) {
                let props = { style: { backgroundColor: "blue" } };
                props.children = this.addProp(child.props.children);
                return React.cloneElement(child, props);
            }
            return child;
        });
    }

    render() {
        // While the animation is playing, disable all buttons.
        //const children = this.addPropToButtonsRecursive(this.props.children, { disabled: !this.state.finished });
        const children = this.addProp(this.props.children);
        return (
            <Animated.View style={{...this.props.style, opacity: this.state.fadeAnim }}>
                {children}
            </Animated.View>
        );
    }
}
