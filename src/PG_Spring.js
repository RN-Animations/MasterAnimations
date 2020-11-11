import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

export default class PG_Spring extends Component {
  state = {
    animation: new Animated.Value(1)
  };

  handlePress = () => {
    this.state.animation.addListener(({ value }) => {
      // console.log(value);
    });
    /* 
      friction: Controls "bounciness"/overshoot. Default 7.
      tension: Controls speed. Default 40.
      speed: Controls speed of the animation. Default 12.
      bounciness: Controls bounciness. Default 8.
      Check the docs for more:
      https://reactnative.dev/docs/animated#spring
    
    */
    Animated.spring(this.state.animation, {
      toValue: 2,
      friction: 3,
      tension: 140,
      delay: 1000
      // bounciness: 12,
      // speed: 1
    }).start(() => {
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 100
      }).start();
    });
  };

  render() {
    const animatedStyle = {
      transform: [{ scale: this.state.animation }]
    };
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handlePress}>
          <Animated.View style={[styles.box, animatedStyle]} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: "tomato"
  }
});
