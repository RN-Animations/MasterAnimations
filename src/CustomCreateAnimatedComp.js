import React, { Component } from "react";
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  View,
  Animated,
  ref
} from "react-native";
import CustomButton from "./components/CustomButton";

const AnimatedButton = Animated.createAnimatedComponent(CustomButton);
// Check also the video for the case you want to pass in a CustomButton...
export default class CustomCreateAnimatedComp extends Component {
  state = {
    animation: new Animated.Value(0)
  };
  // for the ref button
  // Here our customButton gets detected by animated,
  // and we forward the setNativeProps to the real actuall native component
  setNativeProps = props => {
    this.button.setNativeProps(props);
  };

  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 1500
    }).start(() => {
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 300
      }).start();
    });
  };

  render() {
    const animatedColor = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ["white", "black"]
    });

    const animatedBackgroundColor = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ["tomato", "lightblue"]
    });

    return (
      <View style={styles.container}>
        {/* Animated works also on props (like color) not only styles */}
        <AnimatedButton
          ref={(ref) => (this.button = ref)}
          title="Press Me"
          onPress={this.startAnimation}
          color={animatedColor}
          backgroundColor={animatedBackgroundColor}
          // textStyle={animatedColor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
