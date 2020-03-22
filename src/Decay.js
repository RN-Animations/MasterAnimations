import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  PanResponder
} from "react-native";

/* The Animated.decay call is primarily used for dragging and gesture animations. 
All it requires is to provide a velocity in an x and y direction 
as well as a friction (deceleration) to slow it down. 
This means you can create realistic throwing animations, etc.
The primary use case is for gesture animations 
after a user has released their finger. */
export default class Decay extends Component {
  state = {
    animation: new Animated.ValueXY(0)
  };

  UNSAFE_componentWillMount() {
    // We either use these or the extractOffset
    // this._x = 0;
    // this._y = 0;

    // this.state.animation.addListener(value => {
    //   (this._x = value.x), (this._y = value.y);
    // });

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        // We either use these or the extractOffset
        // this.state.animation.setOffset({ x: this._x, y: this._y });
        // this.state.animation.setValue({ x: 0, y: 0 });

        this.state.animation.extractOffset();
      },
      onPanResponderMove: Animated.event([
        null,
        // capture the deltas of the gesture and set them on the animation values
        { dx: this.state.animation.x, dy: this.state.animation.y }
      ]),
      // { vx, vy } = deconstructing gestureState
      onPanResponderRelease: (e, { vx, vy }) => {
        Animated.decay(this.state.animation, {
          velocity: { x: vx, y: vy },
          deceleration: 0.997
        }).start();
      }
    });
  }

  render() {
    // These 2 are equivalent
    const animatedStyle = {
      transform: this.state.animation.getTranslateTransform()
    };
    //   const animatedStyle = {
    //     transform: [{
    //       translateX: this.state.animation.x
    //     }, {
    //       translateY: this.state.animation.y
    //     }]
    //   }
    // }

    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.box, animatedStyle]}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: "tomato"
  }
});

// import React, { useState, useEffect } from "react";
// import { StyleSheet,
//   Text,
//   View,
//   Animated,
//   TouchableWithoutFeedback,
//   PanResponder, } from "react-native";

// const Decay = () => {
//   const [animation] = useState(new Animated.Value(0));

//   useEffect(() => {
//     _panResponder = PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: (e, gestureState) => {
//         animation.extractOffset();
//       },
//       onPanResponderMove: Animated.event([
//         null,
//         { dx: animation.x, dy: animation.y }
//       ]),
//       onPanResponderRelease: (e, { vx, vy }) => {
//         Animated.decay(animation, {
//           velocity: { x: vx, y: vy },
//           deceleration: 0.997
//         }).start();
//       }
//     });
//   });

//   const animatedStyle = {
//     transform: animation.getTranslateTransform()
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[styles.box, animatedStyle]}
//         {..._panResponder.panHandlers}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center"
//   },
//   box: {
//     width: 50,
//     height: 50,
//     backgroundColor: "tomato"
//   }
// });

// export default Decay;
