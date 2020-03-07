import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  PanResponder
} from "react-native";

import Vjeux from "../assets/icon.png";

export default class StaggerHeads extends Component {
  state = {
    heads: [
      {
        image: Vjeux,
        animation: new Animated.ValueXY(),
        text: "Drag Me"
      },
      {
        image: Vjeux,
        animation: new Animated.ValueXY()
      },
      {
        image: Vjeux,
        animation: new Animated.ValueXY()
      },
      {
        image: Vjeux,
        animation: new Animated.ValueXY()
      }
    ]
  };

  UNSAFE_componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.state.heads.map(({ animation }) => {
           // `extractOffset` takes the delta values from the `gestureState`,
           // and moves them in the `offset`,
           // before they override the animated values.
           // So we save the position that the animation is currently at. 
          animation.extractOffset();
          // setValue Animated bug fix
          animation.setValue({ x: 0, y: 0 });
          // But because we have 4 offsets we'll `map` them and extract them. 
           // (see `onPanResponderMove`)
            /* Note when we call `extractOffset` the value is extracted synchronously.
          It's not going through `setValue`, that would stop every other animation,
          So if the `animation.Spring` doesn't come to a rest and then you start another,
          the heads will jump around.
           */
        });
      },
      onPanResponderMove: (e, { dx, dy }) => {
        this.state.heads[0].animation.setValue({
          x: dx,
          y: dy
        });

        const animations = this.state.heads
          .slice(1)
          .map(({ animation }, index) => {
            return Animated.sequence([
              Animated.delay(index * 10),
              Animated.spring(animation, {
                toValue: { x: dx, y: dy }
              })
            ]).start();
          });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.heads
          .slice(0)
          .reverse()
          .map((item, index, items) => {
            const pan =
              index === items.length - 1 ? this._panResponder.panHandlers : {};

            return (
              /* 
                getTranslateTransform
                This is a helper that just saves you some code. 
                The equivalence of what it generates 
                is something like so:
                this._animatedValue = new Animated.ValueXY();
                transform: [
                    {
                        translateX: this._animatedValue.x
                    },
                    {
                        translateY: this._animatedValue.y
                    }
                ]
                 */
              <Animated.View
                {...pan}
                key={index}
                style={[
                  styles.wrap,
                  { transform: item.animation.getTranslateTransform() }
                ]}
              >
                <Image source={item.image} style={styles.head} />
                <Text>{item.text}</Text>
              </Animated.View>
            );
          })}
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
  wrap: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80
  },
  head: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  }
});
