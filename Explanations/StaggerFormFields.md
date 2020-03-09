Stagger Form Items Visibility on Mount Explanation
Intro

There may be times where you want to have an effect on mount. In some cases a subtle hidden => visible effect. This can be applied to many different elements for example google does a slight translate/fade for it's now cards. We'll apply it to inputs of a login form.

Setup

We'll start by importing the various components we'll need. The first key piece is the Animated.createAnimatedComponent call. Animated doesn't export a pre-wrapped TextInput for us so we need to create a TextInput that can handle animated values.

Then because we will have 3 pieces to this form, an email, password, and a button we need to setup an animated value for each.

<code class="js language-js">import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Animated,
  KeyboardAvoidingView
} from "react-native";
 
import Background from "./background.jpg";
 
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
 
export default class animations extends Component {
  state = {
    email: new Animated.Value(0),
    password: new Animated.Value(0),
    button: new Animated.Value(0),
  };
 
  render() {
 
    return (
      <View style={styles.container}>
 
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
 
AppRegistry.registerComponent("animations", () => animations);
</code>
Add Background

To set a background we will use Image, and use the StyleSheet.absoluteFill helper to make it cover the entire screen. We also need to set the width and height to null so that our child elements are laid out correctly.

<code class="js language-js">  render() {
    return (
      <View style={styles.container}>
        <Image
          source={Background}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { width: null, height: null }]}
        >
 
        </Image>
      </View>
    );
  }
</code>
Center Some Content

In order for our view to appear in the middle we will add 2 Views on either side that are both flex: 1. This will create even sized height on either side of our center view. We then use KeyboardAvoidingView so that on small screens our view will be moved upward and still be visible for users to type in content.

<code class="js language-js">  render() {
    return (
      <View style={styles.container}>
        <Image
          source={Background}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { width: null, height: null }]}
        >
          <View style={styles.container} />
          <KeyboardAvoidingView behavior="padding">
 
          </KeyboardAvoidingView>
          <View style={styles.container} />
        </Image>
      </View>
    );
  }
</code>
Add Form Title and Styling

We'll setup some form styling. The KeyboardAvoidingView is a View itself so we will apply our styling to it. We'll add a container, and a title.

<code class="js language-js"><KeyboardAvoidingView style={styles.form} behavior="padding">
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
  </View>
</KeyboardAvoidingView>
</code>
Our styling for our form will be a light dark see through background with some padding on either side. We will also be sure and add backgroundColor: "transparent" to our title otherwise it will have a white background.

<code class="js language-js">  title: {
    fontSize: 30,
    color: "#FFF",
    backgroundColor: "transparent",
    textAlign: "center",
    marginBottom: 10,
  },
  form: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.25)",
    paddingVertical: 10,
  },
</code>
Add Fields

Next we'll add in our TextInputs, but we'll use the AnimatedTextInput that we created earlier. The other thing we need to do is get a ref to the element. This will allow us to focus on the input later when our animation is complete.

<code class="js language-js"><KeyboardAvoidingView style={styles.form} behavior="padding">
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
    <AnimatedTextInput
      ref={email => (this._email = email)}
      style={[styles.input]}
      placeholder="Email"
      keyboardType="email-address"
    />
    <AnimatedTextInput
      placeholder="Password"
      style={[styles.input]}
      secureTextEntry
    />
  </View>
</KeyboardAvoidingView>
</code>
This is just some standard input styling, most importantly we need to define a width and height.

<code class="js language-js">input: {
    width: 250,
    height: 35,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FFF",
    color: "#333",
    backgroundColor: "#FFF",
  },
</code>
Add a Button

We'll add our button bellow our inputs, and just use a TouchableOpacity. We'll need to use an Animated.View for our button to be able to transition.

<code class="js language-js"><KeyboardAvoidingView style={styles.form} behavior="padding">
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
    <AnimatedTextInput
      ref={email => (this._email = email)}
      style={[styles.input]}
      placeholder="Email"
      keyboardType="email-address"
    />
    <AnimatedTextInput
      placeholder="Password"
      style={[styles.input]}
      secureTextEntry
    />
    <TouchableOpacity>
      <Animated.View style={[styles.button]}>
        <Text style={styles.buttonText}>Login</Text>
      </Animated.View>
    </TouchableOpacity>
  </View>
</KeyboardAvoidingView>
</code>
<code class="js language-js">button: {
    marginTop: 10,
    backgroundColor: "tomato",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 16,
  },
</code>
Add Animated Styles

Our animations will be exactly the same for each of our animated values so we'll create a function that will take each animated value and return styling.

In our case we will use interpolate to offset our view -5. This way it will start offset upwards 5 and then slowly descend to a 0 offset.

We'll just pass in our animation as the opacity as it will be animating from 0 to 1 which is the animation we want.

<code class="js language-js">const createAnimationStyle = animation => {
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 0],
  });
 
  return {
    opacity: animation,
    transform: [
      {
        translateY,
      },
    ],
  };
};
</code>
Finally to use it we just call our function and pass in our animated values, then pass them into each of the corresponding views.

<code class="js language-js">render() {
    const emailStyle = createAnimationStyle(this.state.email);
    const passwordStyle = createAnimationStyle(this.state.password);
    const buttonStyle = createAnimationStyle(this.state.button);
 
    return (
      <View style={styles.container}>
        <Image
          source={Background}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { width: null, height: null }]}
        >
          <View style={styles.container} />
          <KeyboardAvoidingView style={styles.form} behavior="padding">
            <View style={styles.container}>
              <Text style={styles.title}>Login</Text>
              <AnimatedTextInput
                ref={email => (this._email = email)}
                style={[styles.input, emailStyle]}
                placeholder="Email"
                keyboardType="email-address"
              />
              <AnimatedTextInput
                placeholder="Password"
                style={[styles.input, passwordStyle]}
                secureTextEntry
              />
              <TouchableOpacity>
                <Animated.View style={[styles.button, buttonStyle]}>
                  <Text style={styles.buttonText}>Login</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <View style={styles.container} />
        </Image>
      </View>
    );
  }
</code>
Stagger Animation

Our animation for each will be exactly the same, but if you desire a different animation you can customize each specifically. We'll use stagger and provide a 100ms offset before each animation is executed.

The most important piece here is passing a callback to start so we can call focus on our email input so the user will be able to start typing into the field. Because we are referencing an animated value we need to call getNode() to get access to the internal ref of the actual TextInput instance so we can call focus.

<code class="js language-js">  componentDidMount() {
    Animated.stagger(100, [
      Animated.timing(this.state.email, {
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(this.state.password, {
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(this.state.button, {
        toValue: 1,
        duration: 200,
      }),
    ]).start(() => {
      this._email.getNode().focus();
    });
  }
</code>
Ending

Staggering fade of certain elements can help direct the users focus towards specific elements while also giving you extra time you may need to load it's content. Also when dealing with forms, focus the form field for the users so they do not have to tap on the form field.