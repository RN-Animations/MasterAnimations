import React, { useState } from "react";
import { StyleSheet, Text, View, Animated, ScrollView } from "react-native";

const Event = () => {
  const [animation] = useState(new Animated.Value(0));

  const backgroundInterpolate = animation.interpolate({
    inputRange: [0, 3000],
    outputRange: ["rgb(255,99,71)", "rgb(99,701,255)"]
  });

  const backgroundStyle = {
    backgroundColor: backgroundInterpolate
  };
  return (
    <View style={styles.container}>
      <ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {
                y: animation
              }
            }
          }
        ])}
      >
        <Animated.View style={[styles.content, backgroundStyle]} />
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

export default Event;