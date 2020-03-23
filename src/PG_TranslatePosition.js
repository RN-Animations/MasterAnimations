import React, { Component } from "react";
import { StyleSheet, View, Animated, TouchableWithoutFeedback } from "react-native";

export default class PG_TranslatePosition extends Component {
  state = {
    animation: new Animated.Value(0),
  };
  startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.animation, {
        toValue: 300,
        duration: 1500
      }),
      Animated.timing(this.state.animation, {
        toValue: -300, 
        duration: 2000
      }),
      // Animated.spring(this.state.animation, {
      //   toValue: 0, 
      //   duration: 1000
      // })
    ]).start(() => {
      // this.state.animation.setValue(0)
      Animated.spring(this.state.animation, {
        toValue: 0, 
        duration: 1000
      }).start()
    })
  }
  
  render() {
    const animatedStyles = {
      transform: [
        { translateY: this.state.animation }
      ]
    }
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
    justifyContent: "center",
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: "tomato",
  }
});