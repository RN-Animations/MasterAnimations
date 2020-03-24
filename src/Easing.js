import React, { Component } from "react";
import { StyleSheet, View, Animated, TouchableWithoutFeedback, Easing } from "react-native";

export default class EasingFunc extends Component {
  state = {
    animation: new Animated.Value(0),
  };

  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 300,
      duration: 500,
    //   easing: Easing.back(5),
    //   easing: Easing.bounce
    //   easing: Easing.elastic(3)
    //   easing: Easing.bezier(.6,0.01,.86,.23)
      easing: Easing.sin
    }).start();
  };

  render() {
    const animatedStyles = {
      transform: [{ translateY: this.state.animation }],
    };
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.startAnimation}>
          <Animated.View style={[styles.box, animatedStyles]} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: "tomato",
  },
});