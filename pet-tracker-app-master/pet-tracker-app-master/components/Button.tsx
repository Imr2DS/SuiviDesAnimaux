import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Spinner, Stack, Button as TamaguiButton, Text } from "tamagui";
import { theme } from "../constants/theme";

interface ButtonProps {
  onPress: () => void;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button = ({
  onPress,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) => {
  // Map your theme and variant to Tamagui props
  const buttonBg = theme.colors.primary.DEFAULT;
  const buttonText = "white";
  const color =
    variant === "primary"
      ? buttonBg
      : variant === "secondary"
      ? "$color2"
      : "transparent";
  const textColor =
    variant === "outline" || variant === "ghost" ? buttonBg : buttonText;
  const borderWidth = variant === "outline" ? 1 : 0;
  const width = fullWidth ? "100%" : "auto";
  const padding = size === "sm" ? "$2" : size === "lg" ? "$4" : "$3";
  const borderRadius = size === "sm" ? "$2" : size === "lg" ? "$4" : "$3";

  return (
    <TamaguiButton
      onPress={onPress}
      disabled={disabled || loading}
      backgroundColor={color}
      borderWidth={borderWidth}
      borderColor={buttonBg}
      width={width}
      padding={padding}
      borderRadius={borderRadius}
      opacity={disabled ? 0.5 : 1}
      style={style}
    >
      <Stack flexDirection="row" alignItems="center" justifyContent="center">
        {loading && <Spinner size="small" color={textColor} marginRight={8} />}
        <Text color={textColor} fontWeight="600">
          {children}
        </Text>
      </Stack>
    </TamaguiButton>
  );
};
