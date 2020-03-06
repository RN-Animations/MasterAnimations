The createAnimatedComponent call can wrap any component and intercept any prop that it detects is an Animated.Value of some sort. It has special case built in to look at the style prop, flatten it, and determine what is an Animated.Value that needs to be updated.

The Animated value passed has listeners attached inside createAnimatedComponent and when an animation is triggered those listeners will call setNativeProps directly for us. Now because we have props being managed internally if a setState happens (even mid animation), the render cycle will happen as usual and the props that are passed over to the native world will be the same as whatever the animated value would be sending over.

Rather than me explaining even more check out the concept from Vjeux himself https://www.youtube.com/watch?v=xtqUJVqpKNo and his slides are here)

Source Code

Live Demo Code