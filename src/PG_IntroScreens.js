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
import IntroScreenComponent from "./components/IntroScreenComponent";

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
  // 0= entrance, width=stable position, width * 2=exit
  const inputRange = [0, width, width * 2];

  const image2TranslateY = animation.interpolate({
    inputRange,
    outputRange: [100, 0, -100],
    extrapolate: "clamp"
  });

  const image2Opacity = animation.interpolate({
    // inputRange is different than the given code
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

export default class PG_IntroScreens extends Component {
  state = {
    animation: new Animated.Value(0)
  };
  render() {
    const { width } = Dimensions.get("window");
    const screen1Styles = getScreen1Styles(this.state.animation, width);
    const screen2Styles = getScreen2Styles(this.state.animation, width);
    const screen3Styles = getScreen3Styles(this.state.animation, width);

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
          <IntroScreenComponent screenStyles={screen1Styles.image2} text='Screen 1' />
          <IntroScreenComponent screenStyles={screen2Styles.image2} text='Screen 2' />
          <IntroScreenComponent screenStyles={screen3Styles.image1} screenStyles2={screen3Styles.image1}  text='Screen 2' />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
