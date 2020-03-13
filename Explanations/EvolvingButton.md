Evolving Write Button Explanation
Intro

Sometimes it makes sense to start with the view you are attempting to animate to. Here we will start with our end editor animation and slowly work it down to a button. Using a single animated value we'll be able to craft a reversible animation.

Setup

Standard setup, bring in some icons, and animated value, and additionally a state to toggle whether or not we're open. This will be used to do our pointerEvents technique.
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
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
 
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
 
export default class animations extends Component {
  state = {
    animation: new Animated.Value(0),
    open: false,
  };
 
  render() {
    const { width, height } = Dimensions.get("window");
 
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
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
 
AppRegistry.registerComponent("animations", () => animations);
</code>
```
Keyboard Avoiding View (iOS)

On iOS we'll wrap our view in an a KeyboardAvoidingView.
```js
<code class="js language-js">    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.center} behavior="padding">
        </KeyboardAvoidingView>
      </View>
    );
</code>
```
Edit and Bar

Because we've centered our content when our animation happens it will appear as if it is animating from the center of the screen. With this outputRange in combination with our centering it will leave a padding of 20 on either side. Also note that our inputRange only goes to .5 which means this will be a **2 stage animation**. An expanding bar of content, and then our editor area dropping down will be the second piece.
```js
<code class="js language-js">    
const { width, height } = Dimensions.get("window");
 
    const widthInterpolate = this.state.animation.interpolate({
      inputRange: [0, 0.5],
      outputRange: [100, width - 40],
      extrapolate: "clamp",
    });
</code>
```
Here is our new view setup.
```js
<code class="js language-js">return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.center} behavior="padding">
          <Animated.View style={[styles.editor, { width: widthInterpolate }]}>
            <Animated.View style={styles.bar}>
 
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    );
</code>
```
We have a bar with a set height, and a background color that will be the same color for both the bar and the button.
```js
<code class="js language-js">  
editor: {
    borderWidth: 1,
    borderColor: "rgba(0,0, 0, .1)",
  },
  bar: {
    backgroundColor: "#2979FF",
    height: 50,
    justifyContent: "center",
  },
</code>
```
Icons

Now because we have uniqueish layout constraints where a set of buttons is on the left and another set is on the right we add an additional rightInnerBar view wrap so we can apply styling.
```js
<code class="js language-js">return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.center} behavior="padding">
          <Animated.View style={[styles.editor, { width: widthInterpolate }]}>
            <Animated.View style={styles.bar}>
              <Animated.View style={[styles.toolbar]}>
                <Icon name="format-bold" color="#FFF" size={20} />
                <Icon name="format-italic" color="#FFF" size={20} />
                <Icon name="format-underline" color="#FFF" size={20} />
                <Icon name="format-list-bulleted" color="#FFF" size={20} />
                <Icon name="format-list-numbers" color="#FFF" size={20} />
                <View style={styles.rightInnerBar}>
                  <Icon name="link" color="#FFF" size={20} />
                  <Icon name="image" color="#FFF" size={20} />
                  <Icon name="arrow-down-bold-box" color="#FFF" size={20} />
                </View>
              </Animated.View>
            </Animated.View>
 
          </Animated.View>
 
        </KeyboardAvoidingView>
      </View>
    );
