import React, { Component } from "react";
import {
  AppRegistry,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Animated
} from "react-native";

import Moment from "./components/moment";

const { width, height } = Dimensions.get("window");
const Images = [
  {
    image: require("../assets/1.jpeg"),
    title: "The Lord Jesus Christ"
  },
  {
    image: require("../assets/2.jpeg"),
    title: "Saint John the Babtist"
  },
  {
    image: require("../assets/3.jpeg"),
    title: "Mother of God"
  },
  {
    image: require("../assets/4.jpeg"),
    title: "Saint Nicolas"
  }
];

const getInterpolate = (animatedScroll, i, imageLength) => {
  const inputRange = [
    // 1st. setup the translateX for the image, before it's swiped.
    (i - 1) * width,
    i * width,
    (i + 1) * width
  ];
  const outputRange = i === 0 ? [0, 0, 150] : [-300, 0, 150];

  return animatedScroll.interpolate({
    inputRange,
    outputRange,
    extrapolate: "clamp"
  });
};

const getSeparator = i => {
  return (
    <View
      key={i}
      // left: (i - 1) * width - 2.5} = this will cause the separator
      // to be right in the middle of both images.
      style={[styles.separator, { left: (i - 1) * width - 2.5 }]}
    />
  );
};

export default class HorizontalParallaxScrollView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedScroll: new Animated.Value(0)
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          pagingEnabled // stops on multiples of the width
          horizontal // flag
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.state.animatedScroll
                  }
                }
              }
            ],
            // { listener: event => console.log(event) }
          )}
        >
          {Images.map((image, i) => {
            return (
              <Moment
                key={i}
                {...image}
                translateX={getInterpolate(
                  this.state.animatedScroll,
                  i,
                  Images.length
                )}
              />
            );
          })}
          {Array.apply(null, { length: Images.length + 1 }).map((_, i) =>
            getSeparator(i)
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333"
  },
  separator: {
    backgroundColor: "#000",
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 5
  }
});
