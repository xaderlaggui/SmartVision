// app/_layout.tsx
import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router'; // Slot is necessary to render child pages

const Layout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Slot />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 100, 
    borderBottomRightRadius: 100, 
  },
  body: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    padding: 0,
    backgroundColor:'#d7e0ee',
  },
});

export default Layout;
