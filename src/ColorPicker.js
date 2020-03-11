import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";

import Icon from "react-native-vector-icons/Foundation";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class ColorPicker extends Component {
  state = {
    animation: new Animated.Value(0), // open/close animation
    buttonAnimation: new Animated.Value(0),
    color: "#000" // drive the value in the input
  };

  handleToggle = () => {
    const toValue = this._open ? 0 : 1;
    Animated.spring(this.state.animation, {
      toValue
    }).start();

    this._open = !this._open;
  };

  toggleInput = () => {};

  render() {
    const rowStyle = {
      opacity: this.state.animation,
      transform: [
        {
          scaleY: this.state.animation
        }
      ]
    };

    const colorStyle = {
      backgroundColor: this.state.color
    };
    const iconStyle = {};

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.rowWrap, rowStyle]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[styles.colorBall, colorStyle]}
            ></Animated.View>
          </TouchableWithoutFeedback>
          <View style={styles.row}>
            <TouchableOpacity>
              <AnimatedIcon
                name="bold"
                size={30}
                color="#555"
                style={iconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <AnimatedIcon
                name="italic"
                size={30}
                color="#555"
                style={iconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <AnimatedIcon
                name="align-center"
                size={30}
                color="#555"
                style={iconStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <AnimatedIcon
                name="link"
                size={30}
                color="#555"
                style={iconStyle}
              />
              {/* Text input */}
            </TouchableOpacity>
            <Animated.View
              style={[StyleSheet.absoluteFill, styles.colorRowWrap]}
            >
              <AnimatedTextInput style={styles.input} />
              <TouchableWithoutFeedback>
                {/* Button */}
                <Animated.View style={styles.okayButton}>
                  <Text style={styles.okayText}>OK</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </Animated.View>
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
    justifyContent: "center"
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
    paddingHorizontal: 10
  },
  row: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    overflow: "hidden"
  },

  colorRowWrap: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: 5
  },
  input: {
    flex: 1
  },
  okayButton: {
    borderRadius: 20,
    height: "100%",
    width: 40,
    backgroundColor: "#309EEB",
    alignItems: "center",
    justifyContent: "center"
  },
  okayText: {
    color: "#FFF"
  },
  colorBall: {
    width: 15,
    height: 15,
    borderRadius: 8
  },
  button: {
    marginTop: 50
  }
});

console.disableYellowBox = true;
