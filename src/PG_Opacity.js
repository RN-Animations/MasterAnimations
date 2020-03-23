import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

export default class PG_Opacity extends Component {
  state = {
    animation: new Animated.Value(0.5)
  };
  // check this out
  // https://medium.com/@benjamintodts/react-natives-animated-loop-invoking-a-callback-whenever-an-iteration-finishes-1c3581d38d54

    /* loop()
    static loop(animation, config?)
    Loops a given animation continuously, 
    so that each time it reaches the end, 
    it resets and begins again from the start. 
    Will loop without blocking the UI thread 
    if the child animation is set to useNativeDriver: true. 
    In addition, loops can prevent VirtualizedList-based components 
    from rendering more rows while the animation is running. 
    You can pass isInteraction: false in the child animation config to fix this.

    Config is an object that may have the following options:

    iterations: Number of times the animation should loop. Default -1 (infinite). */
  startAnimation = () => {
    Animated.loop(
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true
      }),
      {
        iterations: 10
      }
    ).start();
  };
  // startAnimation = () => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(this.state.animation, {
  //         toValue: 1,
  //         duration: 500
  //       }),
  //       Animated.delay(1000),
  //       Animated.timing(this.state.animation, {
  //         toValue: 0.5,
  //         duration: 1000
  //       })
  //     ]),
  //     {
  //       iterations: 3
  //     }
  //   ).start();
  // };

  render() {
    // create a dynamic style
    const animatedStyles = {
      opacity: this.state.animation
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
    alignItems: "center",
    justifyContent: "center"
  },
  box: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "tomato"
  }
});
