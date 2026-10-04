import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { BottomBarIconProps } from "../types";

const BottomBarIcon: React.FC<BottomBarIconProps> = ({
  iconName,
  size,
  onPress,
}: BottomBarIconProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon
        name={iconName as keyof typeof Icon.glyphMap}
        size={size}
        style={styles.iconButton}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    color: "dodgerblue",
  },
});

export default BottomBarIcon;
