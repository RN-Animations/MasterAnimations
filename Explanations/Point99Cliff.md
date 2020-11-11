### .99 Cliff Explanation

The .99 cliff is a great way to make animations happen instantly. This allows you to keep your animations declarative without having to use a hack to call setValue to make an animated value jump instantly to the value you desire.

This applies to any interpolation including colors, scale, translates, etc.

```js
<code class="js language-js">this.state.animation.interpolate({
  inputRange: [0, .99, 1],
  outputRange: ["rgb(255,255,255)", "rgb(255,255,255)", "rgb(0,0,0)"]
})
</code>
```

This would cause your color to stay white until the very end and then switch to black.

Generally it's a .99 cliff but there are also .01 cliffs. This can be used to trigger the cliff at the beginning of an animation.

For example if you wanted a view to be hidden and immediately visible before other animations take place. You would setup your interpolation like so.

```js
<code class="js language-js">this.state.animation.interpolate({
  inputRange: [0, .01, 1],
  outputRange: [0, 0, 1]
})
</code>
```

Cliffs

In general cliffs are a great way to generate a multi part animation. You can keep an from moving, or keep an element hidden, etc until you've completed a portion of a separate animation.

In the interpolation below we want our animation to trigger half way through the animation. So we specify our input range at [0, .5] and that maps to our output which we specify as [0,0]. When our animation is progressing from 0 to .5 the interpolation will always output 0. Once our animation exceeds .5 our output value will now start progressing from 0 to 1.

```js
<code class="js language-js">this.state.animation.interpolate({
  inputRange: [0, .5, 1]
  outputRange: [0, 0, 1]
})
</code>
```
