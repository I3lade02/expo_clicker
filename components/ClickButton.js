import React, { useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated, TouchableWithoutFeedback } from 'react-native';

export default function ClickButton({ onClick, theme, scorePerClick }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [showFloat, setShowFloat] = useState(false);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85, 
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    setShowFloat(true);
    floatAnim.setValue(0);
    opacityAnim.setValue(1);

    setShowFloat(true);

    Animated.parallel([
      Animated.timing(floatAnim, {
        toValue: -50,
        duration: 600,
        useNativeDriver: true,
    }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
    }),
    ]).start(() => {
      // Defer setState to next frame to avoid layout warning
      requestAnimationFrame(() => setShowFloat(false));
    });
  }
  
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View
          style={[
            styles.clickButton,
            { backgroundColor: theme.colors.button },
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.clickText}>Compile Code</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      {showFloat && (
        <Animated.Text
          style={[
            styles.floatingText,
            {
              transform: [{ translateY: floatAnim }],
              opacity: opacityAnim,
              color: theme.colors.text,
            },
          ]}
        >
          +{scorePerClick}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clickButton: {
    padding: 30,
    borderRadius: 100,
  },
  clickText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'cemter',
    position: 'relative',
  },
  floatingText: {
    position: 'absolute',
    top: -10,
    fontSize: 18,
    fontWeight: '600',
  },
});
