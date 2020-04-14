Event Explanation

The Animated.event is a utility method to automatically set a value on an Animated.Value given an array/keys to traverse. Typically this would be used with the `onScroll` or `onPanResponderMove`. It receives an array of instructions. `Animated.event` returns a function, when the function is called the arguments it is called with are applied to the instructions in the array you provided. Once those instructions are traversed when ever the function is called it just does a `setValue` with the provided value on to the `Animated.Value`.

The typical callback signature of React is `event` first, then additional properties like `gestureState` for `PanResponders`. On the `event` `nativeEvent` contains all the content you need.

Because a function would be called with `(event, gestureState) => {}`, the instructions to get data from event would need to be placed into the first array spot in `Animated.event`.

In the case of an `onScroll` from a `ScrollView` you need to provide a few levels of instructions.
```js
<code class="js language-js">
Animated.event([
{
  nativeEvent: {
    contentOffset: {
      y: this._animation
    }
  }
}
])
</code>
```
If you don't need to reference anything off an `event` simply pass in `null` so that the argument call signature matches the array of instructions.

In the case of a `PanResponder` you would skip the event piece with null and only provide instructions to automatically set animated values from `gestureState`.
```js
<code class="js language-js">
Animated.event([
  null,
  {
    dx: this._animation.x,
    dy: this._animation.y
  }
])
</code>
```

The output of the event from the listener:
`{ listener: event => console.log(event) }`

```js
SyntheticEvent {
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
  "currentTarget": 7,
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
      "y": -15.666666666666666,
    },
    "contentSize": Object {
      "height": 3000,
      "width": 414,
    },
    "layoutMeasurement": Object {
      "height": 896,
      "width": 414,
    },
    "zoomScale": 1,
  },
  "target": undefined,
  "timeStamp": 1586845806480,
  "type": undefined,
}
```

Extra info

- [Animated.event](https://animationbook.codedaily.io/animated-event/)
- [interpolation](https://facebook.github.io/react-native/docs/animations#interpolation)
- [scrollEventThrottle](https://reactnative.dev/docs/scrollview#scrolleventthrottle)
- [How does Animated.Event work in React Native?](https://stackoverflow.com/questions/43510145/how-does-animated-event-work-in-react-native)
- [PanResponder](https://facebook.github.io/react-native/docs/panresponder)
- [getLayout](https://animationbook.codedaily.io/get-layout/)
- `getLayout` is a method of [AnimatedValueXY](https://facebook.github.io/react-native/docs/animatedvaluexy#getlayout)
- [Tracking gestures](https://facebook.github.io/react-native/docs/animations#tracking-gestures)
- [A gestureState object has the following](https://facebook.github.io/react-native/docs/panresponder#__docusaurus)
    