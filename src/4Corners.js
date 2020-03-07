import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";

// We use onLayout to save the width and height
export default class $4Corners extends Component {
  state = {
    animation: new Animated.ValueXY()
  };
  startAnimation = () => {
    const { width, height } = Dimensions.get("window");

    Animated.sequence([
      Animated.spring(this.state.animation.y, {
        toValue: height - this._height
      }),
      Animated.spring(this.state.animation.x, {
        toValue: width - this._width
      }),
      Animated.spring(this.state.animation.y, {
        toValue: 0
      }),
      Animated.spring(this.state.animation.x, {
        toValue: 0
      })
    ]).start();
  };

  saveDimensions = e => {
    this._width = e.nativeEvent.layout.width;
    this._height = e.nativeEvent.layout.height;
  };

  render() {
    const animatedStyles = {
        // getTranslateTransform: Converts {x, y} into a useable translation transform
        transform: this.state.animation.getTranslateTransform() 
    };
    return (
      <View style={styles.container}>
        {/* TouchableWithoutFeedback does a clone of the View below,
         so it propagates the onLayout down to the View. 
         onLayout
            Invoked on mount and layout changes with:
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
