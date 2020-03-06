Animated values are the instances that wrap around the values to animate. They provide the hooks for Animated.Views and Animated methods to operate and notify each other that animations are happening.

- Animated.Value

This is the basic value unit of Animated. It holds a singular value and is what is passed into Animated.View, any Animated animation method, and is used for interpolate.

- Animated.ValueXY

This is a combination of 2 Animated.Values, an x and a y. The only difference is that Animated.ValueXY provides helper methods for things like translate transforms and or absolute position animations. Those methods are getTranslateTransform and getLayout.

getTranslateTransform will return an array that can be passed directly to a transform. However if you are using other transforms you'll need to combine the arrays.

These 2 are equivalent
```
<code>
const animatedStyle = {
  transform: this._animation.getTranslateTransform()
}
const animatedStyle = {
  transform: [{
    translateX: this._animation.x
  }, {
    translateY: this._animation.y
  }]
}
</code>
```
The same goes for getLayout. This will return a top and left object.

These 2 are also equivalent

````
<code>
const animatedStyle = this._animation.getLayout()
 
const animatedStyle = {
  top: this._animation.y,
  left: this._animation.x
}
</code>
```

- setValue

Both Animated.Value and Animated.ValueXY have a setValue function. This will immediately adjust the animated value. There will be no animation, any Animated.View that has received the particular Animated.Value will adjust appropriately.

This is a typical way to reset an animation, or to set starting values when dealing with dynamic values.

The only difference is that Animated.ValueXY can receive a single value setValue(0) which will set both the x and the y values to 0. The other method is to pass an object specifying the x and y values to set like setValue({ x: 5, y: 0 }). Finally you can also reference the .x and .y and call setValue on them directly like this._animation.x.setValue(5).

Neither method is wrong, it all depends on personal preference, your needs, and or what you have access to.

- Listeners

Sometimes you may need raw access to an animated value. Due to the nature of Animated being async you must supply a listener. You define this with `addListener` and provide a callback. It is necessary that this is async because if the animation is being driven/calculated by the native world the exactly value will not be synchronously available.

The syntax looks like this.
```
<code class="js language-js">
this._animation.addListener(({ value }) => {
  // Do something here
  // Keep track of the value this.animatedValue = value
  // Trigger other animations
})
</code>
```
The listener gets called with an object, and with a value key. In the case of `Animated.Value` the value key will refer to single number. In the case of `Animated.ValueXY` this will be an object with x, and y keys with their respective values.

- Offset

Using setOffset is underutilized but beneficial when dealing with gestures and animations. It allows you to set an initial offset value to be added into the animated value.

So if we had `this._animation = Animated.Value(0)` and then called `this._animation.setOffset(15)`. The Animated.Value is still set to 0 but then will have 15 added to it. So the actual value when accessed would be 15 and not 0.

`Offset` is necessary for `gestures` as you typically want to use `translateX` and `translateY` to move an item in conjunction with the `dx/dy`. The `delta X` and `delta Y`, which are the `deltas` of the touch from the original position. Using setOffset allows you to use `Animated.event` in conjunction with a `PanResponder` and `addListener` to set the `offset` to the previous animated position. Then you can simply feed the `dx/dy` into the `Animated.ValueXY`. We will explain this more in depth when we are dealing with gestures, and show a few examples.

Just know that the syntax for setting offset matches `setValue`. So for `Animated.Value` it's simply `this._animation.setValue(15)`, and for `Animated.ValueXY` you'd pass in `this._animation.setOffset({x: 5, y: 15 })`.

Additionally there are `flattenOffset` and `extractOffset`. These operate in a reverse manner.

`flattenOffset` will take the offset and merge into the value of the `Animated.Value` and set the offset to 0.

Example:
```
<code class="js language-js">
this._animation = Animated.Value(15);
this._animation.setOffset(5);
 
this._animation.flattenOffset();
 
//value = 20;
//offset = 0;
//overall value = 20;

</code>
```
`extractOffset` will take the value of the `Animated.Value` merge it into the `offset`, and set the value to 0.

```
<code class="js language-js">
this._animation = Animated.Value(15);
this._animation.setOffset(5);
 
this._animation.extractOffset();
 
//value = 0;
//offset = 20;
//overall value = 20
</code>
```
Both of these calls would be consider **noops**. Because the value of an Animated.Value is just offset + value, when these commands are executed there would not be a visible animation effect as the derived values will be the same.

extractOffset will be heavily used for dragging operations.

- Remove Listeners

If you attach a listener it is **absolutely crucial** that you call `removeAllListeners` or `removeListener` in `componentWillUnmount` otherwise memory leaks will happen. This will cause your application to eat up more memory, and keep instances around that aren't necessary.

* `Delta` is simply the difference, or change, in a certain quantity