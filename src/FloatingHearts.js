import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Animated
} from "react-native";

const { width, height } = Dimensions.get("window");

export default class FloatingHearts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hearts: []
    };

    this.handleAddHeart = this.handleAddHeart.bind(this);
  }
  handleAddHeart() {
   
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleAddHeart}>
          <View style={StyleSheet.absoluteFill}>
           
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const Heart = ({ style }) => (
  <Animated.View style={[styles.heart, style]}>
    <View style={[styles.heartShape, styles.leftHeart]} />
    <View style={[styles.heartShape, styles.rightHeart]} />
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  heart: {
    width: 50,
    height: 50,
    position: "absolute"
  },
  heartShape: {
    width: 30,
    height: 45,
    position: "absolute",
    top: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#6427d1"
  },
  leftHeart: {
    transform: [{ rotate: "-45deg" }],
    left: 5
  },
  rightHeart: {
    transform: [{ rotate: "45deg" }],
    right: 5
  }
});