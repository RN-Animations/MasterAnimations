import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";

import images from "../utilities/imagesForPhotoGrid";

// Here is a way to do shared absolute positioning!
/* In RN you can measure any element. It will return:
x
y
width 
height
pageX
pageY

So, we're going to measure the clicked image 
and then measure also the place we want to
animated to. Then animate it there with the new values.
So we'll need access to the ref of the image, 
to get the coordinates and the size.
*/
export default class PhotoGrid extends Component {
  state = {
    activeImage: null,
    size: new Animated.ValueXY(),
    position: new Animated.ValueXY(),
    animation: new Animated.Value(0)
  };
  UNSAFE_componentWillMount() {
    // here we save a reference for each image.
    // check <Image /> in Touchable...
    this._gridImages = {};
  }

  handleOpenImage = index => {
    // get access to the ref and call measure on it
    // Note: In the given code we use getNode(), like:
    // this._gridImages[index].getNode().measure(...)
    // But I get an error!
    this._gridImages[index].measure((x, y, width, height, pageX, pageY) => {
      // we need to save off the previous values, to animate back
      this._x = pageX;
      this._y = pageY;
      this._width = width;
      this._height = height;

      // Set  values to swap out the active image
      this.state.position.setValue({
        x: pageX,
        y: pageY
      });

      this.state.size.setValue({
        x: width,
        y: height
      });
    });
    // Why we call setState inside the measure func?
    // Well I moved setState outside and it still worked fine.
    // Ready to animate
    this.setState(
      {
        activeImage: images[index],
        activeIndex: index
      },
      // this callback is equivalent to componentDidUpdate
      // Here the image has appeared.
      () => {
        // `t` is for target
        this._viewImage.measure((tX, tY, tWidth, tHeight, tPageX, tPageY) => {
          Animated.parallel([
            Animated.spring(this.state.position.x, {
              toValue: tPageX
            }),
            Animated.spring(this.state.position.y, {
              toValue: tPageY
            }),
            Animated.spring(this.state.size.x, {
              toValue: tWidth
            }),
            Animated.spring(this.state.size.y, {
              toValue: tHeight
            }),
            Animated.spring(this.state.animation, {
              toValue: 1
            })
          ]).start();
        });
      }
    );
  };

  handleClose = () => {
    Animated.parallel([
      Animated.timing(this.state.position.x, {
        toValue: this._x,
        duration: 250
      }),
      Animated.timing(this.state.position.y, {
        toValue: this._y,
        duration: 250
      }),
      Animated.timing(this.state.size.x, {
        toValue: this._width,
        duration: 250
      }),
      Animated.timing(this.state.size.y, {
        toValue: this._height,
        duration: 250
      }),
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: 250
      })
    ]).start(() => {
      this.setState({
        activeImage: null
      });
    });
  };

  render() {
    const animatedContentTranslate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0]
    });

    const animatedContentStyles = {
      opacity: this.state.animation,
      transform: [
        {
          translateY: animatedContentTranslate
        }
      ]
    };

    const activeImageStyle = {
      width: this.state.size.x,
      height: this.state.size.y,
      top: this.state.position.y,
      left: this.state.position.x
    };

    // We don't animate this. We want it to be instant!
    const activeIndexStyle = {
      opacity: this.state.activeImage ? 0 : 1
    };

    const animatedCloseStyle = {
      opacity: this.state.animation
    };
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.grid}>
            {/* If we would add images dynamically, then they should be on state. */}
            {images.map((src, index) => {
              const style =
                index === this.state.activeIndex ? activeIndexStyle : undefined;
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => this.handleOpenImage(index)}
                >
                  <Image
                    style={[styles.gridImage, style]}
                    source={src}
                    resizeMode="cover"
                    ref={image => (this._gridImages[index] = image)}
                  />
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
        {/*  Set up a view to transition to */}
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents={!!this.state.activeImage ? "auto" : "none"}
        >
          {/* This View takes the space we want to occupy with Animated.Image*/}
          <View
            style={styles.topContent}
            // to get the measurements of the space we want to occupy
            ref={image => (this._viewImage = image)} // does not work for android
            onLayout={() => {}} // For Android - this tells React that we need access to the measurements
          ></View>

          <Animated.View style={[styles.content, animatedContentStyles]}>
            <Text style={styles.title}>Pretty Image from Unsplash</Text>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              lobortis interdum porttitor. Nam lorem justo, aliquam id feugiat
              quis, malesuada sit amet massa. Sed fringilla lorem sit amet metus
              convallis, et vulputate mauris convallis. Donec venenatis
              tincidunt elit, sed molestie massa. Fusce scelerisque nulla vitae
              mollis lobortis. Ut bibendum risus ac rutrum lacinia. Proin vel
              viverra tellus, et venenatis massa. Maecenas ac gravida purus, in
              porttitor nulla. Integer vitae dui tincidunt, blandit felis eu,
              fermentum lorem. Mauris condimentum, lorem id convallis fringilla,
              purus orci viverra metus, eget finibus neque turpis sed turpis.
            </Text>
          </Animated.View>
        </View>
        {/* Move it to the root view, so the animation will work fine also in android */}
        <Animated.Image
          key={this.state.activeImage} // clear the cash everytime we toggle an image
          source={this.state.activeImage}
          resizeMode="cover" // the same as the other above!!!
          style={[styles.viewImage, activeImageStyle]}
        />
        <TouchableWithoutFeedback onPress={this.handleClose}>
          <Animated.View style={[styles.close, animatedCloseStyle]}>
            <Text style={styles.closeText}>X</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  gridImage: {
    width: "33%",
    height: 120 // actually calculate per screen size
  },
  // these will be overriden when animation runs
  viewImage: {
    width: null,
    height: null,
    position: "absolute",
    top: 0,
    left: 0
  },
  topContent: {
    flex: 1
  },
  content: {
    flex: 2,
    backgroundColor: "#FFF"
  },
  title: {
    fontSize: 28
  },
  close: {
    position: "absolute",
    top: 20,
    right: 20
  },
  closeText: {
    backgroundColor: "transparent",
    fontSize: 28,
    color: "#FFF"
  }
});
