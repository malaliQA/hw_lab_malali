import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet, Text, Platform, Share } from "react-native";
import { WebView } from "react-native-webview";
import BottomBarIcon from "../Components/BottomBarIcon";
import { BottomBarIconProps } from "../types";

const BrowserView: React.FC = () => {
  const [url, setUrl] = useState("https://www.google.com");
  const [currentUrl, setCurrentUrl] = useState(url);
  const webViewRef = useRef<WebView>(null);

  const handleLoadUrl = () => {
    const validUrl = url.startsWith("http") ? url : `https://${url}`;
    setUrl(validUrl);
    setCurrentUrl(validUrl);
  };

  const handleBack = () => {
    webViewRef.current?.goBack();
  };

  const handleForward = () => {
    webViewRef.current?.goForward();
  };

  const handleShare = () => {
    Share.share({ message: currentUrl });
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  const handleCancel = () => {
    webViewRef.current?.stopLoading();
  };

  const actions: BottomBarIconProps[] = [
    { iconName: "arrow-back", size: 24, onPress: handleBack },
    { iconName: "arrow-forward", size: 24, onPress: handleForward },
    {
      iconName: Platform.OS === "ios" ? "share-outline" : "share-social",
      size: 24,
      onPress: handleShare,
    },
    { iconName: "refresh", size: 24, onPress: handleRefresh },
    { iconName: "close", size: 24, onPress: handleCancel },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.urlBar}>
        <Text style={styles.label}>URL:</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          keyboardType="url"
          returnKeyType="go"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleLoadUrl}
        />
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        onNavigationStateChange={(navState) => setUrl(navState.url)}
      />
      <View style={styles.bottomBar}>
        {actions.map((action, index) => (
          <BottomBarIcon key={index} {...action} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  urlBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
    position: "relative",
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    position: "absolute",
    left: 20,
    fontWeight: "bold",
    zIndex: 1,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 7,
    marginRight: 8,
    paddingLeft: 55,
    opacity: 0.8,
  },
  iconButton: {
    padding: 4,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
  },
});

export default BrowserView;
