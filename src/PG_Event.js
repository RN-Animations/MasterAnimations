import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Animated, ScrollView } from "react-native";

const PG_Event = () => {
  const [animation] = useState(new Animated.Value(0));

  let panResponder = null;
  useEffect(() => {
    panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (e, gestureState) => {
        // animation.setValue({ x: 0, y: gestureState.dy });
        animation.interpolate({
          inputRange: [0, 3000],
          outputRange: ["rgb(255,99,71)", "rgb(99,701,255)"]
        });
      }
    });
  });
  const backgroundHandler = () => {
  
  };
  const backgroundStyle = {
    backgroundColor: backgroundInterpolate
  };
  return (
    <View style={styles.container}>
      <ScrollView scrollEventThrottle={16} onScroll={event => {
                scrollOffset = event.nativeEvent.contentOffset.y;

      }}>
        <Animated.View
          style={[styles.content, backgroundStyle]}
          {...panResponder.panHandlers}
        />
      </ScrollView>
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
