import React from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text
} from "react-native";
import { black } from "ansi-colors";

export default class CustomButton extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
      >
        <View
          // onPress={this.props.onPress}
          style={[ styles.buttonStyle, {backgroundColor: this.props.backgroundColor}, {...this.props.style}]  }
        >
          <Text style={[ styles.text, {color: this.props.color},  ]}>
            {this.props.title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    borderColor: "black",
    borderWidth: 1,
    marginVertical: 5,
    paddingBottom: 3,
    borderRadius: 15,
    alignSelf: "center",
    backgroundColor: "tomato",
    elevation: 7
  },
  text: {
    color: "white",
    textAlign: "center",
    padding: 20,
  }
});
