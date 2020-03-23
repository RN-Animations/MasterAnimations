import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

export default class PG_ColorBackground extends Component {
  state = {
    animation: new Animated.Value(0),
    scaleValue: new Animated.Value(1),
    textValue: new Animated.Value(0)
  };
  startAnimation = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.animation, {
          toValue: 1,
          duration: 2500
        }),
        Animated.timing(this.state.scaleValue, {
          toValue: 2,
          duration: 1500
        })
      ]),
      Animated.timing(this.state.textValue, {
        toValue: 1,
        duration: 1000
      })
    ]).start();
  };

  render() {
    const boxInterpolation = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgb(255,99,71)", "rgb(99,71,255)"]
    });

    const textColorInterpolation = this.state.textValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgb(99,71,255)", "rgb(255,99,71)"]
    });

    // const textColorInterpolation = this.state.textValue.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ["rgb(255,99,71)", "rgb(99,71,255)"]
    // });

    // const scaleInterpolation = this.state.scaleValue.interpolate({
    //   inputRange: [1, 2],
    //   outputRange: [1, 2]
    // });

    const boxAnimatedStyles = {
      backgroundColor: boxInterpolation,
      transform: [{ scale: this.state.scaleValue }]
    };

    const textAnimatedStyles = {
      color: textColorInterpolation
    };

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.startAnimation}>
          <Animated.View style={[styles.box, boxAnimatedStyles]}>
            <Animated.Text style={textAnimatedStyles}>
              Hello Animation!
            </Animated.Text>
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
    justifyContent: "center"
  },
  box: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center"
  }
});
