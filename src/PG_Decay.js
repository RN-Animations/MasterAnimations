import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder
} from "react-native";

const PG_Decay = () => {
  const [animation] = useState(new Animated.ValueXY(0));

  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
      animation.extractOffset();
    },
    onPanResponderMove: Animated.event([
      null,
      { dx: animation.x, dy: animation.y }
    ]),
    onPanResponderRelease: (e, { vx, vy }) => {
      Animated.decay(animation, {
        velocity: { x: vx, y: vy },
        deceleration: 0.997
      }).start();
    }
  });

  // These two are equivalent
  // const animatedStyle = {
  //   transform: animation.getTranslateTransform()
  // }
  const animatedStyle = {
    transform: [
      {
        translateX: animation.x
      },
      {
        translateY: animation.y
      }
    ]
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.box, animatedStyle]}
        {..._panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: "tomato"
  }
});

export default PG_Decay;
