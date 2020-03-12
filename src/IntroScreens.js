import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Dimensions,
  PixelRatio,
} from "react-native";

import * as Images from '../utilities/imagesForIntroScreen';


export default class IntroScreens extends Component {
  state = {
    animation: new Animated.Value(0),
  };
  render() {
    const { width, height } = Dimensions.get("window");


    return (
      <View style={styles.container}>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screenText: {
    flex: 1,
  },
});
