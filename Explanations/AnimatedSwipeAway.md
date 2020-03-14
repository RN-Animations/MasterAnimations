[Repo](https://github.com/browniefed/examples/blob/realworld/commentmodal/realworld/app.ios.js).

- onScroll
Fires at most once per frame during scrolling. The frequency of the events can be controlled using the `scrollEventThrottle` prop. The event has the shape 
```js
{ nativeEvent: { 
    contentInset: { bottom, left, right, top }, 
    contentOffset: { x, y }, 
    contentSize: { height, width }, 
    layoutMeasurement: { height, width }, zoomScale } }
```
All values are numbers.

- onContentSizeChange
Called when scrollable content view of the ScrollView changes.

Handler function is passed the content width and content height as parameters: 
`(contentWidth, contentHeight)`

It's implemented using `onLayout` handler attached to the content container which this ScrollView renders.

Check questions at Udemy
[How does the if statement work in onMoveShouldSetPanResponder?](https://www.udemy.com/course/master-react-native-animations/learn/lecture/8648332#questions/9639898)
