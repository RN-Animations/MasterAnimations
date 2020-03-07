### Using and Understanding setNativeProps Explanation

To understand how animated works you must first understand `setNativeProps`. This is what `Animated` uses to bypass `setState`. It sends new properties over the bridge directly to the native world.

**DO NOTE**: if you use `setNativeProps` to set a prop on the native side, and then a `setState` happens and the prop you've set natively is set on the particular element it will be overridden, or unless you pass back the value you set on the native side.

We'll be looking at trivial cases, however this is how Animated works. In the render it always derives the current prop values which are the same values it already sent to the native world using `setNativeProps`.

Lets take a look at some code first. We setup a `ScrollView` with an animated background on scroll. In order to call `setNativeProps` we need to get access to the view instance and we do that by getting a `ref`.
```
<code class="js language-js">
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  TouchableOpacity,
} from "react-native";
 
export default class animations extends Component {
  state = {
    animation: new Animated.Value(0),
  };
  _enabled = true;
 
  render() {
    const bgInterpolate = this.state.animation.interpolate({
      inputRange: [0, 3000],
      outputRange: ["rgb(255,99,71)", "rgb(99,71,255)"],
    });
    const scrollStyle = {
      backgroundColor: bgInterpolate,
    };
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleToggle}>
          <Text>Toggle</Text>
        </TouchableOpacity>
 
        <ScrollView
          style={styles.scroll}
          ref={scroll => (this._scroll = scroll)}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.state.animation,
                },
              },
            },
          ])}
        >
          <Animated.View style={[styles.fakeContent, scrollStyle]} />
        </ScrollView>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scroll: {
    flex: 1,
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
  fakeContent: {
    height: 3000,
    backgroundColor: "tomato",
  },
});
</code>
```
Here is where the magic happens.

Lets start first with just one `setNativeProp` call.
```
<code class="js language-js">  
handleToggle = () => {
    this._enabled = !this._enabled;

    this._scroll.setNativeProps({
      scrollEnabled: this._enabled,
    });
  };
</code>
```
We have `this._enabled` default to true on our component instance. We then toggle it and call `setNativeProps` and pass in an object of props we want to set. In our case we are just setting a single one and that's scrollEnabled. This will allow us to lock scrolling capabilities.

We can see it in action here, we lock the scroll without passing in a prop to our `ScrollView`, and without causing a `setState` to happen.


We can additionally override more than one prop at once, including the style prop. Understand though that you are **REPLACING** the prop in the native side. So if you have specific styling you need to preserve you will need to manage and send the entire new style, including the values you aren't overriding.

You can see that here, we create a style tag and pass in our `styles.scroll`, then whether or not we are disabled we pass in a hide or show styling which will toggle the opacity. We'll also still disable the scroll. This whole concept is foundational to how the JavaScript version of Animated works and how we can craft our own animations.

```
<code class="js language-js">  
handleToggle = () => {
    this._enabled = !this._enabled;

    let style = [styles.scroll];
 
    if (!this._enabled) {
      style.push(styles.hide);
    } else {
      style.push(styles.show)
    }
 
    this._scroll.setNativeProps({
      scrollEnabled: this._enabled,
      style,
    });
  };
</code>
```

Live Demo Code

Resources for this lecture
Repo