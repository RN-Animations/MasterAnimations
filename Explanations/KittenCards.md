### Kitten Cards Explanation
Intro

Dragging cards left/right has become the new way to quickly make decisions on apps. Adding draggable card stacks can take some fine tuning to get the ideal feeling for your app. We'll walk through how to implement the drag and additionally add an extra animation step to scale in the next card.

Setup

We'll need to gather a few images, and install a module from npm. I've provided the images but if you prefer non-cat related images you can pick your own set.

We'll use the clamp module from npm to be able to clamp our velocity so we don't throw cards off the screen.

<code>npm install clamp
</code>
Now our basic setup will include some structure on our state, and also setting up a SWIPE_THRESHOLD. This threshold will define how far you want to be able to drag a card before it is considered a decision. This is an arbitrary number, but you may want to base it off of screen size, or something else.

Additionally we'll setup 3 animated values. One for the dragging of the card that is on top. The second for the fade out opacity of the card once a decision has been made. The third for the scale of the card behind the top card to add a subtle pop in effect.

We want to add a button bar on the bottom, so we'll add a wrapping container, and then an additional top container to hold our cards. This will keep space for our button bar on the bottom.

<code class="js language-js">import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
 
import clamp from "clamp";
 
import Cat1 from "./cat1.jpeg";
import Cat2 from "./cat2.jpeg";
import Cat3 from "./cat3.jpeg";
import Cat4 from "./cat4.jpeg";
 
const SWIPE_THRESHOLD = 120;
const { height } = Dimensions.get("window");
 
export default class animations extends Component {
  state = {
    items: [
      {
        image: Cat1,
        id: 1,
        text: "Sweet Cat",
      },
      {
        image: Cat2,
        id: 2,
        text: "Sweeter Cat",
      },
      {
        image: Cat3,
        id: 3,
        text: "Sweetest Cat",
      },
      {
        image: Cat4,
        id: 4,
        text: "Aww",
      },
    ],
    animation: new Animated.ValueXY(),
    opacity: new Animated.Value(1),
    next: new Animated.Value(0.9),
  };
 
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
 
        </View>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
 
AppRegistry.registerComponent("animations", () => animations);
</code>
Add The Cards

We will use slice and reverse to get the first 2 cat items. Then reverse so that the first one will be rendered on top and be touchable. Only rendering 2 items will allow us to handle any significant amount as we won't render all of the cards but we'll make it look like it's an infinite list with all rendered. Additionally this will allow us to focus our animations on a subset of views without worrying about other views.

<code class="js language-js">return (
      <View style={styles.container}>
        <View style={styles.top}>
          {this.state.items.slice(0, 2).reverse().map(({ image, id, text }, index, items) => {
            return (
              <Animated.View style={[styles.card]} key={id}>
                <Animated.Image
                  source={image}
                  style={[styles.image]}
                  resizeMode="cover"
                />
                <View style={styles.lowerText}>
                  <Text>
                    {text}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>
    );
</code>
The key piece of styling here is the position: "absolute" on the card without left/top positioning. This means the alignItems: "center" and justifyContent: "center" will effect the cards and allow them to float freely on top of each other.

On Android you need to add an elevation to the card if you want a shadow to appear. Shadows do not work on Android yet.

Also rather than defining a set width/height of our image or text we can use flex. If we clear width/height to null, we can specify that our image should take up 3 times as much space as the lower text container.

<code class="js language-js">card: {
    width: 300,
    height: 300,
    position: "absolute",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  lowerText: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 5,
  },
  image: {
    width: null,
    height: null,
    borderRadius: 2,
    flex: 3,
  },
</code>
Drag a Card

We setup a PanResponder, and because we don't intend for the cards to ever be dragged after they already were dragged we do not need to call extractOffset.

Then we will use Animated.event to map our dx/dy to our animated values for dragging.

Our release will be the key area as this is where the drag needs to be analyzed and a decision made.

We first need to figure out the velocity. If our velocity was 0 or positive then we will clamp it between 3 and 5 for our decay.

If it's negative we will use Math.abs to flip it to positive value, clamp it, and then multiply by -1 to convert it back to a negative value.

Then we need to decide on if we met our threshold for a decision. We'll convert our dx drag to an always positive number with Math.abs and see if exceeded our threshold. If it did then we will continue our decay animation and the velocity that we had figured out. Then we can call our transitionNext function.

Otherwise it didn't meet our threshold we can animate back to 0.

<code class="js language-js">componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {
          dx: this.state.animation.x,
          dy: this.state.animation.y,
        },
      ]),
      onPanResponderRelease: (e, { dx, vx, vy }) => {
        let velocity;
 
        if (vx >= 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(Math.abs(vx), 3, 5) * -1;
        }
 
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          Animated.decay(this.state.animation, {
            velocity: { x: velocity, y: vy },
            deceleration: 0.98,
          }).start(this.transitionNext);
        } else {
          Animated.spring(this.state.animation, {
            toValue: { x: 0, y: 0 },
            friction: 4,
          }).start();
        }
      },
    });
  }
