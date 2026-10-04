import React from "react";
import { StatusBar } from "expo-status-bar";
import AppView from "./Views/AppView";

export default function App() {
  return (
    <>
      <AppView />
      <StatusBar style="auto" />
    </>
  );
}
