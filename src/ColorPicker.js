import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import Icon from "react-native-vector-icons/Foundation";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class ColorPicker extends Component {
  state = {
    
  };

  handleToggle = () => {
   
  };

  toggleInput = () => {

  };

  render() {
   

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleToggle} style={styles.button}>
          <Text>Toggle Open/Closed</Text>
        </TouchableOpacity>
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
  rowWrap: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "50%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#333",
    shadowOpacity: 0.2,
    shadowOffset: { x: 2, y: 2 },
    shadowRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  row: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    overflow: "hidden",
  },

  colorRowWrap: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: 5,
  },
  input: {
    flex: 1,
  },
  okayButton: {
    borderRadius: 20,
    height: "100%",
    width: 40,
    backgroundColor: "#309EEB",
    alignItems: "center",
    justifyContent: "center",
  },
  okayText: {
    color: "#FFF",
  },
  colorBall: {
    width: 15,
    height: 15,
    borderRadius: 8,
  },
  button: {
    marginTop: 50,
  },
});


console.disableYellowBox = true;