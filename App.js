import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import  Event  from "./src/Event";
import Decay from "./src/Decay";
import CreateAnimatedComp from "./src/CreateAnimatedComp";
import ParentPanReasponder from "./src/ParentPanResponder";
import CustomCreateAnimatedComp from "./src/CustomCreateAnimatedComp";
import SetNativeProps from "./src/SetNativeProps";
import Hidden from "./src/Hidden";
import PointerEvents from "./src/PointerEvents";
import $4Corners from "./src/4Corners";
import StaggerHeads from "./src/StaggerHeads";
import KittenCards from "./src/KittenCards";
import StaggerFormFields from "./src/StaggerFormFields";
import ButtonWithProgress from "./src/ButtonWithProgress";

const App = () => {
  return (
      // <Event />
      // <Decay />
      // <ParentPanReasponder/>
      // <CreateAnimatedComp/>
      // <CustomCreateAnimatedComp/>
      // <SetNativeProps/>
      // <Hidden/>
      // <PointerEvents/>
      // <$4Corners/>
      // <StaggerHeads/>
      // <KittenCards/>
      // <StaggerFormFields/>
      <ButtonWithProgress/>

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
