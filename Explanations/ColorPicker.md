Animated Color Picker Explanation
Intro

This tutorial will focus on constructing an animation piece by piece. When dealing with one view transitioning to another view in the same space it's easier to construct one view without animation. Construct the second view across the top of it. Then figure out the animation to transition one to the other. Focusing on building the views and the animation at the same time just makes things more difficult.

Setup

We setup a few things will use. First off we create an `AnimatedTextInput` and an `AnimatedIcon` so that we can run animations on both as they aren't provided by default.

We'll setup 2 animations. The first will be for the general opening and closing when the user hits the toggle button. The second will be for toggling the input and button visible to adjust the color.
```js
<code class="js language-js">
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
 
import Icon from "react-native-vector-icons/Foundation";
 
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
 
export default class animations extends Component {
  state = {
    animation: new Animated.Value(0),
    buttonAnimation: new Animated.Value(0),
    color: "#000",
    inputOpen: false,
  };
 
  handleToggle = () => {
 
  }
 
  render() {
 
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleToggle} style={styles.button}>
          <Text>Toggle Open/Closed</Text>
        </TouchableOpacity>
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
});
 
AppRegistry.registerComponent("animations", () => animations);
</code>
```
Add The Color Icon and Wrapping Container

Now we'll add our wrapping view that's our rowWrap and then our colorBall as well. We'll craft a background color that will just be directly controlled by our state.
```js
<code class="js language-js">  
const colorStyle = {
    backgroundColor: this.state.color,
  };
 
  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.rowWrap]}>
          <TouchableWithoutFeedback onPress={this.toggleInput}>
            <Animated.View style={[styles.colorBall, colorStyle]} />
          </TouchableWithoutFeedback>
        </Animated.View>
 
        <TouchableOpacity onPress={this.handleToggle} style={styles.button}>
          <Text>Toggle Open/Closed</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
</code>
```
Our rowWrap just aligns and centers our icons. We want our items to be laid out in a row and centered in the vertical center and then we do some general styling on the shadow, and some padding. If you want to have a shadow on Android be sure and add an elevation here.
```js
<code class="js language-js">rowWrap: {
  flexDirection: "row",
  alignItems: "center",
  minWidth: "50%",
  backgroundColor: "#FFF",
  borderRadius: 20,
  shadowColor: "#333",
  shadowOpacity: 0.2,
  shadowOffset: { x: 2, y: 2 },
  shadowRadius: 3,
  paddingVertical: 5,
  paddingHorizontal: 10,
},
colorBall: {
  width: 15,
  height: 15,
  borderRadius: 8,
},
</code>
```
Animate it In and Out

The first animation we need to take care of is to animate the view in and out whenever we press our button. This is a purely animation driven toggle, aka the view is always rendered. You may not want this and in that case you'd want to use setState but we'll focus on it always being rendered.

We track whether it's open with this._open and decide whether we need to animate to 0 or 1. This means we'll have heavy interpolation.**When you are dealing with animations that are 0 <=> 1 and are interpolation based makes it very easy for creating reversible animations.**
```js
<code class="js language-js">  
    handleToggle = () => {
    const toValue = this._open ? 0 : 1;
 
    Animated.spring(this.state.animation, {
      toValue,
    }).start();
 
    this._open = !this._open;
  };
</code>
```
We setup our interpolation with a few stages. Our scaleY will continue at it's normal pace just going from 0 to 1. However we don't want our scaleX to start happening until half way through the animation. We want it to have some movement and size on the scaleY before it starts it's scale outwards. This means that it will grow faster since it only has half the animation to get from 0 to 1.

Only scaling the X will cause an expanding animation from the center.

This delayed animation is another technique similar to the .99 cliff technique. If you want an animation to only happen after half the animation is completed then kick in, you can specify 2 outputRanges to be exactly the same next to each other. Then define your inputRange of when you want it to start. Once it hits the last value is when the interpolation will start.

Our translateY will be animating the entire time but we just specify that it'll start with an offset of 150. Finally we'll pipe our animation directly into opacity and scaleY as we both want our end values to be 1.
```js
<code class="js language-js">    
const scaleXInterpolate = this.state.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    });
 
    const translateYInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [150, 0],
    });
 
    const rowStyle = {
      opacity: this.state.animation,
      transform: [
        {
          translateY: translateYInterpolate,
        },
        {
          scaleX: scaleXInterpolates,
        },
        {
          scaleY: this.state.animation,
        },
      ],
    };
</code>
```
Then we need to apply to our row.
```js
<code class="js language-js">  
<Animated.View style={[rowStyle, styles.rowWrap]}>
</code>
```
Add The Other Buttons

Because the color picker button is a shared component we will need to create another row view to house the buttons and eventually our input toggle/button. The TouchableOpacity is just so that we have a notification to ourselves that the buttons are indeed touchable. We'll also use the AnimatedIcon we crafted earlier.
```js
<code class="js language-js">
<Animated.View style={[styles.rowWrap]}>
  <TouchableWithoutFeedback onPress={this.toggleInput}>
    <Animated.View style={[styles.colorBall, colorStyle]} />
  </TouchableWithoutFeedback>
 
  <View style={styles.row}>
    <TouchableOpacity>
      <AnimatedIcon name="bold" size={30} color="#555" />
    </TouchableOpacity>
    <TouchableOpacity>
      <AnimatedIcon name="italic" size={30} color="#555" />
    </TouchableOpacity>
    <TouchableOpacity>
      <AnimatedIcon name="align-center" size={30} color="#555" />
    </TouchableOpacity>
    <TouchableOpacity>
      <AnimatedIcon name="link" size={30} color="#555" />
    </TouchableOpacity>
  </View>
</Animated.View>
</code>
```
We'll have our row take up the entire row, as well as the entire height with our flex: 1. Then we'll center them, and spread them evenly using our justifyContent: "space-around".
```js
<code class="js language-js">row: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    overflow: "hidden",
  },
</code>
```
Add the Input and Button

