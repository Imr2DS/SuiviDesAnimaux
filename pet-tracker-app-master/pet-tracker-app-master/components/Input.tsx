import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { theme } from "../constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  withBorder?: boolean;
}

export const Input = ({
  label,
  error,
  fullWidth = false,
  className = "",
  withBorder = false,
  ...props
}: InputProps) => {
  const viewStyle = {
    backgroundColor: theme.colors.background.DEFAULT,
    borderWidth: withBorder ? 1 : 0,
    borderColor: error ? theme.colors.error : theme.colors.text.light,
    borderRadius: theme.borderRadius.DEFAULT,
    padding: withBorder ? theme.spacing.md : 0,
    color: theme.colors.text.DEFAULT,
    fontSize: theme.typography.fontSize.base,
  };

  const style = {
    backgroundColor: theme.colors.background.DEFAULT,
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.text.light,
    borderRadius: theme.borderRadius.DEFAULT,
    padding: theme.spacing.md,
    color: theme.colors.text.DEFAULT,
    fontSize: theme.typography.fontSize.base,
  };

  const inputStyle = [style, props.style];

  return (
    <View style={[fullWidth ? { width: "100%" } : {}, viewStyle]}>
      {label && <Text style={{ marginBottom: 4 }}>{label}</Text>}
      <TextInput
        {...props}
        style={[{ marginTop: 4 }, inputStyle]}
        placeholderTextColor={theme.colors.text.light}
      />
      {error && (
        <Text
          style={{
            color: theme.colors.error,
            fontSize: theme.typography.fontSize.sm,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
