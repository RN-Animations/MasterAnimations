import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, Animated, TouchableWithoutFeedback } from "react-native";

import { interpolateNumber, interpolateRgb } from "d3-interpolate";

export default class App extends Component {
  state = {
    animation: new Animated.Value(0)
  };
  
  UNSAFE_componentWillMount() {
    const positionInterpolate = interpolateNumber(0, 200);
    const colorInterpolate = interpolateRgb("rgb(255,99,71)", "rgb(99,71,255)");;

    this.state.animation.addListener(({value}) => {
      const position = positionInterpolate(value);
      const color = colorInterpolate(value);

      const style = [
        styles.box,
        {
          backgroundColor: color,
          transform: [
            {translateY: position}
          ]
        }
      ];
      this._view.setNativeProps({ style });
    });
  }
  
  handlePress = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 500,
    }).start();
  }
  
  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handlePress}>
          <View style={styles.box} ref={view => this._view = view} />
        </TouchableWithoutFeedback>
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
    width: 50,
    height: 50,
    backgroundColor: "tomato",
  }
});

// AppRegistry.registerComponent("App", () => animations);
