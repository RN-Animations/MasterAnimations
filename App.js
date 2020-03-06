import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import  Event  from "./src/Event";
import Decay from "./src/Decay";
import CreateAnimatedComp from "./src/CreateAnimatedComp";
import ParentPanReasponder from "./src/ParentPanResponder";
import CustomCreateAnimatedComp from "./src/CustomCreateAnimatedComp";
import SetNativeProps from "./src/SetNativeProps";

const App = () => {
  return (
      // <Event />
      // <Decay />
      // <ParentPanReasponder/>
      // <CreateAnimatedComp/>
      <CustomCreateAnimatedComp/>
      // <SetNativeProps/>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
