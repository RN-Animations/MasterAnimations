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
export default class AbsolutePosition extends Component {
  state = {
    animation: new Animated.Value(0)
  };
  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 300,
      duration: 1500
    }).start(() => {
      //   this.state.animation.setValue(0);
    });
  };

  render() {
    const animatedStyles = {
      top: this.state.animation,
      left: this.state.animation
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
    width: 150,
    height: 150,
    backgroundColor: "tomato"
  }
});
