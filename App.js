import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import  Event  from "./src/Event";

const App = () => {
  return (
      <Event />
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
