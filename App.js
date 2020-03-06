import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import  Event  from "./src/Event";
import Decay from "./src/Decay";

const App = () => {
  return (
      // <Event />
      <Decay />

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
