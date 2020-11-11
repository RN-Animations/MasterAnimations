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

export default class PG_CreateAnimatedComp extends Component {
  state = {
    animation: new Animated.Value(0),
    opacity: new Animated.Value(1)
  };
  // for the ref button
  // Here our customButton gets detected by animated,
  // and we forward the setNativeProps to the real actuall native component
  setNativeProps = props => {
    this.button.setNativeProps(props);
  };

  startAnimation = () => {
    Animated.sequence([
      Animated.loop(
        Animated.timing(this.state.animation, {
          toValue: 1,
          duration: 1500
        }),
        (Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 1500
        }),
        // NOT LOOPING BACK !!! ???
        Animated.delay(1000),
        Animated.timing(this.state.animation, {
          toValue: 0,
          duration: 1500
        }),
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 1500
        }))
      )
    ]).start();
  };

  render() {
    const animatedColor = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ["white", "black"]
    });

    const animatedBackgroundColor = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ["white", "lightblue"]
    });
    const animatedOpacity = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    const opacityStyle = {
      opacity: animatedOpacity
    };

    return (
      <View style={styles.container}>
        {/* Animated works also on props (like color) not only styles */}
        <AnimatedButton
          ref={ref => (this.button = ref)}
          title="Hello there"
          onPress={this.startAnimation}
          color={animatedColor}
          backgroundColor={animatedBackgroundColor}
          style={{ opacityStyle }}
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
