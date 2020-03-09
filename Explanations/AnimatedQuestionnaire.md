Animated Questionnaire Explanation
Intro

This demo is going to show how we can use state and animations to make it look like we have a smooth rendering of items. It is less than ideal to render hundreds of items. We'll use something that I may consider a layout hack + a setState swap. Essentially animating an item to where it will appear on the next state.

Setup

We'll setup an array of questions, our active index which we'll default to 0, an animated value for our main animation, and then an animated value for our progress bar along the bottom. Our view will need to be flexDirection: "row", this will allow us to lay our buttons out on the left and right sides.
```
<code class="js language-js">import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
 
export default class animations extends Component {
  state = {
    index: 0,
    questions: [
      "Do you tend to follow directions when given?",
      "Are you comfortable with the idea of standing and doing light physical activity most of the day?",
      "Would you enjoy making sure your customers leave happy?",
      "Are you willing to work nights and weekends (and possibly holidays)?",
    ],
    animation: new Animated.Value(0),
    progress: new Animated.Value(0),
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
    backgroundColor: "#E22D4B",
    flexDirection: "row",
  },
});
 
AppRegistry.registerComponent("animations", () => animations);
</code>
```
Add Buttons

Now we need to setup 2 buttons. The one on top will be our No button which because we are in a "row" layout will now be on the left side. Additionally the Yes will be on the right side.
```
<code class="js language-js">return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleAnswer} style={styles.option} activeOpacity={0.7}>
          <Text style={styles.optionText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleAnswer}
          style={[styles.option, styles.yes]}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>Yes</Text>
        </TouchableOpacity>
      </View>
    );
</code>
```
Our TouchableOpacity is actually an Animated.View so that means we can apply styling to it. It is still in a column direction. So we will apply flex: 1 to each button so they will take up each half of the space available. Then we center the content in the middle of the screen with alignItems: "center", but justify it's content to the end of the screen.

The yes button will have an opaque background to it, so we do a rgba of white and a .1 opacity.

Our optionText which is being justified to the end we can add some margin to bring it up slightly.
```
<code class="js language-js">
option: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  yes: {
    backgroundColor: "rgba(255,255,255,.1)",
  },
  optionText: {
    fontSize: 30,
    color: "#FFF",
    marginBottom: 50,
  },
</code>
```
Add Questions

Now we need to derive both the current question and the next question that should appear on the screen. This will allow us to simultaneously center one, and then offset one. When one is answered we can move one off the screen, move the next one to the middle. Once our animation is complete then we will swap the active index with the index of the question that we moved into the middle of the screen. Nothing will have visibly changed to the user, but we will have our next question waiting off screen.

To get this all setup we get both the current and next question if we have one.
```
<code class="js language-js">const question = questions[index];
let nextQuestion;
if (index + 1 < questions.length) {
  nextQuestion = questions[index + 1];
}
</code>
```
Then we render a view ABOVE our buttons. That way our buttons will be rendered above our question and still be interactable. However because they have transparent backgrounds the questions will appear.
```
<code class="js language-js">
<View style={[styles.overlay, StyleSheet.absoluteFill]} >
  <Animated.Text style={[styles.questionText]}>
    {question}
  </Animated.Text>
  <Animated.Text style={[styles.questionText]}>
    {nextQuestion}
  </Animated.Text>
</View>
</code>
```
Our overlay just centers the question in the middle of the screen. We need to absolutely position our text questions because they are in the same container one will appear below the other. So when it animates into view it would be below, and not inline.
```
<code class="js language-js">  
  overlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    fontSize: 30,
    color: "#FFF",
    textAlign: "center",
    position: "absolute",
  },
</code>
```
Add A Reset Button

