import React, { Component } from "react";
import { StyleSheet, View, Animated, Text, TouchableWithoutFeedback } from "react-native";

export default class PG_Rotation extends Component {
  state = {
    animation1: new Animated.Value(0),
    animation2: new Animated.Value(1),
    animation3: new Animated.Value(1),
  };
  startAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.animation1, {
        toValue: 360,
        duration: 1500
      }),
      Animated.timing(this.state.animation2, {
        toValue: -2,
        duration: 700
      }),
      Animated.timing(this.state.animation3, {
        toValue: 2,
        duration: 700
      })
    ]).start(() => {
      Animated.timing(this.state.animation2, {
        toValue: 2,
        duration: 700
      }).start()
    })
  }
  
  render() {

    const rotateInterpolate = this.state.animation1.interpolate({
      inputRange: [0, 360],
      outputRange: ["0deg", "360deg"],
      // outputRange: ["0deg", "180deg"],
      // outputRange: ["0deg", "-360deg"],
      // outputRange: ["0deg", "1080deg"],
    });
    const scaleXInterpolate = this.state.animation3.interpolate({
      inputRange: [1, 2],
    //   outputRange: ["0deg", "360deg"],
      //outputRange: ["0deg", "180deg"],
      outputRange: [1, 2],
      // outputRange: ["0deg", "1080deg"],
    });

    const animatedStyles = {
      transform: [
        // With rotateInterpolate it rotates one time
        { rotate: rotateInterpolate },
        // With this.state.animation1 it rotates a lot of times...
        // { rotate: this.state.animation1 },

        { scaleY: this.state.animation2 },
        { scaleX: scaleXInterpolate },
      ]
    }

  
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.startAnimation}>
          <Animated.View style={[styles.box, animatedStyles]}>
            <Text>Hello Rotate!</Text>
          </Animated.View>
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
    width: 150,
    height: 150,
    backgroundColor: "tomato",
    alignItems: "center",
    justifyContent: "center",
  }
});
