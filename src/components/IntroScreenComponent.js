import React from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  PixelRatio,
  StyleSheet
} from "react-native";
import * as Images from "../../utilities/imagesForIntroScreen";

const { width, height } = Dimensions.get("window");

export default IntroScreenComponent = props => {
  return (
    <View style={{ width, height, backgroundColor: "#F89E20" }}>
      <View style={styles.screenHeader}>
        <Animated.Image
          source={Images.Image1}
          style={[
            {
              width: PixelRatio.getPixelSizeForLayoutSize(75),
              height: PixelRatio.getPixelSizeForLayoutSize(63)
            },
            props.screenStyles2
          ]}
          resizeMode="contain"
        />

        <Animated.Image
          source={Images.Image2}
          style={[
            {
              width: PixelRatio.getPixelSizeForLayoutSize(46),
              height: PixelRatio.getPixelSizeForLayoutSize(28),
              position: "absolute",
              top: 230,
              left: 60
            },
            props.screenStyles
          ]}
          resizeMode="contain"
        />
        <Animated.Image
          source={Images.Image3}
          style={{
            width: PixelRatio.getPixelSizeForLayoutSize(23),
            height: PixelRatio.getPixelSizeForLayoutSize(17),
            position: "absolute",
            top: 180,
            left: 60
          }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.container}>
        <Text>{props.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  screenHeader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  screenText: {
    flex: 1
  }
});