Now without worrying about animations we are going to build our input and button over the top of the other buttons. We create an Animated.View and use StyleSheet.absoluteFill to cover the entire row we just created.

We'll then use our pointerEvents technique. We'll toggle a piece of state when the animation is completed that will enable our view to be interacted with. Otherwise it won't be able to be interacted with. We Do that on the wrapping view pointerEvents={this.state.inputOpen ? "auto" : "none"}

We also need to get a ref to our input so we can focus and blur it whenever it's open or closed.
```js
<code class="js language-js"><Animated.View style={[rowStyle, styles.rowWrap]}>
  <TouchableWithoutFeedback onPress={this.toggleInput}>
    <Animated.View style={[styles.colorBall, colorStyle]} />
  </TouchableWithoutFeedback>
 
  <View style={styles.row}>
    <TouchableOpacity>
      <AnimatedIcon name="bold" size={30} color="#555" style={iconStyle} />
    </TouchableOpacity>
    <TouchableOpacity>
      <AnimatedIcon name="italic" size={30} color="#555" style={iconStyle} />
    </TouchableOpacity>
    <TouchableOpacity>
      <AnimatedIcon name="align-center" size={30} color="#555" style={iconStyle} />
    </TouchableOpacity>
    <TouchableOpacity>
      <AnimatedIcon name="link" size={30} color="#555" style={iconStyle} />
    </TouchableOpacity>
 
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.colorRowWrap]}
      pointerEvents={this.state.inputOpen ? "auto" : "none"}
    >
      <AnimatedTextInput
        value={this.state.color}
        style={[styles.input]}
        onChangeText={color => this.setState({ color })}
        ref={input => (this._input = input)}
      />
      <TouchableWithoutFeedback onPress={this.toggleInput}>
        <Animated.View style={[styles.okayButton]}>
          <Text style={styles.okayText}>OK</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Animated.View>
  </View>
</Animated.View>
</code>
```
Our colorRowWrap follows many of the same stylings as the row but with no positioning. We'll use flex on our input to tell it to take up the rest of the space, then define a set width on our button. We'll center the text of it in the middle of our button.
```js
<code class="js language-js">colorRowWrap: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: 5,
  },
  input: {
    flex: 1,
  },
  okayButton: {
    borderRadius: 20,
    height: "100%",
    width: 40,
    backgroundColor: "#309EEB",
    alignItems: "center",
    justifyContent: "center",
  },
  okayText: {
    color: "#FFF",
  },
</code>
```
Animate our input

Again we'll use a 0 to 1 animation so it's a **reversible animation**. We'll need to toggle our inputOpen and link it to whether or not our animation is being open or closed.

The login in our setState is a little odd but the value we are setting on the inputOpen is the result of the ! on the _inputOpen.

So when the inputOpen on state is no longer true, that means it's closed and we want to blur. Otherwise we want to focus on the input so the user can just start typing.
```js
<code class="js language-js">  
toggleInput = () => {
    const toValue = this._inputOpen ? 0 : 1;
    Animated.timing(this.state.buttonAnimation, {
      toValue,
      duration: 350,
    }).start();
 
    this._inputOpen = !this._inputOpen;
    this.setState({ inputOpen: this._inputOpen }, () => {
      !this.state.inputOpen ? this._input.getNode().blur() : this._input.getNode().focus();
    });
  };
</code>
```
Our first is the moveInterpolate on our button. We offset it -150 to the left and translate it across the input. We also want it scaling from 0 to 1 so we'll just pass our buttonAnimation right into the scale.

A key piece to notice is that we want our row to appear immediately or else we won't see our scaling button. So we interpolate on the buttonAnimation and make the inputRange [0, .01]. This means it will appear almost immediately, but when at 0 still be able to be hidden.

Our input animation will take advantage of a similar cliff to our scaleX on the container view. We will wait until the animation is 80% complete before we'll fade it in. This will allow the button to animate almost entirely to it's position before the hex values appear.

Finally we have our button animations. You may not have expected us to animate them because they're being covered and won't be visible anyway. However giving something a slight opacity and shift makes it look like it's a part of the animation and disappearing underneath the view. We want to craft an effect that the button is wiping away each of the views.

We do that with an opacity from in the first 20% of the animation. And the other piece is animating the translateX of the icons -20. This means that it'll be moving towards and underneath the button as it explodes towards it. This also means that with a -20 output when the input is closed they'll be moving and fading back into position.
```js
<code class="js language-js">    
const moveInterpolate = this.state.buttonAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-150, 0],
    });
 
    const buttonStyle = {
      transform: [
        {
          translateX: moveInterpolate,
        },
        {
          scale: this.state.buttonAnimation,
        },
      ],
    };
 
    const colorRowInterpolate = this.state.buttonAnimation.interpolate({
      inputRange: [0, 0.01],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
 
    const colorRowStyles = {
      opacity: colorRowInterpolate,
    };
 
    const inputOpacityInterpolate = this.state.buttonAnimation.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0, 1],
    });
 
    const inputStyle = {
      opacity: inputOpacityInterpolate,
    };
 
    const iconTranslate = this.state.buttonAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -20],
    });
 
    const opacityIconInterpolate = this.state.buttonAnimation.interpolate({
      inputRange: [0, 0.2],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
 
    const iconStyle = {
      opacity: opacityIconInterpolate,
      transform: [
        {
          translateX: iconTranslate,
        },
      ],
    };
</code>
```