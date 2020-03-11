Photo Grid Shared Element Explanation
Intro

The shared element idea is a multi stage process, but it follows a general guideline.

1) Get the position of the item (width/height/x/y) 2) Set animated values with those values 3) Render shared item using animated values so it appears in the same spot as our start item 4) Get the destination dimensions (width/height/x/y) (wrapping container positions) 5) Animate the animated values to final destination

There is another method without a wrapping container

1) Get the position/size of the item (width/height/x/y) 2) Render destination item hidden with opacity 3) Get the position/size of the destination item (width/height/x/y) 4) Set animated values with the values of the start item 5) Animate the animated values to final destination

Same number of steps but it mostly depends on if you have a view that will conform to the dimensions we want to fill in. Like in our photo grid we'll show that we have a flex: 1 container in our destination view that we can measure to get our available space for our image.

However the second method we would need to measure the actual destination item first.

Setup

First off we need a grid of pretty images. I went on Unsplash and got a bunch then resized them to be smaller in size. The size is crucial here as we don't want to pipe in 20 5mb photos into any mobile device.

We also setup this.gridImages = {} in our componentWillMount. This will be used to store all of our refs. We'll use these refs to get the page location, and dimensions of each image.
````
<code class="js language-js">import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
 
import images from "./images";
 
export default class animations extends Component {
  state = {
    activeImage: null,
    animation: new Animated.Value(0),
    position: new Animated.ValueXY(),
    size: new Animated.ValueXY(),
  };
 
  componentWillMount() {
    this._gridImages = {};
  }
 
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
Build a Grid

Here we create a ScrollView, we could use a FlatList if you're worried about performance, but the concepts still apply.

If we currently have an active image we'll toggle the opacity so it really looks like the image is being blown up into it's final position.
```
<code class="js language-js">    
const activeIndexStyle = {
      opacity: this.state.activeImage ? 0 : 1
    }
</code>
```
We map over them, and apply our opacity style if we have found our active index. Additionally we save off the ref to the image so we can measure the size of our image later.
```
<code class="js language-js">
<ScrollView style={styles.container}>
  <View style={styles.grid}>
    {images.map((src, index) => {
 
      const style = index === this.state.activeIndex ? activeIndexStyle : undefined;
 
      return (
        <TouchableWithoutFeedback key={index} onPress={() => this.handleOpenImage(index)}>
          <Animated.Image
            source={src}
            style={[styles.gridImage, style]}
            resizeMode="cover"
            ref={image => (this._gridImages[index] = image)}
          />
        </TouchableWithoutFeedback>
      );
    })}
  </View>
</ScrollView>
</code>
```
The grid just uses flexDirection: "row" and tells the container to wrap the content. Then each image is given a width of 33% so we can fit 3 images on each row. You can use this technique with one, two, or any number of images.
```
<code class="js language-js">container: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridImage: {
    width: "33%",
    height: 150,
  },
</code>
```
Add a Modal View

The next thing we need to do is create our target modal view. This will consist of a top image, and a lower view of text.

The key to this whole thing working is using our `pointerEvents` toggle technique. This view is always active, the only piece that is hidden is the lower content that has an opacity when it is in active. Additionally when we don't have an activeImage there is nothing in the space.

This allows for your view to always be present, but until we have an activeImage it can't be interacted with and all touches will pass through to the underlying grid.
```
<code class="js language-js"><View
  style={StyleSheet.absoluteFill}
  pointerEvents={this.state.activeImage ? "auto" : "none"}
>
 
  <View style={styles.topContent} ref={image => (this._viewImage = image)}>
    <Animated.Image
      key={this.state.activeImage}
      source={this.state.activeImage}
      resizeMode="cover"
      style={[styles.viewImage, activeImageStyle]}
    />
  </View>
  <Animated.View
    style={[styles.content, animtedContentStyles]}
    ref={content => (this._content = content)}
  >
    <Text style={styles.title}>Pretty Image from Unsplash</Text>
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lobortis interdum
      porttitor. Nam lorem justo, aliquam id feugiat quis, malesuada sit amet massa. Sed
      fringilla lorem sit amet metus convallis, et vulputate mauris convallis. Donec
      venenatis tincidunt elit, sed molestie massa. Fusce scelerisque nulla vitae mollis
      lobortis. Ut bibendum risus ac rutrum lacinia. Proin vel viverra tellus, et venenatis
      massa. Maecenas ac gravida purus, in porttitor nulla. Integer vitae dui tincidunt,
      blandit felis eu, fermentum lorem. Mauris condimentum, lorem id convallis fringilla,
      purus orci viverra metus, eget finibus neque turpis sed turpis.
    </Text>
  </Animated.View>
  <TouchableWithoutFeedback onPress={this.handleClose}>
    <Animated.View style={[styles.close, animatedClose]}>
      <Text style={styles.closeText}>X</Text>
    </Animated.View>
  </TouchableWithoutFeedback>
</View>
</code>
```
Animate To The Modal Open

Alright now we need to talk about executing the shared element. The process will be

1) Measure the dimensions of the current image 2) Adjust our animated values that are applying to our destination image in our modal. 3) Measure our destination image dimension wrapper (position, width and height). 4) Rendered image will appear at the grid spot 5) Animate to it's position it should be at.

