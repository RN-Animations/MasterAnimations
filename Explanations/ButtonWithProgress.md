Animated Progress Bar Explanation
Intro

This is a rebuild of a demo I saw on tutorialzine. This is nothing unique to this tutorial but demonstrates a decent animation. It provides the user with instant feedback and localized to the action that they took.

We'll use the same animated value, and show how we can pass in the interpolations to different style values to achieve different animations.

Setup A Button

We could potentially use a single animated value with interpolate. However you may want to make this a reusable component with a piped in user value. This could potentially make things complicated if you wanted a secondary animation after the value reached 100%.

So instead of one we'll start with 2 animated values. The first will be for progress the bar behind, and the second will be for fading out the animated background.

Also we setup a button that's a TouchableWithoutFeedback, with our button view and text. Our styling is just setting an arbitrary background color, centering our content which is just our text, and also ensuring we add a backgroundColor: "transparent" to the text.
```
<code class="js language-js">import React, { Component } from "react";
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
  render() {
 
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handlePress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Get it!</Text>
          </View>
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
  button: {
    backgroundColor: "#e6537d",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 60,
    paddingVertical: 10,
    overflow: "hidden",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 24,
    backgroundColor: "transparent",
  },
});
AppRegistry.registerComponent("animations", () => animations);
</code>
 ```
Add our Covering View

We will add a covering view to contain our animation, this will just use the `StyleSheet.absoluteFill` to cover the existing space, and ensure that when we use our percentage based interpolation that it's values are accurate and don't go outside the bounds of our button.
```
<code class="js language-js"><View style={styles.button}>
  <View style={StyleSheet.absoluteFill}>
 
  </View>
  <Text style={styles.buttonText}>Get it!</Text>
</View>
</code>
```
Full Cover Background

Now we'll setup our animated view inside of our wrapping container. We'll apply a partial progress styling. This will position our view absolutely so it'll be with in the bounds of our button, and then in the top left corner. However we'll use our dynamic styling next to be able to control the style of the progress animation.
```
<code class="js language-js">  <View style={StyleSheet.absoluteFill}>
    <Animated.View style={[styles.progress, styles.opacityBackground]} />
  </View>
</code>
<code class="js language-js">  progress: {
    position: "absolute",
    left: 0,
    top: 0,
  },
</code>
```
The Animation

Depending on the requirements of your app will depend on how you handle a press on the button while an animation is happening. You may want to potentially disable the button, but we'll just reset our animation instead using setValue.

We'll animate to 1 over 1500 milliseconds. Then if we successfully finished our animation, meaning it wasn't interrupted by another button tap, then we'll trigger our second animation and animate our opacity to 0 for our progress bar.
```
<code class="js language-js">  handlePress = () => {
    this.state.animation.setValue(0);
    this.state.opacity.setValue(1);
 
    Animated.timing(this.state.animation, {
      duration: 1500,
      toValue: 1,
    }).start(({ finished }) => {
      if (finished) {
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 200,
        }).start();
      }
    });
  };
</code>
```
Interpolate

Now to make our animation work we need to setup some interpolations. The first will be a progress interpolation that will out put a percentage. This will just interpolate from 0% to 100%, and clamp it so it will never go more than 100% or less than 0%.

Our color interpolation will also operate off of our `this.state.animation`. This could be user supplied as long as it was an `rgba/rgb` value, or any other non-hex color.

Then we finally pipe our color and our opacity animation into our styling.
```
<code class="js language-js">const progressInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
      extrapolate: "clamp",
    });
 
    const colorInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgb(71,255,99)", "rgb(99,71,255)"],
    });
 
    const progressStyle = {
      opacity: this.state.opacity,
      backgroundColor: colorInterpolate,
    };
</code>

```
Apply the style object to the view.
```
<code class="js language-js">  <View style={StyleSheet.absoluteFill}>
    <Animated.View style={[styles.progress, progressStyle, styles.opacityBackground]} />
  </View>
</code>
```
Left to Right

In order to control our animation style we will use our `progressInterpolate` in different ways. For a class left to right animation we need to add 2 values.

The first is our `width` which will be a percentage, and then our `bottom: 0` which will tell our progress view to expand all the way the bottom of the button. Remember our progress styling already has `top: 0, left: 0` on it.

```
<code class="js language-js">    
      const progressStyle = {
      width: progressInterpolate,
      bottom: 0,
 
      opacity: this.state.opacity,
      backgroundColor: colorInterpolate,
    };
</code>
```
Top Down

For a top down animation, we'll need to pipe our progressInterpolate into height. The width will always be the entire button so rather than a bottom: 0 we can add in a `right: 0`. Then the height will be our percentage that goes from 0% to 100%.

<code class="js language-js">    const progressStyle = {
      height: progressInterpolate,
      right: 0,
      opacity: this.state.opacity,
      backgroundColor: colorInterpolate,
    };
</code>
Small Bottom

Finally what if we wanted a `small progress bar` at the bottom of the button. We already specified `top: 0` in our progress style so we can simply override that with `top: null` as long as we place our progressStyle object after our styles.progress in the array.

We'll then position it at the bottom, give it a small height, and pass in our progressInterpolate to width.
```
<code class="js language-js">    
const progressStyle = {
      top: null,
      bottom: 0,
      width: progressInterpolate,
      height: 5,
      opacity: this.state.opacity,
      backgroundColor: colorInterpolate,
    };
</code>
```
Opacity Background

Rather than having a color we could also define a default white background color with 50% opacity, so that our pink background will be visible. This would be applied with any of the effects above and we could then ditch the backgroundColor interpolation, and just place the `opacityBackground` style in the array of the progress bar.
```
<code class="js language-js">  
opacityBackground: {
    backgroundColor: "rgba(255,255,255,.5)",
  },
</code>
<code class="js language-js"><Animated.View style={[styles.progress, progressStyle, styles.opacityBackground]} />
</code>
```
Ending

This demo takes advantage of a handy technique which is `interpolating %`. Do note that this is effecting a layout value. This is not ideal but just understand that animating layout values can effect performance but are sometimes necessary. Just be cognizant that if you are seeing performance issues you may need to switch to using transforms.