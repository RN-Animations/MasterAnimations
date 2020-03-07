### Animate Hidden Explanation
- Intro

`Animated` doesn't support unmounting animations, which means you need to manually control whether or not an item will stay mounted via `state`. However there are issues with this, in that an animation can be interrupted. Interrupted animations won't be the focus of this, but we need to manage them.

- Setup

We start by setting up an `Animated.Value` and default it to 1 as we'll be passing it into `opacity`. We then also setup a `visible` of `true`. This will control whether or not the box is mounted or unmounted.

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
    animation: new Animated.Value(1),
    visible: true,
  };
 
  render() {
    return (
      <View style={styles.container}>
        {this.state.visible &&
          <TouchableWithoutFeedback onPress={this.startAnimation}>
            <Animated.View style={[styles.box]} />
          </TouchableWithoutFeedback>}
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

- Styling

We add an `interpolation` to move the box off screen when tapped, and additionally pass in an `opacity` so it's fading at the same time.

```
<code class="js language-js">
render() {
    const translateYInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [500, 0],
    });
 
    const animatedStyles = {
      opacity: this.state.animation,
      transform: [
        {
          translateY: translateYInterpolate,
        },
      ],
    };
    return (
      <View style={styles.container}>
        {this.state.visible &&
          <TouchableWithoutFeedback onPress={this.startAnimation}>
            <Animated.View style={[styles.box, animatedStyles]} />
          </TouchableWithoutFeedback>}
      </View>
    );
  }
</code>
```

- Animation

When our box is pressed we will start our animation to 0 over 1500ms. This gives us time to be able to still tap and interrupt our animation.

When an animation is interrupted our callback passed into start is called with an object that has a key of finished which is either `true` or `false`. If `true` it means our animation got to it's destination (in our case 0) without be interrupted.

If the button is pressed again our `startAnimation` would be called again and thus our `Animated.timing` would be called again. Despite animating to the same value this would interrupt our first animation we declared. Meaning our start would be called with finished as false.

Now we can do our logic. Calling the same function may be unlikely, and rather than triggering the same animation (toValue: 0), you would likely change the code path. Whether via a `setState` to say something is happening, etc.

I'm not doing that and instead just calling the same animation. However this will cause issues for us. An animation towards 0 is already executing, then we'll call a new animation towards 0. This will then cause an interrupted animation. When our animation is interrupted it will call our start callback of our previous animation with {finished: false }. We SHOULDN'T trigger another animation on the same value. We would then be triggering an animation to start, at the same time our second toValue: 0 animation would be animating.

This is why we have the `setTimeout`. This is a less than ideal solution! We should technically be tracking the animation if it's finished or not, or when an animation starts we toggle a function that is called.

We could do something like

```
<code class="js language-js"> 
 _finished = true; // on the instance
 
  startAnimation = () => {
    if (this._finished) {
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 1500,
      }).start(({ finished }) => {
        if (finished) {
          this.setState({ visible: false });
          this._finished = true;
        }
      });
    } else {
      Animated.spring(this.state.animation, {
        toValue: 1,
      }).start();
    }
 
    this._finished = false;
  };
</code>
```
Another method we could use 2 different functions. This is the most likely scenario of how you may want to do it in your actually application.

<code class="js language-js">startAnimation = () => {
  this.setState({
    started: true, 
  }, () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 1500,
    }).start(({ finished }) => {
      this.setState({
        visible: !finished,
        started: false
      })
    });
  });
};
 
resetAnimation = () => {
  this.setState({ started: false}, () => {
    Animated.spring(this.state.animation, {
      toValue: 1,
    }).start();
  });
}
</code>
```
Then in our render we need to toggle the function that is called based upon whether or not the animation is running.

```
<code class="js language-js">    
const onPress = this.state.started ? this.resetAnimation : this.startAnimation;
 
    return (
      <View style={styles.container}>
        {this.state.visible &&
          <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View style={[styles.box, animatedStyles]} />
          </TouchableWithoutFeedback>}
      </View>
    );
</code>
```
Out of some slight laziness, and to keep the code concise I'm going to just use setTimeout. This is slightly less efficient. How the animation would be:

1) First click => animate to 0 2) Second Click Interrupt => start callback of first click, use setTimeout for next tick 3) Second Click => animate to 0 4) Next tick => animate to beginning again

If it was successfully finished we call setState and hide our box. However if it wasn't finished then we start a new animation and spring it back to where it started.

```
<code class="js language-js">  
startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 1500,
    }).start(({ finished }) => {
      setTimeout(() => {
        if (finished) {
          this.setState({ visible: false });
        } else {
          Animated.spring(this.state.animation, {
            toValue: 1,
          }).start();
        }
      }, 0);
    });
  };
</code>
```
Ending

Live Demo Code

Resources for this lecture
Repo