The key to point out here is we are measuring the view wrapping the image. This is the space that the image will occupy but it will allow us to get the dimensions and simplify the rendering of the image in the correct spot over the correct grid item that was pressed.

So first measure the dimensions of the index of the image that was pressed. We are dealing with animated views so we need to call getNode() to access the actual view ref so we can call measure.

<code class="js language-js">
this._gridImages[index].getNode().measure((x, y, width, height, pageX, pageY) => {
 
});
</code>
Save off our values for later animating, and set the position and the size. I'm using 2 Animated.ValueXYs here, and the x/y will just be mapped to the width/height.

<code class="js language-js">this._x = pageX,
this._y = pageY;
this._width = width;
this._height = height;
 
this.state.position.setValue({
  x: pageX,
  y: pageY,
});
 
this.state.size.setValue({
  x: width,
  y: height,
});
</code>
Now that we have our dimensions calculated, and our animated values all set we can set our activeIndex and the image that we want. Once this is rendered it will appear in the exact spot that our grid image was at because of how we setup our styling.

<code class="js language-js">      this.setState(
        {
          activeImage: images[index],
          activeIndex: index,
        }
      );
</code>
The next piece is to measure the view destination. We need to measure the destination space so we know where to animate the image to. This is measuring the wrapping View container, however it is set to flex: 1. So it will have a dynamic space depending on screen size of the device.

We need to execute these animations all at the same time. We'll use spring to make it look like it exploded from it's spot up to the top. Our x position is plugged by the tPageX which because our view is at the top of the screen will just be 0, and same goes for the tPageY. However your destination for your app may be different.

Then we need to animate the width/height from the grid sized image, to the width/height of the destination space. Also we will animate a simple animated value to 1 which will control the opacity fade in of the close button, and also the bottom text piece.

<code class="js language-js">this.setState(
        {
          activeImage: images[index],
          activeIndex: index,
        },
        () => {
          this._viewImage.measure((tX, tY, tWidth, tHeight, tPageX, tPageY) => {
 
            Animated.parallel([
              Animated.spring(this.state.position.x, {
                toValue: tPageX,
              }),
              Animated.spring(this.state.position.y, {
                toValue: tPageY,
              }),
              Animated.spring(this.state.size.x, {
                toValue: tWidth,
              }),
              Animated.spring(this.state.size.y, {
                toValue: tHeight,
              }),
              Animated.spring(this.state.animation, {
                toValue: 1,
              })
            ]).start();
          });
        }
      );
</code>
All together the code looks like this. It is a bit daunting and is also one reason why making reusable shared element transitions can be difficult.

<code class="js language-js">  handleOpenImage = index => {
    this._gridImages[index].getNode().measure((x, y, width, height, pageX, pageY) => {
 
      this._x = pageX,
      this._y = pageY;
      this._width = width;
      this._height = height;
 
      this.state.position.setValue({
        x: pageX,
        y: pageY,
      });
 
      this.state.size.setValue({
        x: width,
        y: height,
      });
 
      this.setState(
        {
          activeImage: images[index],
          activeIndex: index,
        },
        () => {
          this._viewImage.measure((tX, tY, tWidth, tHeight, tPageX, tPageY) => {
 
            Animated.parallel([
              Animated.spring(this.state.position.x, {
                toValue: 0,
              }),
              Animated.spring(this.state.position.y, {
                toValue: 0,
              }),
              Animated.spring(this.state.size.x, {
                toValue: tWidth,
              }),
              Animated.spring(this.state.size.y, {
                toValue: tHeight,
              }),
              Animated.spring(this.state.animation, {
                toValue: 1,
              })
            ]).start();
          });
        }
      );
    });
  };
