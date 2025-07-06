/// <reference types="nativewind/types" />

declare module "nativewind" {
  import type { ComponentType } from "react";
  import type {
    ImageProps,
    ScrollViewProps,
    TextProps,
    ViewProps,
  } from "react-native";

  export function styled<T extends ComponentType<any>>(Component: T): T;

  export interface StyledProps {
    className?: string;
  }

  export type StyledViewProps = ViewProps & StyledProps;
  export type StyledTextProps = TextProps & StyledProps;
  export type StyledImageProps = ImageProps & StyledProps;
  export type StyledScrollViewProps = ScrollViewProps & StyledProps;
}
