### Staggered Heads Explanation
- Intro

Facebook introduced a feature of messenger where heads sit on your screen and are able to be dragged around. There is a primary head and the rest will follow behind. We'll now learn how to handle animations in our onPanResponderMove function rather than just directly setting them with Animated.event.

- Setup

We'll setup a basic center container view, and setup our heads on our state. Each head will have it's own `Animated.ValueXY` as they will each have their own position even though they'll follow the leader and end up at the same spot.
```js
<code class="js language-js">
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  PanResponder,
} from "react-native";
 
import Vjeux from "./vjeux.jpg";
 
export default class animations extends Component {
  state = {
    heads: [
      {
        image: Vjeux,
        animation: new Animated.ValueXY(),
        text: "Drag Me",
      },
      {
        image: Vjeux,
        animation: new Animated.ValueXY(),
      },
      {
        image: Vjeux,
        animation: new Animated.ValueXY(),
      },
      {
        image: Vjeux,
        animation: new Animated.ValueXY(),
      },
    ],
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
    alignItems: "center",
    justifyContent: "center",
  },
});
 
AppRegistry.registerComponent("animations", () => animations);
</code>
```
- Render Images

We'll need to render our heads in a specific order so that they stack correctly. We could also use `zIndex` in this case, but this is a little more explicit.

We `slice(0)` to clone our array since reverse will mutate, then we call `reverse`. That means our draggable head on top, will be the last item rendered.

We apply our style, and then additionally use the `getTranslateTransform` helper to build out our transform for us.

```js
<code class="js language-js">
render() {
    return (
      <View style={styles.container}>
        {this.state.heads.slice(0).reverse().map((item, index, items) => {
            const pan = index === items.length - 1 ? this._panResponder.panHandlers : {};
         
          return (
            <Animated.Image
              {...pan}
              key={index}
              source={item.image}
              style={[styles.head, { transform: item.animation.getTranslateTransform() }]}
            >
              <Text>
                {item.text}
              </Text>
            </Animated.Image>
          );
        })}
      </View>
    );
  }
</code>
```

Our style for each head is just declaring that it's positioned absolutely, and defining a width, height and border radius to round it.
```js
<code class="js language-js">
head: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
</code>
```
 - Setup PanResponder

We need to setup our basic `PanResponder`. However rather than using `Animated.event` for the `onPanResponderMove` we need to set this up as a function as we will do a few more things for making our heads stagger.

You can also see in our `onPanResponderGrant` we will call `extractOffset` to move the previous `dx`, and `dy` to our `offset`. That way our new `deltas` on the new touch will work. Additionally `setValue` to 0 for x and y needs to happen. The `extractOffset` moves the value of animated into the `offset`, and then sets the value to 0.

When an animation is happening the `Animated.Value` is tagged with the animation that is currently taking place. If a new animation tries to take over it will first stop the previous animation.

However `extractOffset` presently mutates the underlying `value` and `offset` without calling stop on the previous running animation. This was causing issues when you didn't let the heads complete their spring before tapping or dragging again.
```js
<code class="js language-js">componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.state.heads.map(({ animation }) => {
          animation.extractOffset();
          // setValue Animated bug fix
          animation.setValue({ x: 0, y: 0 });
        });
      },
      onPanResponderMove: (e, { dx, dy }) => {
        this.state.heads[0].animation.setValue({
          x: dx,
          y: dy,
        });
    });
  }
</code>
```
- Stagger the Heads

There are a few methods we could use here and one of them isn't `stagger`. If we were to use `stagger` any time a new animation started (which occurs every drag) then the other head animations will stop. This is because of how the Animated library works.

The `onPanResponderMove` gets called on every drag, and the stagger of the animations to the new position will be delayed by the amount we stagger. If there was another drag that happened the `Animated.stagger` would get triggered again. This would stop all animations previously even though they may not have executed yet. That means all the other heads would just sit there and do nothing.

So we essentially need to replicate stagger but on at an individual head level.

Before we move on, this is actually a great place for a tracking animation. Which just means passing another animation value as the `toValue`. How it would work is we would pass in our main drag head animated value into our `Animated.spring`. Anytime the head would move the other heads would follow.

We'll use a slightly different technique because we have access to the actual values dx and dy, and also want to stagger each heads start.

We'll use slice(1) to skip the first head which is our drag head, and then use `Animate.sequence` to execute 2 animations one after the other. We'll use delay with the index multiplied by how many milliseconds between each head. In our case each head will be staggered by 10 milliseconds.

Each head will be in it's own sequence so we won't run into the same issue with the stagger where setting the new value on the first head would cause the rest to stop.
```js
<code class="js language-js">
onPanResponderMove: (e, { dx, dy }) => {
  this.state.heads[0].animation.setValue({
    x: dx,
    y: dy,
  });
 
  this.state.heads.slice(1).map(({ animation }, index) => {
    return Animated.sequence([
      Animated.delay(index * 10),
      Animated.spring(animation, {
        toValue: { x: dx, y: dy },
      }),
    ]).start();
  });
},
</code>
```
Ending

Live Demo Code

That's it. We recreated a stagger on each and when we drag the first head the other heads will follow it around. They are all just transforming around. We do not do anything in our `onPanResponderRelease` but theoretically you could animate and lock a head to either the left or right side depending on it's position.