</code>
This is an arbitrary function that can be called after a decision has been made. It can be used for the swipe, as well as the yes/no buttons.

Once our animation is complete then we will trigger a setState and remove our top card with slice(1). Because we are referencing our previous state we'll use the updater method of setState which is a function that receives the existing state and will trigger a setState with returned object.

<code class="js language-js">transitionNext = () => {
  this.setState(
    state => {
      return {
        items: state.items.slice(1),
      };
    });
};
</code>
Now we need to apply our panHandlers to the top view. We reversed the 2 items, so that means the view on top will be the last item in the list. So we just grab the 3rd argument which is the list of items we are mapping over and then see if it's the last item.

We can then either return our panHandlers or an empty object to make it easy to spread onto our view.

Our animation style is built using our this.state.opacity directly, as well as the getTranslateTransform transform helper.

We'll add in an arbitrary 200 on either side drag with an outputRange of 30deg and clamp it so that our card cannot turn more than 30 degrees to either side.

We'll also apply an opacity with the same 200 range and fade out the image slightly as the card is being dragged in a particular direction. This will then allow us to emphasize the yes/no as it scales in and our image fades out.

<code class="js language-js">const { animation } = this.state;
 
const rotate = animation.x.interpolate({
  inputRange: [-200, 0, 200],
  outputRange: ["-30deg", "0deg", "30deg"],
  extrapolate: "clamp",
});
 
const opacity = animation.x.interpolate({
  inputRange: [-200, 0, 200],
  outputRange: [0.5, 1, 0.5],
});
 
const animatedCardStyles = {
  transform: [{ rotate }, ...this.state.animation.getTranslateTransform()],
  opacity: this.state.opacity,
};
 
