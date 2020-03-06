import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Calling setState to disable a ScrollView may cause performanse issues.
// But with setNativeProps we can bypass setState.

export default class SetNativeProps extends Component {
  state = {
    animation: new Animated.Value(0),
  };
  // use this to have the ScrollView always enabled to true.
  _enabled = true;

  handleToggle = () => {
    this._enabled = !this._enabled;
    let style = [styles.scroll];

    if (!this._enabled) {
      style.push(styles.hide);
    } else {
      // style.push(styles.show)
    }

    // in setNativeProps we pass an object
    this._scroll.setNativeProps({
      scrollEnabled: this._enabled,
      style,
    });
  };

  render() {
    const bgInterpolate = this.state.animation.interpolate({
      inputRange: [0, 3000],
      outputRange: ["rgb(255,99,71)", "rgb(99,71,255)"],
    });
    const scrollStyle = {
      backgroundColor: bgInterpolate,
    };
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleToggle}>
          <Text>Toggle</Text>
        </TouchableOpacity>

        <ScrollView
          style={styles.scroll}
          // by getting this ref we are able to call setNativeProps
          ref={scroll => (this._scroll = scroll)}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.state.animation,
                },
              },
            },
          ])}
        >
          <Animated.View style={[styles.fakeContent, scrollStyle]} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scroll: {
    flex: 1,
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
  fakeContent: {
    height: 3000,
    backgroundColor: "tomato",
  },
});

