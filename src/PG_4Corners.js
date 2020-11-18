import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";

// We use onLayout to save the width and height
export default class PG_4Corners extends Component {
  state = {
    animation: new Animated.ValueXY(),
    anim_width: new Animated.Value(150),
    anim_height: new Animated.Value(150)
  };
  startAnimation = () => {
    const { width, height } = Dimensions.get("window");

    Animated.sequence([
      Animated.timing(this.state.anim_height, {
        toValue: height,
        duration: 800,
        easing: Easing.bounce
      }),
      Animated.timing(this.state.animation.y, {
        toValue: height - this._height, // or - 150
        duration: 800
      }),
      Animated.timing(this.state.anim_height, {
        toValue: 150,
        duration: 800
      }),
      Animated.timing(this.state.anim_width, {
        toValue: width,
        duration: 800,
        easing: Easing.bounce
      }),
      Animated.timing(this.state.animation.x, {
        toValue: width - this._width, // or - 150
        duration: 800
      }),
      Animated.timing(this.state.anim_width, {
        toValue: 150,
        duration: 800
      }),
      Animated.timing(this.state.anim_height, {
        toValue: height,
        duration: 800
      }),
      Animated.timing(this.state.animation.y, {
        toValue: 0,
        duration: 800,
        easing: Easing.bounce
      }),
      Animated.timing(this.state.anim_height, {
        toValue: 150,
        duration: 800
      }),
      Animated.timing(this.state.anim_width, {
        toValue: width,
        duration: 800
      }),
      Animated.timing(this.state.animation.x, {
        toValue: 0,
        duration: 800,
        easing: Easing.bounce
      }),
      Animated.timing(this.state.anim_width, {
        toValue: 150,
        duration: 800
      })
    ]).start();
  };

  saveDimensions = e => {
    this._width = e.nativeEvent.layout.width;
    this._height = e.nativeEvent.layout.height;
  };

  render() {
    const widthInterpolate = this.state.anim_width.interpolate({
      inputRange: [150, 300],
      outputRange: [150, 300]
    });
    const heightInterpolate = this.state.anim_height.interpolate({
      inputRange: [150, 300],
      outputRange: [150, 300]
    });

    const animatedStyles = {
      /* 
      getTranslateTransform
      This is a helper that just saves you some code. 
      The equivalence of what it generates 
      is something like so:
      this._animatedValue = new Animated.ValueXY();
      transform: [
          {
              translateX: this._animatedValue.x
          },
          {
              translateY: this._animatedValue.y
          }
      ]
     */
      transform: this.state.animation.getTranslateTransform(),
      width: widthInterpolate,
      height: heightInterpolate
    };
    return (
      <View style={styles.container}>
        {/* TouchableWithoutFeedback does a clone of the View below,
         so it propagates the onLayout down to the View. 
         onLayout
            Invoked on `mount` and `layout` changes with:
            {nativeEvent: { layout: {x, y, width, height}}}
            This event is fired immediately once the layout has been calculated, 
            but the new layout may not yet be reflected on the screen 
            at the time the event is received, 
            especially if a layout animation is in progress.

            Use ref to confirm that you have the mesurments of onLayout,
            by doing a mesure call.
         */}
        <TouchableWithoutFeedback
          onPress={this.startAnimation}
          onLayout={this.saveDimensions}
        >
          <Animated.View style={[styles.box, animatedStyles]} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: "tomato",
    position: "absolute",
    top: 0,
    left: 0
  }
});
