import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Animated, PanResponder } from "react-native";

const PG_Event = () => {
  const [animation] = useState(new Animated.Value(0));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dy: animation,
        dx: animation
      }
    ]),
    onPanResponderTerminationRequest: (evt, gestureState) => true
  });

  const backgroundInterpolate = animation.interpolate({
    inputRange: [0, 400],
    outputRange: ["rgb(255,99,71)", "rgb(99,701,255)"]
  });

  const backgroundStyle = {
    backgroundColor: backgroundInterpolate
  };
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.content, backgroundStyle]}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    height: 3000
  }
});

export default PG_Event;