const animatedImageStyles = {
  opacity,
};
 
 
{this.state.items.slice(0, 2).reverse().map(({ image, id, text }, index, items) => {
            const isLastItem = index === items.length - 1;
            const panHandlers = isLastItem ? this._panResponder.panHandlers : {};
 
            const imageStyle = isLastItem ? animatedImageStyles : undefined;
            const cardStyle = isLastItem ? animatedCardStyles : undefined;
 
            return (
              <Animated.View {...panHandlers} style={[styles.card]} key={id}>
                <Animated.Image
                  source={image}
                  style={[styles.image, imageStyle]}
                  resizeMode="cover"
                />
                <View style={styles.lowerText}>
                  <Text>
                    {text}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
</code>
Yes/No

The yes/no appearing are all controlled based upon the direction that the drag is happening. We will want to control the scale and opacity of the yes/no that is sitting inside the card, on top of the image. We will also just add a static rotate of 30deg. This could be placed in our StyleSheet but you may want to make this dynamic so I've placed it here.

We'll only want to show them on top of the top card, aka the last item. So we will only render it if it's the last item using our isLastItem variable.

The ranges for the yes/no are again arbitrary, but it's key to note that the inputRange will correspond with the direction that the cards are dragged.

To the right (yes) will be positive values, so at 0 nothing is shown so we can see the 0 in the inputRange maps to a 0 in the output range. Then as we drag towards 150 on the right it will slowly scale in.

For our no, we need to handle when we drag to the left, aka going negative on our x animation. In our case we have -150 as the first value because we start at 0. inputRanges always need to be going in a ascending fashion. So from either (0 or negative) => greater value.

This is why we then need to flip out outputRange, because the 0 in is the second argument and at 0 we want no animation to be applied.

<code class="js language-js">const yesOpacity = animation.x.interpolate({ inputRange: [0, 150], outputRange: [0, 1] });
const yesScale = animation.x.interpolate({
  inputRange: [0, 150],
  outputRange: [0.5, 1],
  extrapolate: "clamp",
});
const animatedYupStyles = {
  transform: [{ scale: yesScale }, { rotate: "-30deg" }],
  opacity: yesOpacity,
};
 
const noOpacity = animation.x.interpolate({ inputRange: [-150, 0], outputRange: [1, 0] });
const noScale = animation.x.interpolate({
  inputRange: [-150, 0],
  outputRange: [1, 0.5],
  extrapolate: "clamp",
});
const animatedNopeStyles = {
  transform: [{ scale: noScale }, { rotate: "30deg" }],
  opacity: noOpacity,
};
 
{this.state.items.slice(0, 2).reverse().map(({ image, id, text }, index, items) => {
            const isLastItem = index === items.length - 1;
            const isSecondToLast = index === items.length - 2;
 
            const panHandlers = isLastItem ? this._panResponder.panHandlers : {};
            const cardStyle = isLastItem ? animatedCardStyles : undefined;
 
            return (
              <Animated.View {...panHandlers} style={[styles.card, cardStyle]} key={id}>
                <Animated.Image
                  source={image}
                  style={[styles.image, imageStyle]}
                  resizeMode="cover"
                />
                <View style={styles.lowerText}>
                  <Text>
                    {text}
                  </Text>
                </View>
 
                {isLastItem &&
                  <Animated.View style={[styles.nope, animatedNopeStyles]}>
                    <Text style={styles.nopeText}>Nope!</Text>
                  </Animated.View>}
 
                {isLastItem &&
                  <Animated.View style={[styles.yup, animatedYupStyles]}>
                    <Text style={styles.yupText}>Yup!</Text>
                  </Animated.View>}
              </Animated.View>
            );
          })}
</code>
Then we do some styling, we setup a green border, with coloring, and position in the top/left for yes, and top/right for nope. These will be on the opposite directions of the drag so they can stay visible to the user.

<code class="js language-js">yup: {
    borderColor: "green",
    borderWidth: 2,
    position: "absolute",
    padding: 20,
    borderRadius: 5,
    top: 20,
    left: 20,
    backgroundColor: "#FFF",
  },
  yupText: {
    fontSize: 16,
    color: "green",
  },
  nope: {
    borderColor: "red",
    borderWidth: 2,
    position: "absolute",
    padding: 20,
    borderRadius: 5,
    right: 20,
    top: 20,
    backgroundColor: "#FFF",
  },
  nopeText: {
    fontSize: 16,
    color: "red",
  },
</code>
Pop and Transition To Next Card

The only addition here to the map is that we need to know if it's the secondToLastItem aka the card behind our top card. We could check if we're at the 0 index, but if you're rendering more than 1 card in the future this math will work.

Regardless we create a new transform and just pass our this.state.next animated value into scale and apply it to our card as nextStyle.

<code class="js language-js">{this.state.items.slice(0, 2).reverse().map(({ image, id, text }, index, items) => {
            const isLastItem = index === items.length - 1;
            const isSecondToLast = index === items.length - 2;
 
            const panHandlers = isLastItem ? this._panResponder.panHandlers : {};
            const cardStyle = isLastItem ? animatedCardStyles : undefined;
            const imageStyle = isLastItem ? animatedImageStyles : undefined;
            const nextStyle = isSecondToLast
              ? { transform: [{ scale: this.state.next }] }
              : undefined;
 
            return (
              <Animated.View {...panHandlers} style={[styles.card, cardStyle, nextStyle]} key={id}>
                <Animated.Image
                  source={image}
                  style={[styles.image, imageStyle]}
                  resizeMode="cover"
                />
                <View style={styles.lowerText}>
                  <Text>
                    {text}
                  </Text>
                </View>
 
                {isLastItem &&
                  <Animated.View style={[styles.nope, animatedNopeStyles]}>
                    <Text style={styles.nopeText}>Nope!</Text>
                  </Animated.View>}
 
                {isLastItem &&
                  <Animated.View style={[styles.yup, animatedYupStyles]}>
                    <Text style={styles.yupText}>Yup!</Text>
                  </Animated.View>}
              </Animated.View>
            );
          })}
</code>
Here we do our pop and opacity fade out at the same time. Our opacity is for the front card that's been moved out of the way, and the next is the scale transition that will make the card look as if it's springing into place.

The key here is our callback to our setState. The callback is a componentDidUpdate callback. This means that we've removed the card that was swiped and now our previous card that popped into place will now officially be the card stacked on top.

We need to reset all our values now since it's a fresh card so we'll set our opacity to 1, and then our next scale we'll reset back to .9 to spring into place. Then finally we reset our drag position to be 0 again.

<code class="js language-js">transitionNext = () => {
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 300,
      }),
      Animated.spring(this.state.next, {
        toValue: 1,
        friction: 4,
      }),
    ]).start(() => {
      this.setState(
        state => {
          return {
            items: state.items.slice(1),
          };
        },
        () => {
          this.state.next.setValue(0.9);
          this.state.opacity.setValue(1);
          this.state.animation.setValue({ x: 0, y: 0 });
        }
      );
    });
  };
