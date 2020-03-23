import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

/* 
Animating elements that are absolute positioned 
is very similar to animating elements via translateX and translateY. 
The only difference is that when animating absolutely positioned elements 
they will effect layout. This is very apparent when using child elements 
while animating the outside view.
*/
export default class PG_AbsolutePosition extends Component {
  state = {
    animation: new Animated.Value(0),
    animationHeight: new Animated.Value(150)
  };
  startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.animation, {
          toValue: 40,
          duration: 1500
        }),
        Animated.timing(this.state.animationHeight, {
          toValue: 700,
          duration: 1500
        }),
        Animated.timing(this.state.animationHeight, {
          toValue: 150,
          duration: 1500
        }),
        Animated.timing(this.state.animation, {
          toValue: 0,
          duration: 1500
        })
      ])
    ).start();
  };

  render() {
    const animatedStyles = {
      top: this.state.animation,
      left: this.state.animation,
      right: this.state.animation,
      height: this.state.animationHeight
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
    // because of position: "absolute",
    // the box appears on the left top corner.
    // It does not respect the style of the parent i.e. `container`
    position: "absolute",
    // width: 150,
    // height: 150,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "tomato"
  }
});
