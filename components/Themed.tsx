/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput } from 'react-native';
import React, { forwardRef } from 'react';
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

// export function TextInput(props: TextInputProps, ref: React.Ref<DefaultTextInput>) {
//   const { style, lightColor, darkColor, ...otherProps } = props;
//   const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
//   const color = useThemeColor({ dark: lightColor, light: darkColor }, "text");

//   return <DefaultTextInput ref={ref} style={[{ backgroundColor, color }, style]} {...otherProps} />;
// }


//import React, { forwardRef } from 'react';

export const TextInput = forwardRef((props: TextInputProps, ref: React.Ref<DefaultTextInput> ) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const color = useThemeColor({ dark: lightColor, light: darkColor }, "text");
  const placeholderTextColor = useThemeColor({ dark: lightColor, light: darkColor }, "tint");

  return (
    <DefaultTextInput
      ref={ref}
      style={[{ backgroundColor, color}, style]}
      placeholderTextColor={placeholderTextColor}
      {...otherProps}
    />
  );
});