</code>
The other important aspect is the styling and interpolation. Our animated content will listen on our value going from 0 to 1. It'll start with a translateY offset of 300, and also just an opacity fade in. That way it will look like it's rising to meet the image as it sprung to the top.

Our activeImageStyle takes into account both our size and position animated values. They are passed into width/height, and top/left.

<code class="js language-js">const animatedContentTranslate = this.state.animation.interpolate({
  inputRange: [0, 1],
  outputRange: [300, 0],
});
 
const animatedContentStyles = {
  opacity: this.state.animation,
  transform: [
    {
      translateY: animatedContentTranslate,
    },
  ],
};
 
const animatedClose = {
  opacity: this.state.animation,
};
 
const activeImageStyle = {
  width: this.state.size.x,
  height: this.state.size.y,
  top: this.state.position.y,
  left: this.state.position.x,
};
</code>
Animate Backwards

Now in our modal we had a close button and when we opened up our modal we saved off the position of the grid where our image was at. Now we just need to reverse everything.

We'll animate our position x/y to this._x and this._y. Our size, back down to it's original size, and then also our content animation back to 0.

Once our animation is complete we will toggle our activeImage to null. This will hide our image that we animated, and then additionally will return the opacity of our gridImage to 1. Completing the effect.

<code class="js language-js">handleClose = () => {
    Animated.parallel([
      Animated.timing(this.state.position.x, {
        toValue: this._x,
        duration: 250,
      }),
      Animated.timing(this.state.position.y, {
        toValue: this._y,
        duration: 250,
      }),
      Animated.timing(this.state.size.x, {
        toValue: this._width,
        duration: 250,
      }),
      Animated.timing(this.state.size.y, {
        toValue: this._height,
        duration: 250,
      }),
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 250,
      })
    ]).start(() => {
      this.setState({
        activeImage: null,
      });
    });
 
  };
</code>
Android Caveat

On Android there is no overflow: "visible" support. That means that if our image is inside of our Modal view that it won't actually be able to appear at the grid level.

To make this work we'll need our image to be outside of our modal view. There is also a bug in Android where measure doesn't return any values unless we provide an onLayout function.

Additionally we'll need our X to be outside as well and below our image otherwise it won't appear.

This technique is basically creating an empty View which is our topContent view. Then measuring and animating our Image to cover the space that our view is holding for us.

<code class="js language-js"><View
  style={StyleSheet.absoluteFill}
  pointerEvents={this.state.activeImage ? "auto" : "none"}
>
  <View
    style={styles.topContent}
    ref={image => (this._viewImage = image)}
    onLayout={() => {}}
  />
  <Animated.View
    style={[styles.content, animatedContentStyles]}
    ref={content => (this._content = content)}
  >
    <Text style={styles.title}>Pretty Image from Unsplash</Text>
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lobortis interdum
      porttitor. Nam lorem justo, aliquam id feugiat quis, malesuada sit amet massa. Sed
      fringilla lorem sit amet metus convallis, et vulputate mauris convallis. Donec
      venenatis tincidunt elit, sed molestie massa. Fusce scelerisque nulla vitae mollis
      lobortis. Ut bibendum risus ac rutrum lacinia. Proin vel viverra tellus, et venenatis
      massa. Maecenas ac gravida purus, in porttitor nulla. Integer vitae dui tincidunt,
      blandit felis eu, fermentum lorem. Mauris condimentum, lorem id convallis fringilla,
      purus orci viverra metus, eget finibus neque turpis sed turpis.
    </Text>
  </Animated.View>
  <TouchableWithoutFeedback onPress={this.handleClose}>
    <Animated.View style={[styles.close, animatedClose]}>
      <Text style={styles.closeText}>X</Text>
    </Animated.View>
  </TouchableWithoutFeedback>
</View>
<Animated.Image
  key={this.state.activeImage}
  source={this.state.activeImage}
  resizeMode="cover"
  style={[styles.viewImage, activeImageStyle]}
/>
</code>
Ending

This works well for images, however there are cases where you want to do text, etc. This gets even more complicated but is still possible. The simple naive solution that a lot of people use is to snapshot a view (turn it into an image), and then morph it to it's destination and then swap in the actual content.


[measure(callback)](https://reactnative.dev/docs/direct-manipulation#measurecallback)

[pointerEvents](https://reactnative.dev/docs/view#pointerevents)