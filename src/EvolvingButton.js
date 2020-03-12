import React, { Component } from "react";
import { StyleSheet, Text, View, Animated, TextInput, Dimensions, TouchableWithoutFeedback } from "react-native";

import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

export default class EvolvingButton extends Component {

  state = {
    animation: new Animated.Value(0),
    open: false,
  };

  toggleTransform = () => {
    
  }

  render() {
    const { width } = Dimensions.get("window");


    return (
      <View style={styles.container}>

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
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    // fontSize: 28
  },
  editor: {
    borderWidth: 1,
    borderColor: "rgba(0,0, 0, .1)",
    // shadowColor: "#000",
    // shadowOpacity: .05,
    // shadowRadius: 3,
    // shadowOffset: { x: 0, y: 3 }
  },
  bar: {
    backgroundColor: "#2979FF",
    height: 50,
    justifyContent: "center",
  },
  toolbar: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  rightInnerBar: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  lowerView: {
    height: 150,
    overflow: "hidden",
  },
  input: {
    padding: 10,
    fontSize: 20,
  },
  close: {
    color: "#2979FF",
    marginTop: 10,
  }
});