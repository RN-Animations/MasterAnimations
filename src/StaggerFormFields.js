import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Animated,
  KeyboardAvoidingView
} from "react-native";

import Background from "../assets/background.jpg";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// NOTE!
// I've changed the code here and there...
const createAnimationStyle = animation => {
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-505, 0]
  });

  return {
    opacity: animation,
    transform: [
      {
        translateX
      }
    ]
  };
};

export default class StaggerFormFields extends Component {
  state = {
    // Because they are the same, we'll make a function
    // that takes an animated value and returns styling.
    // So the render method stays clean.
    email: new Animated.Value(0),
    password: new Animated.Value(0),
    button: new Animated.Value(0)
  };

  componentDidMount() {
    const timingFunc = animation => {
      return Animated.timing(animation, {
        toValue: 1,
        duration: 200
      });
    };

    Animated.stagger(250, [ 
      timingFunc(this.state.email),
      timingFunc(this.state.password),
      timingFunc(this.state.button)
    ]).start(() => {
      // Because we used createAnimatedComponent to wrap our TextInput
      // to get access to it we call getNode()
      // this._email.getNode().focus();
    });
  }

  render() {
    const emailStyle = createAnimationStyle(this.state.email);
    const passwordStyle = createAnimationStyle(this.state.password);
    const buttonStyle = createAnimationStyle(this.state.button);

    return (
      <View style={styles.container}>
        <ImageBackground
          source={Background}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { width: null, height: null }]}
        >
          <View style={styles.container} />
          <KeyboardAvoidingView style={styles.form} behavior="padding">
            <View style={styles.container}>
              <Text style={styles.title}>Login</Text>
              <AnimatedTextInput
                // ref={email => (this._email = email)}
                autoFocus={true}
                style={[styles.input, emailStyle]}
                placeholder="Email"
                keyboardType="email-address"
              />
              <AnimatedTextInput
                placeholder="Password"
                style={[styles.input, passwordStyle]}
                secureTextEntry
              />
              <TouchableOpacity>
                <Animated.View style={[styles.button, buttonStyle]}>
                  <Text style={styles.buttonText}>Login</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <View style={styles.container} />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 30,
    color: "#FFF",
    backgroundColor: "transparent",
    textAlign: "center",
    marginBottom: 10
  },
  form: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.25)",
    paddingVertical: 10
  },
  input: {
    width: 250,
    height: 35,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FFF",
    color: "#333",
    backgroundColor: "#FFF"
  },
  button: {
    marginTop: 10,
    backgroundColor: "tomato",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 16
  }
});
