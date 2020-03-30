import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
// Use it to disable touching an animated component
// ATTENTION! This technic has a lot of re-rendering!!!
export default class PointerEvents extends Component {
  state = {
    animation: new Animated.Value(0),
    toggle: true,
  };
  _pressed = false;
  handleToggle = () => {
    this.setState(state => ({
      toggle: !state.toggle,
    }));
  };
  handlePress = () => {
    const toValue = this._pressed ? 0 : 1;
    Animated.timing(this.state.animation, {
      toValue
    }).start();
    this._pressed = !this._pressed;
  };
  render() {
    
    const boxStyle = {
      backgroundColor: this.state.animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgb(255,99,71)", "rgb(99,71,255)"]
      })
    }

    return (
      <View style={styles.container}>
        <View>
          <TouchableWithoutFeedback onPress={this.handlePress}>
            <Animated.View style={[styles.box, boxStyle]} />
          </TouchableWithoutFeedback>
          <View
            style={[StyleSheet.absoluteFill, styles.cover]}
            pointerEvents={this.state.toggle ? "none" : "auto"}
          />
        </View>

        <TouchableOpacity onPress={this.handleToggle}>
          <View>
            <Text>{`Toggle Pointer Events: ${this.state.toggle}`}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 100,
    height: 100,
  },
  cover: {
    backgroundColor: "transparent",
  },
});

