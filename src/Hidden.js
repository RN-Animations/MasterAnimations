import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
// Usefull for hiding modals!
export default class Hidden extends Component {
  state = {
    animation: new Animated.Value(1),
    visible: true,
  };
  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 1500, // enough time to interupt the animation
    }).start(({ finished }) => { // finished is the only property in there
        console.log('finished', finished);
        /* 
        Here we want to deviate from which animation is being triggered.
        What is `setTimeout` for?
        When we trigger our animation and then, before it's finished we
        trigger it again, the `setTimeout` will run synchronously and then 
        the second animation will start. So `setTimeout` will just set up our
        animation to trigger on the next click.
        */
      setTimeout(() => {
        if (finished) {
          this.setState({ visible: false });
        } else {
          Animated.spring(this.state.animation, {
            toValue: 1,
          }).start();
        }
      }, 0);
    });
  };

  render() {
    const translateYInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [500, 0],
    });

    const animatedStyles = {
      opacity: this.state.animation,
      transform: [
        {
          translateY: translateYInterpolate,
        },
      ],
    };
    return (
      <View style={styles.container}>
        {this.state.visible &&
          <TouchableWithoutFeedback onPress={this.startAnimation}>
            <Animated.View style={[styles.box, animatedStyles]} />
          </TouchableWithoutFeedback>}
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
  },
});
