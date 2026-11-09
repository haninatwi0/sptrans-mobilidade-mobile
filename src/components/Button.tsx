
import { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { COLORS, RADIUS, SPACING } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const colors = {
    primary: ['#08243A', '#1C5278', COLORS.primary],
    secondary: ['#D6A01F', '#F9CA55', COLORS.secondary],
    outline: ['#DCE8F1', '#E8F0F6', 'transparent'],
    danger: ['#B3261E', '#F7D6D3', '#FCE8E7'],
  };

  const selectedColors = colors[variant];

  const backgroundColor = pressed
    ? selectedColors[0]
    : hovered
      ? selectedColors[1]
      : selectedColors[2];

  const textColor =
    variant === 'secondary'
      ? COLORS.text
      : variant === 'outline'
        ? COLORS.primary
        : variant === 'danger'
          ? '#B3261E'
          : COLORS.white;

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor:
            variant === 'danger' ? '#B3261E' : COLORS.primary,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
