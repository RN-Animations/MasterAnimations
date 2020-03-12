import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Dimensions,
  PixelRatio
} from "react-native";

import * as Images from "../utilities/imagesForIntroScreen";

// Animations that work on a ScrollView!
export default class IntroScreens extends Component {
  state = {
    animation: new Animated.Value(0)
  };
  render() {
    const { width, height } = Dimensions.get("window");

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          pagingEnabled
          horizontal
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: this.state.animation
                }
              }
            }
          ])}
        >
          {/* Single page ready to resive content */}
          <View style={{ width, height, backgroundColor: "#F89E20" }}>
            <View style={styles.screenHeader}>
              <Animated.Image
                source={Images.Image1}
                /* To ensure that the images will be the same size 
                regardless of the size of the phone 
                we'll use the PixelRatio.getPixelSizeForLayoutSize call. 
                This will multiply the value you give it 
                by the pixel density of the device.  */
                style={{
                  width: PixelRatio.getPixelSizeForLayoutSize(75),
                  height: PixelRatio.getPixelSizeForLayoutSize(63)
                }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.container}>
              <Text>Screen 1</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  screenHeader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  screenText: {
    flex: 1
  }
});
