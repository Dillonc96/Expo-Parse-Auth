import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}
export function WarningText(props: TextProps) {
  return <Text {...props} style={[props.style, { color: 'red', fontWeight: "bold", fontStyle: 'italic', fontFamily: "SpaceMono" }]} />;
}