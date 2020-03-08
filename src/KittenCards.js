import React, { Component } from "react";
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

import Cat1 from "../assets/cat1.jpeg";
import Cat2 from "../assets/cat2.jpeg";
import Cat3 from "../assets/cat3.jpeg";
import Cat4 from "../assets/cat4.jpeg";


const SWIPE_THRESHOLD = 120;
const { height } = Dimensions.get("window");

export default class KittenCards extends Component {
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
    animation: new Animated.ValueXY(), // cards swipe location
    opacity: new Animated.Value(1),
    next: new Animated.Value(0.9), // For the second card.
  };

  UNSAFE_componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Animated.event is a helper function to map arbitrary data to Animated values.
      // Since here we don't need gestrureState, we use Animated.event
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
            // 3 is minimum and 5 is
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
  
  transitionNext = () => {
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 300,
      }),
      Animated.spring(this.state.next, {
        toValue: 1,
        friction: 4
      }),
    ]).start(() => {
      this.setState(
        state => {
          return {
            items: state.items.slice(1),
          };
        },
        () => {
            // reset the values for the next card
          this.state.next.setValue(0.9);
          this.state.opacity.setValue(1);
          this.state.animation.setValue ({ x: 0, y: 0 });
        }
      );
    });
  };
  // Assing to animation.x the according SWIPE_THRESHOLD and start the animation.
  handleNo = () => {
    Animated.timing(this.state.animation.x, {
      toValue: -SWIPE_THRESHOLD,
    }).start(this.transitionNext);
  };
  handleYes = () => {
    Animated.timing(this.state.animation.x, {
      toValue: SWIPE_THRESHOLD,
    }).start(this.transitionNext);
  };

  render() {
    const { animation } = this.state;

    // set insterpolations
    const rotate = animation.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ["-30deg", "0deg", "30deg"],
      extrapolate: "clamp", // no more rotation than 30deg
    });

    const opacity = animation.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: [0.5, 1, 0.5],
    });

    const yesOpacity = animation.x.interpolate({ inputRange: [0, 150], outputRange: [0, 1] });
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

    const animatedCardStyles = {
      transform: [{ rotate }, ...this.state.animation.getTranslateTransform()],
      opacity
    };

    const animatedImageStyles = {
      opacity,
    };

    return (
      <View style={styles.container}>
        <View style={styles.top}>
          {this.state.items.slice(0, 2).reverse().map(({ image, id, text }, index, items) => {
            const isLastItem = index === items.length - 1;
            const isSecondToLast = index === items.length - 2;

            const panHandlers = isLastItem ? this._panResponder.panHandlers : {};
            const cardStyle = isLastItem ? animatedCardStyles : undefined;
            const imageStyle = isLastItem ? animatedImageStyles : undefined;
            const nextStyle = isSecondToLast
              ? { transform: [{ scale: this.state.next }] }
              : undefined;

            return (
              <Animated.View 
              {...panHandlers} // now able to drag
              style={[styles.card, cardStyle, nextStyle]} key={id}>
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
        </View>
        <View style={styles.buttonBar}>
          <TouchableOpacity onPress={this.handleNo} style={[styles.button, styles.nopeButton]}>
            <Text style={styles.nopeText}>NO</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.handleYes} style={[styles.button, styles.yupButton]}>
            <Text style={styles.yupText}>YES</Text>
          </TouchableOpacity>
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
  buttonBar: {
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

  card: {
    width: 300,
    height: 500,
    position: "absolute",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#FFF",
    elevation: 7
  },
  lowerText: {
    flex: 1,
    color: 'white',
    backgroundColor: "white",
    padding: 5,
  }, 
  image: {
    width: null,  // now the image will take size from flex.
    height: null,// now the image will take size from flex.
    borderRadius: 2,
    flex: 6,
  },
  yup: {
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
});

