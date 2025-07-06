import { StyleSheet } from "react-native";

const colors = {
  primary: "#4F46E5",
  secondary: "#6B7280",
  background: "#F3F4F6",
  text: "#1F2937",
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: "row",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Spacing
  p: {
    padding: spacing.md,
  },
  px: {
    paddingHorizontal: spacing.md,
  },
  py: {
    paddingVertical: spacing.md,
  },
  m: {
    margin: spacing.md,
  },
  mx: {
    marginHorizontal: spacing.md,
  },
  my: {
    marginVertical: spacing.md,
  },
  mb: {
    marginBottom: spacing.md,
  },

  // Colors
  bgPrimary: {
    backgroundColor: colors.primary,
  },
  bgSecondary: {
    backgroundColor: colors.secondary,
  },
  bgBackground: {
    backgroundColor: colors.background,
  },
  textPrimary: {
    color: colors.primary,
  },
  textSecondary: {
    color: colors.secondary,
  },
  textText: {
    color: colors.text,
  },

  // Typography
  textBase: {
    fontSize: 16,
  },
  textSm: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 18,
  },
  textXl: {
    fontSize: 20,
  },
  fontBold: {
    fontWeight: "bold",
  },

  // Borders
  rounded: {
    borderRadius: borderRadius.md,
  },
  roundedLg: {
    borderRadius: borderRadius.lg,
  },
  border: {
    borderWidth: 1,
    borderColor: colors.secondary,
  },

  // Components
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  card: {
    backgroundColor: "white",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
 