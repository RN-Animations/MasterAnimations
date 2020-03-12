Application Intro Screen Explanation
Intro

There is already a library that helps with this, called [react-native-app-intro](https://github.com/Jacse/react-native-app-intro-slider). The key for all of this is that we setup our interpolations based upon the contentOffset of our scroll view. On our x axis since we will be scrolling horizontal.

This is how parallax side scrolling and twitter moments can be created in React Native.

The basic concept is that we will craft our screens for their exact position. Then based upon the scroll position we will apply our animations to move it around. When it snaps into place we'll make our animations all set to 0 or defaults so the items are in their specific places as specified by the layout.

Generally we would handle this in an array of items and derive our inputRange for each screen dynamically but we're going to build out each inputRange by hand so we understand exactly what is happening.

Setup

We import our images

```js
<code class="js language-js">
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Dimensions,
  PixelRatio,
} from "react-native";

import * as Images from "./images";

export default class animations extends Component {
  state = {
    animation: new Animated.Value(0),
  };
  render() {
    const { width, height } = Dimensions.get("window");

    return (
      <View style={styles.container}>
      /* pagingEnabled
        When true, the scroll view stops on multiples of the scroll view's size when scrolling. This can be used for horizontal pagination. The default value is false.
        Note: Vertical pagination is not supported on Android. */
        /* onScroll
        Fires at most once per frame during scrolling. The frequency of the events can be controlled using the scrollEventThrottle prop. The event has the shape { nativeEvent: {
                    contentInset: { bottom, left, right, top },
                    contentOffset: { x, y },
                    contentSize: { height, width },
                    layoutMeasurement: { height, width }, zoomScale }
                    }
        All values are numbers. */
        <ScrollView
          style={styles.container}
          pagingEnabled
          horizontal
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: this.state.animation,
                },
              },
            },
          ])}
        >
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screenText: {
    flex: 1,
  },
});
```

AppRegistry.registerComponent("animations", () => animations);
</code>

````

Screen 1/2/3

I will only talk about a single screen as all the others are exactly the same. Yeah you would probably want to change this but I'm focusing on the animations.
To ensure that the images will be the same size regardless of the size of the phone we'll use the PixelRatio.getPixelSizeForLayoutSize call. This will multiply the value you give it by the pixel density of the device. You can check out which devices have which densities in the docs.

We basically have an anchored background image, which is our Image1. Then the rest are absolutely positioned on top of it. We will be able to animate all of the images. Each screen will have different animations with the same images.
```js
<code class="js language-js"><View style={‌{ width, height, backgroundColor: "#F89E20" }}>
<View style={styles.screenHeader}>
<Animated.Image
source={Images.Image1}
style={‌{
width: PixelRatio.getPixelSizeForLayoutSize(75),
height: PixelRatio.getPixelSizeForLayoutSize(63),
}}
resizeMode="contain"
/>

    <Animated.Image
      source={Images.Image2}
      style={[
        {
          width: PixelRatio.getPixelSizeForLayoutSize(46),
          height: PixelRatio.getPixelSizeForLayoutSize(28),
          position: "absolute",
          top: 200,
          left: 60,
        },
        screen1Styles.image2,
      ]}
      resizeMode="contain"
    />
    <Animated.Image
      source={Images.Image3}
      style={‌{
        width: PixelRatio.getPixelSizeForLayoutSize(23),
        height: PixelRatio.getPixelSizeForLayoutSize(17),
        position: "absolute",
        top: 150,
        left: 60,
      }}
      resizeMode="contain"
    />

  </View>
  <View style={styles.screenText}>
    <Text>Screen 1</Text>
  </View>
</View>
</code>
````

Animate 1

In the top of our render we'll setup our first call. We will pass in the animation to interpolate off of which will be the x offset of our ScrollView. Additionally we'll pass in our width. Technically this is just the device width, however if your ScrollView doesn't take up the entire screen we should have our functions setup to receive and derive from any width.

```js
<code class="js language-js">
  const screen1Styles = getScreen1Styles(this.state.animation, width);
</code>
```

Our first interpolation is the first, and thus our inputRange will be from 0 (no scroll) to the full width of the width. What this means is that at rest nothing will happen, but as we scroll greater than 0 (scrolling to the next page), we'll move our image2 the opposite direction by -100.

This also means that as you swipe back to the first screen from the second that it will animate from it's -100 offset to 0 which is it's normal position.

```js
<code class="js language-js">
const getScreen1Styles = (animation, width) => {
const image2TranslateX = animation.interpolate({
inputRange: [0, width],
outputRange: [0, -100],
extrapolate: "clamp",
});

return {
image2: {
transform: [
{
translateX: image2TranslateX,
},
],
},
};
};
</code>
```

Animate 2

The previous animation was just the same backwards and forwards. However if we define an input range for when we're swiping to the screen, then also when we're swiping away to the next screen we can make different entering and exiting animations.

Each screen is the width of what we've given it and since we're on the second screen that means that we want to define our entrance animation when the previous screen is at rest.

Our inputRange will be structured like so [previousScreenAtRest, myScreenAtRest, myNextScreenAtRest]. In our case our previous screen was at rest when it was at 0, our current screen will be at rest when we've scrolled one full width, and our next screen will be at rest when it's on the 3rd screen (0 based index so \* 2).

Our image2TranslateY if we are scrolling from the first screen will animate from the bottom as it has an offset of 100, however as we scroll to the next screen it will move itself to -100 instead. So it will animate out towards the top of the screen. The reverse will then happen as you scroll back from the 3rd screen to this screen. It will animate from the top down, then if we move back to the first screen it will animate out towards the bottom.

The opacity fade is just fading out from 0, and when active it'll be 1 and again fade back out to 0.
```js
<code class="js language-js">
const getScreen2Styles = (animation, width) => {
const inputRange = [0, width, width * 2];

const image2TranslateY = animation.interpolate({
inputRange,
outputRange: [100, 0, -100],
extrapolate: "clamp",
});
const image2Opacity = animation.interpolate({
inputRange,
outputRange: [0, 1, 0],
extrapolate: "clamp",
});

return {
image2: {
opacity: image2Opacity,
transform: [
{
translateY: image2TranslateY,
},
],
},
};
};
</code>
```
Animate 3

We only have 3 screens so why are we calculating the position of the 4th? Well on iOS there is a bounce. So as you extend past the right and or left side of ScrollView it wil extend further. This is actually a perfect use case for not using extrapolate: "clamp".

Without the extrapolate clamp the image1Scale, and the image2Rotate would automatically figure out the interpolation steps that it is on even though we would have only defined a [width, width * 2] but no 4th screen.

Our scale outputRange would then just be [0, 1], and our rotate would just be ["-180deg", "0deg"]. However we don't want our scale potentially heading greater than 1 and getting super huge, additionally we want to lock our rotation to 180deg.

I generally lean towards being very explicit about the animations I want to happen vs letting interpolate run free.

So here we actually return our scale for both Image1 and Image2, so it will start hidden at scale of 0 and move towards 1 which is just normal. Then change the rotation to start negatively turned and move towards 0 at rest. Then for our bounce the animation would continue the rotation around.
```js
<code class="js language-js">
const getScreen3Styles = (animation, width) => {
const inputRange = [width, width * 2, width * 3];

const image1Scale = animation.interpolate({
inputRange,
outputRange: [0, 1, 0],
extrapolate: "clamp",
});

const image2Rotate = animation.interpolate({
inputRange,
outputRange: ["-180deg", "0deg", "180deg"],
extrapolate: "clamp",
});

return {
image1: {
transform: [
{
scale: image1Scale,
},
],
},
image2: {
transform: [
{
scale: image1Scale,
},
{
rotate: image2Rotate,
},
],
},
};
};
</code>
```
Ending

In a real world example you would be deriving your inputRange based upon the index of the screen and not explicitly building it out. However building it manually was done to show case exactly what is happening behind the scenes. We're emphasizing dynamic interpolation input ranges while still emphasizing that you can produce normal output range effects.
