### Interrupted Animation
- Intro

Handling interrupted animations is a crucial part of the user experience. Generally when animations are quick, or they are a single animation the chances of being interrupted is lower. However when dealing with more complex, and longer running animations you don't want to trap the user after they have made a mistake.

- Setup

We've got our basic box, and 2 animated values. One will be for the translation of our box and the other will be for the opacity.

```
<code class="js language-js">
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
 
export default class animations extends Component {
  state = {
    animation: new Animated.Value(0),
    opacity: new Animated.Value(1),
  };
  startAnimation = () => {
 
  };
 
  render() {
    const animatedStyles = {
      opacity: this.state.opacity,
      transform: [{ translateY: this.state.animation }],
    };
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.startAnimation}>
          <Animated.View style={[styles.box, animatedStyles]} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: "tomato",
  },
});
 
AppRegistry.registerComponent("animations", () => animations);
</code>
```
 
- Animate

Here we setup our basic animation, it will translate to 300 and slowly fade away to 0 opacity. These both will happen over 1500 milliseconds. However you'll notice that we will reset our opacity to 1 with a setTimeout every time we tap on our box.

Because we use a combination of animations, if one animation is effected an interruption will happen and they'll both stop.

Also realize, we are resetting ONLY the opacity. This means if we re-trigger our animation, the this.state.animation will retain it's current value. Which means we'll now animate from the value over the course of a NEW 1500 milliseconds. That means our animation will just continually get slower.

```
<code class="js language-js">startAnimation = () => {
    Animated.parallel(
      [
        Animated.timing(this.state.animation, {
          toValue: 300,
          duration: 1500,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 1500,
        }),
      ]
    ).start();
 
    setTimeout(() => {
      this.state.opacity.setValue(1);
    }, 500);
  };
</code>
```
- Handle Finished

The start callback is passed an object with finished. How you handle the interrupted animation depends on your use case. Sometimes you may just want to skip it all together as the user may want it to be gone, or maybe it was a mistake press and you want to reset it back to the start.

In our case we'll reset it back to the beginning if our finished is false.

To understand why we're using setTimeout refer to the Animate hidden tutorial.

```
<code class="js language-js">
.start(({ finished }) => {
      if (!finished) {
        setTimeout(() => {
          Animated.spring(this.state.animation, {
            toValue: 0,
          }).start();
          Animated.spring(this.state.opacity, {
            toValue: 1,
          }).start();
        }, 0)
      }
    });
</code>
```

- Stop Together

In our case we are using parallel. Parallel gives you the option to not stop the animations at the same time. This isn't an option with sequence or stagger. However just know that finished in this case will always be true as at least one of the animations is allowed to complete.

If you were to add this.state.animation.setValue(0); and reset our animation for translate, all animations would have been interrupted and in that case finished would be false.

```
<code class="js language-js">
Animated.parallel(
      [
        Animated.timing(this.state.animation, {
          toValue: 300,
          duration: 1500,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 1500,
        }),
      ]
      , { stopTogether: false }
    )
</code>
<code class="js language-js">setTimeout(() => {
  this.state.opacity.setValue(1);
  this.state.animation.setValue(0);
}, 500);
</code>
```
- Ending

Handling interrupted animations is key to ensuring that your app and your animations provide the proper experience.

Live Demo Code

Resources for this lecture
Repo
Live Demo