</code>
```
Our toolbar is setup to be a row, and we'll tell our icons to be flex-start. This will start the rendering from left and move right. Then for our rightInnerBar which will also be a row, we'll tell it to do the opposite and start rendering at flex-end. This will give us the desired 2 separate sides of icons.
```js
<code class="js language-js">toolbar: {
  flexDirection: "row",
  paddingHorizontal: 10,
  alignItems: "center",
  justifyContent: "flex-start",
  overflow: "hidden",
},
rightInnerBar: {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
  justifyContent: "flex-end",
},
</code>
```
Editor Bottom

Now we need to setup our actual editor. We give our TextInput the StyleSheet.absoluteFill so it will cover it's parent view which will be our Animated.View. This is where the expanding height of our animation will take place and the TextInput will respond accordingly.

Additionally we get a ref to our input so when it expands or collapses we can focus or blur it.
```js
<code class="js language-js">return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.center} behavior="padding">
          <Animated.View style={[styles.editor, { width: widthInterpolate }]}>
            <Animated.View style={styles.bar}>
              <Animated.View style={[styles.toolbar, toolbarStyles]}>
                <Icon name="format-bold" color="#FFF" size={20} />
                <Icon name="format-italic" color="#FFF" size={20} />
                <Icon name="format-underline" color="#FFF" size={20} />
                <Icon name="format-list-bulleted" color="#FFF" size={20} />
                <Icon name="format-list-numbers" color="#FFF" size={20} />
                <View style={styles.rightInnerBar}>
                  <Icon name="link" color="#FFF" size={20} />
                  <Icon name="image" color="#FFF" size={20} />
                  <Icon name="arrow-down-bold-box" color="#FFF" size={20} />
                </View>
              </Animated.View>
            </Animated.View>
 
            <Animated.View style={[styles.lowerView]}>
              <TextInput
                placeholder="Start writing..."
                style={[StyleSheet.absoluteFill, styles.input]}
                multiline
                ref={input => (this._input = input)}
              />
            </Animated.View>
 
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    );
</code>
```
We give our lowerView which is our wrapping view a default height here, but this will be overridden by our animation.
```js
<code class="js language-js">
lowerView: {
  height: 150,
  overflow: "hidden",
},
input: {
  padding: 10,
  fontSize: 20,
},
</code>
```
Add Writer Button In Bar

We'll then use our pointerEvents technique and cover the entire bar so that we have a blue background for our write button. This gives us a same dimension view but a new ability to layout a single text item in the middle of the bar.

<code class="js language-js"><Animated.View style={styles.bar}>
  <Animated.View style={[styles.toolbar, toolbarStyles]}>
    <Icon name="format-bold" color="#FFF" size={20} />
    <Icon name="format-italic" color="#FFF" size={20} />
    <Icon name="format-underline" color="#FFF" size={20} />
    <Icon name="format-list-bulleted" color="#FFF" size={20} />
    <Icon name="format-list-numbers" color="#FFF" size={20} />
    <View style={styles.rightInnerBar}>
      <Icon name="link" color="#FFF" size={20} />
      <Icon name="image" color="#FFF" size={20} />
      <Icon name="arrow-down-bold-box" color="#FFF" size={20} />
    </View>
  </Animated.View>
 
  <Animated.View
    style={[StyleSheet.absoluteFill, styles.center]}
    pointerEvents={this.state.open ? "none" : "auto"}
  >
    <TouchableWithoutFeedback onPress={this.toggleTransform}>
      <View>
        <Text style={styles.buttonText}>Write</Text>
      </View>
    </TouchableWithoutFeedback>
  </Animated.View>
</Animated.View>
</code>

<code class="js language-js">  
buttonText: {
    color: "#FFF",
  },
</code>
```
Execute our Animation

Now it's a matter of executing the animation and managing our focus. Here we toggle our open state inside of start callback. This will execute if our animation is interrupted or complete so we can toggle the open state, and handle the input correctly.
```js
<code class="js language-js">  
toggleTransform = () => {
    const toValue = this._open ? 0 : 1;
 
    Animated.timing(this.state.animation, {
      toValue,
      duration: 550,
    }).start(() => {
      this._open ? this._input.blur() : this._input.focus();
      this._open = !this._open;
      this.setState({
        open: this._open,
      });
    });
  };
</code>
```
Transform the Input Height

We started with the expanded view first so that means we need to craft our animation backwards. We are in a multi-stage animation our editor expanding will either be the last piece when expanding, or the first piece to animate when collapsing. So we'll setup our inputRange with extrapolate: "clamp" so the height values don't go less than 0. Then we craft our editor style and pass it into our animated view.

```js
<code class="js language-js">
const editorHeightInputInterpolate = this.state.animation.interpolate({
  inputRange: [0.7, 1],
  outputRange: [0, 150],
  extrapolate: "clamp",
});
 
const editorStyle = {
  opacity: this.state.animation,
  height: editorHeightInputInterpolate,
};
</code>
<code class="js language-js">
<Animated.View style={[styles.lowerView, editorStyle]}>
  <TextInput
    placeholder="Start writing..."
    style={[StyleSheet.absoluteFill, styles.input]}
    multiline
    ref={input => (this._input = input)}
  />
</Animated.View>
</code>
```
Transform Toolbar and Buttons

Now that we have our first stage of our animation complete now we need to hide the editor icons. Again we're dealing with a multi-stage reversed animation. The opacity of the toolbar of buttons will be the first thing to slowly show up when expanding, but also the second piece of the animation. The reason this is starting at .5 instead of .7 is we want a slight pause before a new animation kicks in. This will also align the fade in of our buttons with expanding and collapsing of the bar.
```js
<code class="js language-js">
const opacityToolbarInterpolate = this.state.animation.interpolate({
  inputRange: [0, 0.5],
  outputRange: [0, 1],
  extrapolate: "clamp",
});
 
const toolbarStyles = {
  opacity: opacityToolbarInterpolate,
};
</code>
```
Animate the Write Button Opacity

Finally we get to the opacity of our write button. When we aren't animating (at 0) we want our button to be visible, but once we hit the 50% mark of our animation we should be completely gone because our button bar above will now be visible.
```js
<code class="js language-js">
const opacityButtonInterpolate = this.state.animation.interpolate({
  inputRange: [0, 0.5],
  outputRange: [1, 0],
  extrapolate: "clamp",
});
 
const buttonStyles = {
  opacity: opacityButtonInterpolate,
};
</code>
```
Ending

Sometimes it's easier to start at the end of your animation and work backwards to figure out the appropriate steps to produce the desired start state. Also note that this animation is using width/height transforms. This is generally less performant. If you implement this and are seeing performance issues you would need to fallback to using transforms, and opacity to craft the desired effect.