We'll just toss a simple X button at the end to reset everything. We'll need to reset our progress value, our animation, and our index back to their defaults.
```
<code class="js language-js">  
reset = () => {
    this.state.animation.setValue(0);
    this.state.progress.setValue(0);
    this.setState({
      index: 0,
    });
  };
</code>
```
We put the Close button at the end because it needs to sit on top of our option buttons otherwise it won't be clickable.
```
<code class="js language-js">return (
      <View style={styles.container}>
        <View style={[styles.overlay, StyleSheet.absoluteFill]} >
          <Animated.Text style={[styles.questionText]}>
            {question}
          </Animated.Text>
          <Animated.Text style={[styles.questionText]}>
            {nextQuestion}
          </Animated.Text>
        </View>
 
        <TouchableOpacity onPress={this.handleAnswer} style={styles.option} activeOpacity={0.7}>
          <Text style={styles.optionText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.handleAnswer}
          style={[styles.option, styles.yes]}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={this.reset}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </View>
    );
</code>
<code class="js language-js">close: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "transparent",
  },
  closeText: {
    fontSize: 30,
    color: "#FFF",
  },
</code>
```
Animate Questions

First up when our button is clicked we don't care whether it was a yes or no, we'll animate it off the screen. We'll trigger 2 animations to happen at the same time. One we aren't using yet and it's our progress bar, but we'll still animate it.

We animate it to the current index to the next index. Then our animated value to 1. Once it's complete and our next question is in the middle, we will swap the current question and next question. Then in our componentDidUpdate callback we need to reset our animated value back to 0 for our next question.

Basically it goes 1) Move current question out of screen and next question into middle 2) Make question in the middle now the active question 3) Next question is now off screen 4) Reset back to 0 so our active question while our new active question won't appear offset
```
<code class="js language-js">handleAnswer = () => {
    Animated.parallel([
      Animated.timing(this.state.progress, {
        toValue: this.state.index + 1,
        duration: 400,
      }),
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 400,
      }),
    ]).start(() => {
      this.setState(
        state => {
          return {
            index: state.index + 1,
          };
        },
        () => {
          this.state.animation.setValue(0);
        }
      );
    });
  };
</code>
```
Our interpolates will be the reverse of each other. Both will take an inputRange of [0, 1]. However we need to craft our outputRange correctly.

Our main question at 0 needs to appear in the middle of the screen. Then when the animation moves to 1 it needs to animate the width of the screen. Because we want it to animate left, we need to move it in a negative direction.

Then our next interpolated question we want to render it but offset it the width of the screen to start. Then as we animate towards 1 it will reduce it to 0 and be in the middle of the screen.

Finally we craft up our styling for our translateX for each question.
```
<code class="js language-js">  const { index, questions } = this.state;
  const { width } = Dimensions.get("window");
 
  const nextQuestionInterpolate = this.state.animation.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });
 
  const mainQuestionInterpolate = this.state.animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });
 
 
  const mainQuestionStyle = {
    transform: [
      {
        translateX: mainQuestionInterpolate,
      },
    ],
  };
 
  const nextQuestionStyle = {
    transform: [
      {
        translateX: nextQuestionInterpolate,
      },
    ],
  };
</code>
```
Then we need to pass each style into their respective questions.
```
<code class="js language-js"><View style={[styles.overlay, StyleSheet.absoluteFill]} >
  <Animated.Text style={[styles.questionText, mainQuestionStyle]}>
    {question}
  </Animated.Text>
  <Animated.Text style={[styles.questionText, nextQuestionStyle]}>
    {nextQuestion}
  </Animated.Text>
</View>
</code>
```
Progress Bar

We need a progress indicator. It doesn't matter where this sits but putting it above the buttons so the buttons are always on top will allow the user to tap on the bar and still answer the question.
```
<code class="js language-js">        
        <View style={styles.progress}>
          <Animated.View style={[styles.bar, progressStyle]} />
        </View>
</code>
```
Our interpolations can be dynamic based upon state. In this case we set it up so that it starts at 0 and then won't fill up till we answer based on the length all of the questions. This will interpolate automatically to filling up our bar using percentage width values.
````
<code class="js language-js">    
const progressInterpolate = this.state.progress.interpolate({
      inputRange: [0, questions.length],
      outputRange: ["0%", "100%"],
    });
</code>
```
Finally our styling is a absolutely positioning view that we put at the bottom (no top value), and give it a height of 10. Then our inner bar will confine itself to the entire height of it's parent which is just 10 and the progressInterpolate will control the width.
```
<code class="js language-js">  progress: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 10,
  },
  bar: {
    height: "100%",
    backgroundColor: "#FFF",
  },
</code>

```
Ending