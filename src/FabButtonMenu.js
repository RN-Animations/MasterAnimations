import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  Animated,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class FabButtonMenu extends Component {
  state = {
    animation: new Animated.Value(0)
  };
  toggleOpen = () => {
    const toValue = this._open ? 0 : 1;

    Animated.timing(this.state.animation, {
      toValue,
      duration: 200
    }).start();

    this._open = !this._open;
  };

  render() {
    const reloadStyle = {
      transform: [
        {
          scale: this.state.animation
          //   .interpolate({
          //     inputRange: [0, 1],
          //     outputRange: [0, 1],
          //     extrapolate: "clamp"
          //   })
        },
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -70]
          })
        }
      ]
    };

    const orderStyle = {
      transform: [
        {
          scale: this.state.animation
        },
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -140]
          })
        }
      ]
    };
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.button, styles.other, orderStyle]}>
            <Icon name="food-fork-drink" size={20} color="#555" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.button, styles.other, reloadStyle]}>
            <Icon name="reload" size={20} color="#555" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.toggleOpen}>
          <View style={[styles.button, styles.pay]}>
            <Text style={styles.payText}>$5.00</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    backgroundColor: "rgba(0,0,0,.2)",
    position: "absolute",
    width: 60,
    height: 60,
    bottom: 20,
    right: 20,
    borderRadius: 30
  },
  button: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#333",
    shadowOpacity: 0.1,
    shadowOffset: { x: 2, y: 0 },
    shadowRadius: 2,
    borderRadius: 30,
    position: "absolute",
    bottom: 20,
    right: 20
  },
  other: {
    backgroundColor: "#FFF"
  },
  payText: {
    color: "#FFF"
  },
  pay: {
    backgroundColor: "#00B15E"
  },
  label: {
    color: "#FFF",
    position: "absolute",
    fontSize: 18,
    backgroundColor: "transparent"
  }
});
