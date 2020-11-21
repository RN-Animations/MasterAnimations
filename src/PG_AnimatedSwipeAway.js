import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  TextInput,
  ScrollView
} from "react-native";

export default class PG_AnimatedSwipeAway extends Component {
  //WARNING! To be deprecated in React v17. Use componentDidMount instead.
  UNSAFE_componentWillMount() {
    this.animated = new Animated.Value(0);
    this.animatedMargin = new Animated.Value(0); // For the crashing swipe down effect
    this.scroll_Y_Offset = 0;
    this.contentHeight = 0;
    this.scrollViewHeight = 0;

    this.panResponder = PanResponder.create({
      // When we want to take our take over of the gestures.
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dy } = gestureState;
        // console.log("gestureState:", gestureState);
        /* gestureState: Object {
          "_accountsForMovesUpTo": 1267218646.949578,
          "dx": 0,
          "dy": 0.5,
          "moveX": 114.5,
          "moveY": 326,
          "numberActiveTouches": 1,
          "stateID": 0.5527058869144951,
          "vx": 0,
          "vy": 3.945649010165605e-10,
          "x0": 0,
          "y0": 0,
        } */
        const totalScrollHeight = this.scroll_Y_Offset + this.scrollViewHeight;
        // when should this panResponter respont
        // 1st. For when we are at the top and we're dragging downwards
        // and we want to pass our thresshold.
        // 2nd. opposite

        // This triggers when the whole modal is swiped away.
        // this.animated.addListener(({ value }) => console.log("value", value));
        // console.log("gestureState", gestureState);

        if (
          // When we are at the top and dragging down.
          (this.scroll_Y_Offset <= 0 && dy > 0) ||
          //   (this.scroll_Y_Offset >= 0 && dy < 0)
          (totalScrollHeight >= this.contentHeight && dy < 0)
        ) {
          return true;
        }
      },
      onPanResponderMove: (e, gestureState) => {
        const { dy } = gestureState;
        if (dy < 0) {
          this.animated.setValue(dy);
        } else if (dy > 0) {
          this.animatedMargin.setValue(dy);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        const { dy } = gestureState;
        // console.log("gestureState:", gestureState);

        // swiping up
        if (dy < -150) {
          Animated.parallel([
            Animated.timing(this.animated, {
              toValue: -400,
              duration: 150
            }),
            Animated.timing(this.animatedMargin, {
              toValue: 0,
              duration: 150
            })
          ]).start();
          // haven't gone anywhere
        } else if (dy > -150 && dy < 150) {
          Animated.parallel([
            Animated.spring(this.animated, {
              toValue: 0,
              duration: 150
            }),
            Animated.spring(this.animatedMargin, {
              toValue: 0,
              duration: 150
            })
          ]).start();
          // swiping down
        } else if (dy > 150) {
          Animated.timing(this.animated, {
            toValue: 400,
            duration: 300
          }).start();
        }
      }
    });
  }
  render() {
    const spacerStyle = {
      marginTop: this.animatedMargin
    };

    const opacityInterpolate = this.animated.interpolate({
      /* Because we can fade both going up and down,
        we use 400 ect so we can use the same opacity interpolate
        for both interactions */
      inputRange: [-400, 0, 400],
      outputRange: [0, 1, 0]
    });

    const modalStyle = {
      // control the swiping up and down
      transform: [{ translateY: this.animated }],
      opacity: opacityInterpolate
    };

    return (
      <View style={styles.container}>
        <Animated.View style={spacerStyle} />
        <Animated.View
          style={[styles.modal, modalStyle]}
          {...this.panResponder.panHandlers}
        >
          <View style={styles.comments}>
            <ScrollView
              // notify every 16'' that a scroll happent
              scrollEventThrottle={16}
              onScroll={event => {
                // ({layoutMeasurement, contentOffset})

                // console.log("event", event);
                /* event SyntheticEvent {
                "_dispatchInstances": FiberNode {
                  "tag": 5,
                  "key": null,
                  "type": "RCTScrollView",
                },
                "_dispatchListeners": [Function anonymous],
                "_targetInst": FiberNode {
                  "tag": 5,
                  "key": null,
                  "type": "RCTScrollView",
                },
                "bubbles": undefined,
                "cancelable": undefined,
                "currentTarget": 157,
                "defaultPrevented": undefined,
                "dispatchConfig": Object {
                  "registrationName": "onScroll",
                },
                "eventPhase": undefined,
                "isDefaultPrevented": [Function functionThatReturnsFalse],
                "isPropagationStopped": [Function functionThatReturnsFalse],
                "isTrusted": undefined,
                "nativeEvent": Object {
                  "contentInset": Object {
                    "bottom": 0,
                    "left": 0,
                    "right": 0,
                    "top": 0,
                  },
                  "contentOffset": Object {
                    "x": 0,
                    "y": 539,
                  },
                  "contentSize": Object {
                    "height": 1094,
                    "width": 313,
                  },
                  "layoutMeasurement": Object {
                    "height": 555,
                    "width": 313,
                  },
                  "zoomScale": 1,
                },
                "target": undefined,
                "timeStamp": 1605925212685,
                "type": undefined,
              } */

                this.scroll_Y_Offset = event.nativeEvent.contentOffset.y;
                this.scrollViewHeight =
                  event.nativeEvent.layoutMeasurement.height;

                // this.animated.addListener(({ value }) =>
                //   console.log("value", value)
                // );
                // A portion of the above log:
                /* 
                value 0.016671120196190607
                value 0.016671120196190607
                value 0.016671120196190607
                value 400
                value 400
                value 400
                */
              }}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.contentHeight = contentHeight;
                // console.log("contentHeight", contentHeight);
                /* This `contentHeight` has the same value (1094) as the above
                event.contentSize.height */
              }}
            >
              <Text style={styles.fakeText}>Top</Text>
              <View style={styles.fakeComments} />
              <Text style={styles.fakeText}>Bottom</Text>
            </ScrollView>
          </View>
          <View style={styles.inputWrap}>
            <TextInput style={styles.textInput} placeholder="Comment" />
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30
  },
  modal: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333"
  },
  comments: {
    flex: 1
  },
  fakeText: {
    padding: 15,
    textAlign: "center"
  },
  fakeComments: {
    height: 1000,
    backgroundColor: "#f1f1f1"
  },
  inputWrap: {
    flexDirection: "row",
    paddingHorizontal: 15
  },
  textInput: {
    flex: 1,
    height: 50,
    borderTopWidth: 1,
    borderTopColor: "#000"
  }
});
