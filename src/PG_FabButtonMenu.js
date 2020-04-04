import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  Animated,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const HEIGTH = Dimensions.get("window").height;

export default class PG_FabButtonMenu extends Component {
  state = {
    animation: new Animated.Value(0),
    orderAnimation: new Animated.Value(0),
    reloadAnimation: new Animated.Value(0),
    hanldeOrder: false,
    hanldeReload: false,
    price: "5.00"
  };
  toggleOpen = () => {
    const toValue = this._open ? 0 : 1;

    Animated.timing(this.state.animation, {
      toValue,
      duration: 200
    }).start();

    this._open = !this._open;
  };

  hanldeOrder = () => {
    this.setState({ hanldeOrder: true });
    Animated.timing(this.state.orderAnimation, {
      toValue: 1,
      duration: 1000
    }).start(() => {
      this.setState({ hanldeOrder: false });
      this.state.orderAnimation.setValue(0);
    });
  };

  hanldeReload = () => {
    this.setState({ hanldeReload: true });
    Animated.timing(this.state.reloadAnimation, {
      toValue: 1,
      duration: 1200
    }).start(() => {
      this.setState({ hanldeReload: false });
      this.setState({ price: "0" });
      this.state.reloadAnimation.setValue(0);
      this.toggleOpen();
    });
  };

  render() {
    const reloadStyle = {
      transform: [
        {
          scale: this.state.animation
        },
        {
          translateX: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -65]
          })
        },
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -65]
          })
        }
      ]
    };

    const hanldeReloadStyle = {
      transform: [
        {
          rotate: this.state.reloadAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ["0dec", "-5dec"]
          })
        },
        {
          translateX: this.state.reloadAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-65, 120]
          })
        },
        {
          translateY: this.state.reloadAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-65, 126]
          })
        }
      ]
    };

    const orderStyle = {
      transform: [
        {
          scale: this.state.animation
        },
        {
          translateX: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -12]
          })
        },
        {
          translateY: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -120]
          })
        }
      ]
    };

    const handleOrderStyle = {
      opacity: this.state.orderAnimation.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [1, 0.5, 0]
      }),
      transform: [
        {
          // scale: this.state.orderAnimation.interpolate({
          //   inputRange: [0, 1 ],
          //   outputRange: [1, 0]
          // })
          scale: this.state.orderAnimation.interpolate({
            inputRange: [0, 0.2, 0.3, 0.4, 0.6, 0.8, 1],
            outputRange: [1, 1.2, 1.4, 1.6, 1.8, 2, 2.2]
          })
        },
        {
          translateX: this.state.orderAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-12, -12]
          })
        },
        {
          translateY: this.state.orderAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [-120, -HEIGTH]
          })
        }
      ]
    };

    const labelPositionInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, -55]
    });

    const opacityInterpolate = this.state.animation.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 0, 1]
    });

    const labelStyle = {
      opacity: opacityInterpolate,
      transform: [
        {
          translateX: labelPositionInterpolate
        }
      ]
    };

    const bgStyle = {
      transform: [
        {
          scale: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 33]
          })
        }
      ]
    };
    return (
      <View style={styles.container}>
        {/* self closing tag */}
        <Animated.View style={[styles.background, bgStyle]} />
        <TouchableWithoutFeedback onPress={this.hanldeOrder}>
          <Animated.View
            style={[
              styles.button,
              styles.other,
              orderStyle,
              this.state.hanldeOrder ? handleOrderStyle : null
            ]}
          >
            <Animated.Text style={[styles.label, labelStyle]}>
              Order
            </Animated.Text>
            <Icon name="food-fork-drink" size={20} color="#00B15E" />
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.hanldeReload}>
          <Animated.View
            style={[
              styles.button,
              styles.other,
              reloadStyle,
              this.state.hanldeReload ? hanldeReloadStyle : null
            ]}
          >
            <Animated.Text style={[styles.label, labelStyle]}>
              Reload
            </Animated.Text>
            <Icon name="reload" size={20} color="red" />
          </Animated.View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.toggleOpen}>
          <View style={[styles.button, styles.pay]}>
            <Animated.Text style={[styles.label, labelStyle, { width: 200 }]}>
              Total amount
            </Animated.Text>
            <Text style={styles.payText}>${this.state.price}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    backgroundColor: "rgba(0,0,0,.5)",
    position: "absolute",
    width: 60,
    height: 60,
    bottom: 20,
    right: 20,
    borderRadius: 30
  },
  button: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#333",
    shadowOpacity: 0.1,
    shadowOffset: { x: 2, y: 0 },
    shadowRadius: 2,
    borderRadius: 30,
    position: "absolute",
    bottom: 20,
    right: 20
  },
  other: {
    backgroundColor: "#FFF",
    width: 40,
    height: 40,
    borderRadius: 20
  },
  payText: {
    color: "#FFF"
  },
  pay: {
    backgroundColor: "#00B15E"
  },
  label: {
    color: "#FFF",
    position: "absolute",
    fontSize: 18,
    backgroundColor: "transparent",
    width: 60
  }
});
