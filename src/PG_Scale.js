import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

export default class PG_Scale extends Component {
  state = {
    animation1: new Animated.Value(1),
    animation2: new Animated.Value(1)
  };
  startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.animation1, {
        toValue: 2,
        // toValue: -2, // it will flip upside down
        duration: 500
      }),
      Animated.timing(this.state.animation2, {
        toValue: 3,
        // toValue: -2, // it will flip upside down
        duration: 500
      })
    ]).start();
    // Animated.timing(this.state.animation1, {
    //   toValue: 2,
    //   // toValue: -2, // it will flip upside down
    //   duration: 500
    // }).start(() => {
    //   // this.state.animation.setValue(1);
    // });
  };

  render() {
    const animatedStyles = {
      transform: [
        // { scale: this.state.animation }
        { scaleX: this.state.animation1 },
        { scaleY: this.state.animation2 }
      ]
    };
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.startAnimation}>
          <Animated.View style={[styles.box, animatedStyles]}>
            <Text>This side forward</Text>
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
    backgroundColor: "tomato"
  }
});
