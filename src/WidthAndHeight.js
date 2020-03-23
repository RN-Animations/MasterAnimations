import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

/* 
Animating width and height values will effect layout. 
These may not always be the most performant however 
sometimes they are necessary. These are commonly used 
when you have predefined sizing. They are also typically 
used for dynamic sizing. With React Native you are able to measure 
the size of elements asynchronously.

One common animation is an accordion. 
With dynamic measurement you could measure the height 
of some content then animate the content from a predefined height 
to it's actual height. There are many other possibilities 
but we'll cover those in our more complex examples. 
This may not be performant on larger blocks of content and is 
actually a very difficult animation.
*/
export default class WidthAndHeight extends Component {
  state = {
    animation: new Animated.Value(150)
  };
  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 300,
      duration: 1500
    }).start(() => {
      //   this.state.animation.setValue(150);
    });
  };

  render() {
    const animatedStyles = {
      width: this.state.animation,
      height: this.state.animation
    };
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.startAnimation}>
          <Animated.View style={[styles.box, animatedStyles]}>
            {/* Changing the width and height effect layout.
            It's not the same like scaling.
            Check PG_Scale */}
            <Text>
              Long long text, Long long text, Long long text, Long long text,
              Long long text, Long long text, Long long text, Long long text
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  box: {
    // width: 150,
    // height: 150,
    backgroundColor: "tomato"
  }
});
