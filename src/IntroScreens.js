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

const getScreen1Styles = (animation, width) => {
  const image2TranslateX = animation.interpolate({
    inputRange: [0, width],
    outputRange: [0, -100],
    extrapolate: "clamp"
  });

  return {
    image2: {
      transform: [
        {
          translateX: image2TranslateX
        }
      ]
    }
  };
};

const getScreen2Styles = (animation, width) => {
  // Here we have an input and an output animation
  // 0 = entrance, width = stable position, width * 2 = exit
  const inputRange = [0, width, width * 2];

  const image2TranslateY = animation.interpolate({
    inputRange,
    outputRange: [100, 0, -100],
    extrapolate: "clamp"
  });

  const image2Opacity = animation.interpolate({
    // inputRange is different than the lecture's code
    inputRange: [0, width / 2, width, width * 2],
    outputRange: [0, 0, 1, 0],
    extrapolate: "clamp"
  });

  return {
    image2: {
      opacity: image2Opacity,
      transform: [
        {
          translateY: image2TranslateY
        }
      ]
    }
  };
};
const getScreen3Styles = (animation, width) => {
  const inputRange = [width, width * 2, width * 3];

  const imageScale = animation.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: "clamp"
  });

  const image2Rotate = animation.interpolate({
    inputRange,
    outputRange: ["-180deg", "0deg", "180deg"],
    extrapolate: "clamp"
  });

  return {
    image1: {
      transform: [
        {
          scale: imageScale
        }
      ]
    },
    image2: {
      transform: [
        {
          scale: imageScale
        },
        {
          rotate: image2Rotate
        }
      ]
    }
  };
};

export default class IntroScreens extends Component {
  state = {
    animation: new Animated.Value(0)
  };
  render() {
    const { width, height } = Dimensions.get("window");
    const screen1Styles = getScreen1Styles(this.state.animation, width);
    const screen2Styles = getScreen2Styles(this.state.animation, width);
    const screen3Styles = getScreen3Styles(this.state.animation, width);
    /*  pagingEnabled
        When true, the scroll view stops on multiples 
        of the scroll view's size when scrolling. 
        This can be used for horizontal pagination. 
        The default value is false.
        Note: Vertical pagination is not supported on Android. 
        onScroll
        Fires at most once per frame during scrolling. 
        The frequency of the events can be controlled 
        using the scrollEventThrottle prop. 
        The event has the shape 
        { nativeEvent: { 
          contentInset: { bottom, left, right, top }, 
          contentOffset: { x, y }, 
          contentSize: { height, width }, 
          layoutMeasurement: { height, width }, zoomScale } 
          }
        All values are numbers. */

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
              <Animated.Image
                source={Images.Image2}
                style={[
                  {
                    width: PixelRatio.getPixelSizeForLayoutSize(46),
                    height: PixelRatio.getPixelSizeForLayoutSize(28),
                    position: "absolute",
                    top: 200,
                    left: 60
                  },
                  screen1Styles.image2
                ]}
                resizeMode="contain"
              />
              <Animated.Image
                source={Images.Image3}
                style={{
                  width: PixelRatio.getPixelSizeForLayoutSize(23),
                  height: PixelRatio.getPixelSizeForLayoutSize(17),
                  position: "absolute",
                  top: 180,
                  left: 60
                }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.container}>
              <Text>Screen 1</Text>
            </View>
          </View>
          {/* Screen 2 */}
          <View style={{ width, height, backgroundColor: "#F89E20" }}>
            <View style={styles.screenHeader}>
              <Animated.Image
                source={Images.Image1}
                style={{
                  width: PixelRatio.getPixelSizeForLayoutSize(75),
                  height: PixelRatio.getPixelSizeForLayoutSize(63)
                }}
                resizeMode="contain"
              />
              <Animated.Image
                source={Images.Image2}
                style={[
                  {
                    width: PixelRatio.getPixelSizeForLayoutSize(46),
                    height: PixelRatio.getPixelSizeForLayoutSize(28),
                    position: "absolute",
                    top: 200,
                    left: 60
                  },
                  screen2Styles.image2
                ]}
                resizeMode="contain"
              />
              <Animated.Image
                source={Images.Image3}
                style={{
                  width: PixelRatio.getPixelSizeForLayoutSize(23),
                  height: PixelRatio.getPixelSizeForLayoutSize(17),
                  position: "absolute",
                  top: 180,
                  left: 60
                }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.container}>
              <Text>Screen 2</Text>
            </View>
          </View>
          {/* Screen 3 */}
          <View style={{ width, height, backgroundColor: "#F89E20" }}>
            <View style={styles.screenHeader}>
              <Animated.Image
                source={Images.Image1}
                style={[
                  {
                    width: PixelRatio.getPixelSizeForLayoutSize(75),
                    height: PixelRatio.getPixelSizeForLayoutSize(63)
                  },
                  screen3Styles.image1
                ]}
                resizeMode="contain"
              />
              <Animated.Image
                source={Images.Image2}
                style={[
                  {
                    width: PixelRatio.getPixelSizeForLayoutSize(46),
                    height: PixelRatio.getPixelSizeForLayoutSize(28),
                    position: "absolute",
                    top: 200,
                    left: 60
                  },

                  screen3Styles.image2
                ]}
                resizeMode="contain"
              />
              <Animated.Image
                source={Images.Image3}
                style={{
                  width: PixelRatio.getPixelSizeForLayoutSize(23),
                  height: PixelRatio.getPixelSizeForLayoutSize(17),
                  position: "absolute",
                  top: 180,
                  left: 60
                }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.container}>
              <Text>Screen 3</Text>
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