</code>
Add Buttons

Below our top container we add our button bar. These are just a few styled buttons for yes and no.

<code class="js language-js"><View style={styles.buttonBar}>
  <TouchableOpacity onPress={this.handleNo} style={[styles.button, styles.nopeButton]}>
    <Text style={styles.nopeText}>NO</Text>
  </TouchableOpacity>
 
  <TouchableOpacity onPress={this.handleYes} style={[styles.button, styles.yupButton]}>
    <Text style={styles.yupText}>YES</Text>
  </TouchableOpacity>
</View>
</code>
The button bar is set to flexDirection: "row" and we center our buttons on the screen.

<code class="js language-js">buttonBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  button: {
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.3,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 5,
  },
  yupButton: {
    shadowColor: "green",
  },
  nopeButton: {
    shadowColor: "red",
  },
</code>
Finally with our arbitrary transitionNext call setup we can emulate what a drag to the perfect position would have been. We simply animate our x position which has our rotate, and our yes/no values interpolated off of to our desired SWIPE_THRESHOLD.

For our no we need to animate to a negative SWIPE_THRESHOLD, and for yes a positive SWIPE_THRESHOLD.

<code class="js language-js">  handleNo = () => {
    Animated.timing(this.state.animation.x, {
      toValue: -SWIPE_THRESHOLD,
    }).start(this.transitionNext);
  };
  handleYes = () => {
    Animated.timing(this.state.animation.x, {
      toValue: SWIPE_THRESHOLD,
    }).start(this.transitionNext);
  };
</code>
Ending

Live Demo Code

Just understand that when you are dealing with drags, you can animate at any point depending on what you are attempting to accomplish.

You have onPanResponderGrant, onPanResponderMove, and onPanResponderRelease at your disposal. Think of these as life cycle methods of React, but for a drag.

The onPanResponderGrant will be called once per drag when it starts. This is where we do any setup necessary to prepare for the drag. Typically you'll be doing stuff for your animated values that will be effected by the onPanResponderMove. However you could imagine that you want to trigger a start animation.

The onPanResponderMove will be called for every drag operation that happens. You likely will be piping this into an Animated.ValueXY, however there could be case that you need to trigger an animation based upon the position of a drag. Do realize that using Animated.event is calling setValue which is technically triggering an animation. So don't hesitate to trigger animations in onPanResponderMove. Like animating a color if the drag goes too far, and we need that in real time.

The onPanResponderRelease is post-drag. This is generally going to be when you either reset an animation back to it's normal state. Like when a user doesn't drag far enough on our cards up above. Additionally this is also when you can do some sort of completion animation. This is where we can also use setState to effect layouts because this only called once.

There are even more PanResponder methods but these are the most important 3. Play around with executing animations in each function