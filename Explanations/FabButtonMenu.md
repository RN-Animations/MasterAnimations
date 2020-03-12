Floating Action Button with Menu Explanation
Intro

A common design paradigm popularized by Material design(?) is a floating action button in the bottom right corner of the screen. In our case we'll be rebuilding the starbucks app pay button. Not only does this have a floating button, it has 2 other floating buttons, and a circular background cover that shoots out to allow you to focus on the options.

If you need to emphasize a specific piece of content having an animated black background with some opacity that allows you to still see through and keep your context is a great method.

Setup

A standard setup, we have our vector icons, and an animated value. This animated value will only go from 0 to 1 so we can keep our animation reversible.
```js
<code class="js language-js">
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  Animated,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
 
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
 
export default class animations extends Component {
  state = {
    animation: new Animated.Value(0),
  };
  render() {
    return (
      <View style={styles.container}>
 
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
 
AppRegistry.registerComponent("animations", () => animations);
</code>
```
Add Bottom Button

So first we need to add our main floating action button (FAB). We won't be animating this button, but we will be animating the text.
```js
<code class="js language-js">return (
  <View style={styles.container}>
    <TouchableWithoutFeedback onPress={this.toggleOpen}>
      <View style={[styles.button, styles.pay]}>
        <Animated.Text style={[styles.label]}>Pay</Animated.Text>
        <Text style={styles.payText}>$5.00</Text>
      </View>
    </TouchableWithoutFeedback>
  </View>
);
</code>
```
We'll position our button in the corner and create a reusable style so all of our buttons will be the same shape and size. This will allow us to hide them behind our button then animate them visible. Then to make our button green we just add our pay style to add a background color.

Additionally we position our text absolutely and render it inside of our button. Without adding any top/left/bottom/right values it'll float freely but still stay centered.
```js
<code class="js language-js">
label: {
  color: "#FFF",
  position: "absolute",
  fontSize: 18,
  backgroundColor: "transparent",
},
button: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#333",
    shadowOpacity: 0.1,
    shadowOffset: { x: 2, y: 0 },
    shadowRadius: 2,
    borderRadius: 30,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  payText: {
    color: "#FFF",
  },
  pay: {
    backgroundColor: "#00B15E",
  },
</code>
```
Add More Buttons

Now lets add our other buttons. These will need to be animated so we use an Animated.View and choose the appropriate icons. Because our button class is positioning everything in the same spot, and we have placed these buttons above our pay button in the render they will be rendered behind our pay button.
```js
<code class="js language-js">
return (
  <View style={styles.container}>
    <TouchableWithoutFeedback>
      <Animated.View style={[styles.button, styles.other]}>
        <Animated.Text style={[styles.label]}>Order</Animated.Text>
        <Icon name="food-fork-drink" size={20} color="#555" />
      </Animated.View>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback>
      <Animated.View style={[styles.button, styles.other]}>
        <Animated.Text style={[styles.label]}>Reload</Animated.Text>
        <Icon name="reload" size={20} color="#555" />
      </Animated.View>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={this.toggleOpen}>
      <View style={[styles.button, styles.pay]}>
        <Animated.Text style={[styles.label]}>Pay</Animated.Text>
        <Text style={styles.payText}>$5.00</Text>
      </View>
    </TouchableWithoutFeedback>
  </View>
);
</code>
```
The only thing we need to do is specify their background color.
```js
<code class="js language-js">  other: {
    backgroundColor: "#FFF",
  },
</code>
```
Add Hidden Background

We want a circular animated black opaque background, however rather than making it hidden via opacity we'll just treat it like another button and tuck it behind the rest of the buttons.
```js
<code class="js language-js">return (
      <View style={styles.container}>
        <Animated.View style={[styles.background, bgStyle]} />
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.button, styles.other, orderStyle]}>
            <Animated.Text style={[styles.label, labelStyle]}>Order</Animated.Text>
            <Icon name="food-fork-drink" size={20} color="#555" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.button, styles.other, reloadStyle]}>
            <Animated.Text style={[styles.label, labelStyle]}>Reload</Animated.Text>
            <Icon name="reload" size={20} color="#555" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.toggleOpen}>
          <View style={[styles.button, styles.pay]}>
            <Animated.Text style={[styles.label, labelStyle]}>Pay</Animated.Text>
            <Text style={styles.payText}>$5.00</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
</code>
```
Basically the same as the button styling.
```js
<code class="js language-js">
background: {
  backgroundColor: "rgba(0,0,0,.2)",
  position: "absolute",
  width: 60,
  height: 60,
  bottom: 20,
  right: 20,
  borderRadius: 30,
},
</code>
```
Setup Animation on Press

Because we don't need to toggle pointer events on this animation we just need to save off on the instance whether or not our menu is opened or closed. Then decide to animate to 0 or 1. This will produce a reversible animation that also can be interrupted at any point.
```js
<code class="js language-js">  
toggleOpen = () => {
    const toValue = this._open ? 0 : 1;
 
    Animated.timing(this.state.animation, {
      toValue,
      duration: 200,
    }).start();
 
    this._open = !this._open;
  };
</code>
```
Animate Buttons

We'll craft each button animation specifically. This however could be derived if you had any number of button items in the menu.

Our reload button will be closest so we'll offset it by -70 giving us some padding from the pay button. Our order button will be the last button so we just need to offset it by -140 so it will bypass the reload button and also have some padding.

Additionally we'll pass in our 0<=>1 animated value into scale so it will be moving and growing at the same time.
```js
<code class="js language-js">
const reloadInterpolate = this.state.animation.interpolate({
  inputRange: [0, 1],
  outputRange: [0, -70],
});
 
const orderInterpolate = this.state.animation.interpolate({
  inputRange: [0, 1],
  outputRange: [0, -140],
});
 
const reloadStyle = {
  transform: [
    {
        scale: this.state.animation
    },
    {
      translateY: reloadInterpolate,
    },
  ],
};
 
const orderStyle = {
  transform: [
    {
        scale: this.state.animation
    },
    {
      translateY: orderInterpolate,
    },
  ],
};
</code>
```
Animate Labels

The label animations are the most difficult animations. They start hidden in the center of each individual button. However we don't want the text to appear over our icons and transition out. This would look bad.

However what we can do is keep it hidden and keep animating it's location. Then once we know it's cleared the buttons of any overlap we'll fade it in. The text will always be offset by -30 and animate to an offset of -90 but to accomplish our fade in we'll have it happen after our animation is 80% complete. So we'll make a cliff at that point and then quickly fade it in to 1 over the last 20% of the animation.

We also want all of our labels to do the same thing so we can pass the same label style into all of our labels.
```js
<code class="js language-js">
const labelPositionInterpolate = this.state.animation.interpolate({
  inputRange: [0, 1],
  outputRange: [-30, -90],
});
 
const opacityInterpolate = this.state.animation.interpolate({
  inputRange: [0, 0.8, 1],
  outputRange: [0, 0, 1],
});
 
const labelStyle = {
  opacity: opacityInterpolate,
  transform: [
    {
      translateX: labelPositionInterpolate,
    },
  ],
};
</code>
```
Animate Background

Finally our animated background is simply a scale of our small box. This is an arbitrary number selected, however you could use math to calculate how many times the background needs to scale before it covers the entire view. I picked a large enough number to cover the screen.
```js
<code class="js language-js">const scaleInterpolate = this.state.animation.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 30],
});
 
const bgStyle = {
  transform: [
    {
      scale: scaleInterpolate,
    },
  ],
};
</code>
```
Ending

Never underestimate just scaling a view really big.