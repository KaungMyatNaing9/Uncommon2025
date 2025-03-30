import { StyleSheet, View, Animated } from 'react-native';
import React, { useEffect } from 'react';

export const PacmanLoader = () => {
  const circlesAnimation = React.useRef(new Animated.Value(0)).current;
  const topAnimation = React.useRef(new Animated.Value(0)).current;
  const bottomAnimation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Circles animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(circlesAnimation, {
          toValue: -40,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(circlesAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pacman mouth animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(topAnimation, {
            toValue: -45,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(bottomAnimation, {
            toValue: 45,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(topAnimation, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(bottomAnimation, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.loader}>
      <View style={styles.pacman}>
        <Animated.View 
          style={[
            styles.pacmanPart, 
            styles.top, 
            { 
              transform: [{ 
                rotate: topAnimation.interpolate({
                  inputRange: [-45, 0],
                  outputRange: ['-45deg', '0deg']
                }) 
              }] 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.pacmanPart, 
            styles.bottom, 
            { 
              transform: [{ 
                rotate: bottomAnimation.interpolate({
                  inputRange: [0, 45],
                  outputRange: ['0deg', '45deg']
                }) 
              }] 
            }
          ]} 
        />
        <View style={styles.eye} />
      </View>
      <Animated.View style={[styles.circles, { transform: [{ translateX: circlesAnimation }] }]}>
        <View style={[styles.dot, styles.one]} />
        <View style={[styles.dot, styles.two]} />
        <View style={[styles.dot, styles.three]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    height: 60,
    width: 160,
    position: 'relative',
    alignSelf: 'center',
  },
  circles: {
    position: 'absolute',
    left: 60,
    top: 0,
    height: 60,
    width: 100,
  },
  dot: {
    position: 'absolute',
    top: 25,
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: '#ffaaa4',
  },
  one: {
    right: 80,
  },
  two: {
    right: 40,
  },
  three: {
    right: 0,
  },
  pacman: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 60,
    width: 60,
  },
  pacmanPart: {
    position: 'absolute',
    width: 60,
    height: 30,
    backgroundColor: '#f0b452',
  },
  top: {
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  bottom: {
    top: 30,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  eye: {
    position: 'absolute',
    top: 15,
    left: 30,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#262C3A',
    zIndex: 1,
  },
});