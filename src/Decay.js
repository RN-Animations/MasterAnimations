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
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";

export default class Decay extends Component {
  state = {
    animation: new Animated.ValueXY(0),
  };

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.state.animation.extractOffset();
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: this.state.animation.x, dy: this.state.animation.y },
      ]),
      // { vx, vy } = deconstructing gestureState
      onPanResponderRelease: (e, { vx, vy }) => {
        Animated.decay(this.state.animation, {
          velocity: { x: vx, y: vy },
          deceleration: 0.997,
        }).start();
      },
    });
  }

  render() {
    const animatedStyle = {
      transform: this.state.animation.getTranslateTransform(),
    };

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
    justifyContent: "center",
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: "tomato",
  },
});


