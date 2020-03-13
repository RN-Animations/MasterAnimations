import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";

import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

export default class EvolvingButton extends Component {
  state = {
    animation: new Animated.Value(0),
    open: false
  };

  toggleTransform = () => {};

  render() {
    const { width } = Dimensions.get("window");

    const widthInterpolate = this.state.animation.interpolate({
      inputRange: [0, 0.5],
      outputRange: [100, width - 40]
    });

    const opacityToolbarInterpolate = this.state.animation.interpolate({
      inputRange: [0, 0.5],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });

    const toolbarStyles = {
      opacity: opacityToolbarInterpolate
    }

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.center} behavior="padding">
          <Animated.View style={[styles.editor, { width: widthInterpolate }]}>
            {/* Wrapping bar */}
            <View style={styles.bar}>
              {/* Use Animated to adjust the opacity */}
              <Animated.View style={[styles.toolbar, toolbarStyles]}>
                <Icon name="format-bold" color="#FFF" size={20} />
                <Icon name="format-italic" color="#FFF" size={20} />
                <Icon name="format-underline" color="#FFF" size={20} />
                <Icon name="format-list-bulleted" color="#FFF" size={20} />
                <Icon name="format-list-numbered" color="#FFF" size={20} />
                <View style={styles.rightInnerBar}>
                  <Icon name="link" color="#FFF" size={20} />
                  <Icon name="image" color="#FFF" size={20} />
                  <Icon name="arrow-down-bold-box" color="#FFF" size={20} />
                </View>
              </Animated.View>
            </View>
            {/* This is our "write" button */}
            <Animated.View style={[StyleSheet.absoluteFill, styles.center]}>
              <TouchableWithoutFeedback>
                <View>
                  <Text style={styles.buttonText}>Write</Text>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
            {/* This Animated.View will slide up and create that stack up motion */}
            <Animated.View style={[styles.lowerView]}>
              <TextInput
                placeholder="Start typing..."
                multiline
                ref={input => (this._input = input)}
                style={[StyleSheet.absoluteFill, styles.input]} // so it will take the height of the parent
              />
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
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
  center: {
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#FFF"
    // fontSize: 28
  },
  editor: {
    borderWidth: 1,
    borderColor: "rgba(0,0, 0, .1)"
    // shadowColor: "#000",
    // shadowOpacity: .05,
    // shadowRadius: 3,
    // shadowOffset: { x: 0, y: 3 }
  },
  bar: {
    backgroundColor: "#2979FF",
    height: 50,
    justifyContent: "center"
  },
  toolbar: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden"
  },
  rightInnerBar: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  lowerView: {
    height: 150,
    overflow: "hidden"
  },
  input: {
    padding: 10,
    fontSize: 20
  },
  close: {
    color: "#2979FF",
    marginTop: 10
  }
});
