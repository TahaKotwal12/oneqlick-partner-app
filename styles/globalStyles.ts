// Global Styles for oneQlick User App
// Reusable style patterns and common component styles

import { StyleSheet } from 'react-native';
import { DesignSystem } from '../constants/designSystem';

// Common Layout Styles
export const LayoutStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background.primary,
  },
  
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.background.primary,
  },
  
  containerPadded: {
    flex: 1,
    padding: DesignSystem.spacing.md,
    backgroundColor: DesignSystem.colors.background.primary,
  },
  
  // Row/Column Layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Flex Utilities
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  
  // Alignment
  alignStart: { alignItems: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  alignStretch: { alignItems: 'stretch' },
  
  justifyStart: { justifyContent: 'flex-start' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifySpaceBetween: { justifyContent: 'space-between' },
  justifySpaceAround: { justifyContent: 'space-around' },
  justifySpaceEvenly: { justifyContent: 'space-evenly' },
});

// Common Spacing Styles
export const SpacingStyles = StyleSheet.create({
  // Margin
  m0: { margin: 0 },
  m1: { margin: DesignSystem.spacing.xs },
  m2: { margin: DesignSystem.spacing.sm },
  m3: { margin: DesignSystem.spacing.md },
  m4: { margin: DesignSystem.spacing.lg },
  m5: { margin: DesignSystem.spacing.xl },
  
  // Margin Top
  mt0: { marginTop: 0 },
  mt1: { marginTop: DesignSystem.spacing.xs },
  mt2: { marginTop: DesignSystem.spacing.sm },
  mt3: { marginTop: DesignSystem.spacing.md },
  mt4: { marginTop: DesignSystem.spacing.lg },
  mt5: { marginTop: DesignSystem.spacing.xl },
  
  // Margin Bottom
  mb0: { marginBottom: 0 },
  mb1: { marginBottom: DesignSystem.spacing.xs },
  mb2: { marginBottom: DesignSystem.spacing.sm },
  mb3: { marginBottom: DesignSystem.spacing.md },
  mb4: { marginBottom: DesignSystem.spacing.lg },
  mb5: { marginBottom: DesignSystem.spacing.xl },
  
  // Margin Left
  ml0: { marginLeft: 0 },
  ml1: { marginLeft: DesignSystem.spacing.xs },
  ml2: { marginLeft: DesignSystem.spacing.sm },
  ml3: { marginLeft: DesignSystem.spacing.md },
  ml4: { marginLeft: DesignSystem.spacing.lg },
  ml5: { marginLeft: DesignSystem.spacing.xl },
  
  // Margin Right
  mr0: { marginRight: 0 },
  mr1: { marginRight: DesignSystem.spacing.xs },
  mr2: { marginRight: DesignSystem.spacing.sm },
  mr3: { marginRight: DesignSystem.spacing.md },
  mr4: { marginRight: DesignSystem.spacing.lg },
  mr5: { marginRight: DesignSystem.spacing.xl },
  
  // Margin Horizontal
  mx0: { marginHorizontal: 0 },
  mx1: { marginHorizontal: DesignSystem.spacing.xs },
  mx2: { marginHorizontal: DesignSystem.spacing.sm },
  mx3: { marginHorizontal: DesignSystem.spacing.md },
  mx4: { marginHorizontal: DesignSystem.spacing.lg },
  mx5: { marginHorizontal: DesignSystem.spacing.xl },
  
  // Margin Vertical
  my0: { marginVertical: 0 },
  my1: { marginVertical: DesignSystem.spacing.xs },
  my2: { marginVertical: DesignSystem.spacing.sm },
  my3: { marginVertical: DesignSystem.spacing.md },
  my4: { marginVertical: DesignSystem.spacing.lg },
  my5: { marginVertical: DesignSystem.spacing.xl },
  
  // Padding
  p0: { padding: 0 },
  p1: { padding: DesignSystem.spacing.xs },
  p2: { padding: DesignSystem.spacing.sm },
  p3: { padding: DesignSystem.spacing.md },
  p4: { padding: DesignSystem.spacing.lg },
  p5: { padding: DesignSystem.spacing.xl },
  
  // Padding Top
  pt0: { paddingTop: 0 },
  pt1: { paddingTop: DesignSystem.spacing.xs },
  pt2: { paddingTop: DesignSystem.spacing.sm },
  pt3: { paddingTop: DesignSystem.spacing.md },
  pt4: { paddingTop: DesignSystem.spacing.lg },
  pt5: { paddingTop: DesignSystem.spacing.xl },
  
  // Padding Bottom
  pb0: { paddingBottom: 0 },
  pb1: { paddingBottom: DesignSystem.spacing.xs },
  pb2: { paddingBottom: DesignSystem.spacing.sm },
  pb3: { paddingBottom: DesignSystem.spacing.md },
  pb4: { paddingBottom: DesignSystem.spacing.lg },
  pb5: { paddingBottom: DesignSystem.spacing.xl },
  
  // Padding Left
  pl0: { paddingLeft: 0 },
  pl1: { paddingLeft: DesignSystem.spacing.xs },
  pl2: { paddingLeft: DesignSystem.spacing.sm },
  pl3: { paddingLeft: DesignSystem.spacing.md },
  pl4: { paddingLeft: DesignSystem.spacing.lg },
  pl5: { paddingLeft: DesignSystem.spacing.xl },
  
  // Padding Right
  pr0: { paddingRight: 0 },
  pr1: { paddingRight: DesignSystem.spacing.xs },
  pr2: { paddingRight: DesignSystem.spacing.sm },
  pr3: { paddingRight: DesignSystem.spacing.md },
  pr4: { paddingRight: DesignSystem.spacing.lg },
  pr5: { paddingRight: DesignSystem.spacing.xl },
  
  // Padding Horizontal
  px0: { paddingHorizontal: 0 },
  px1: { paddingHorizontal: DesignSystem.spacing.xs },
  px2: { paddingHorizontal: DesignSystem.spacing.sm },
  px3: { paddingHorizontal: DesignSystem.spacing.md },
  px4: { paddingHorizontal: DesignSystem.spacing.lg },
  px5: { paddingHorizontal: DesignSystem.spacing.xl },
  
  // Padding Vertical
  py0: { paddingVertical: 0 },
  py1: { paddingVertical: DesignSystem.spacing.xs },
  py2: { paddingVertical: DesignSystem.spacing.sm },
  py3: { paddingVertical: DesignSystem.spacing.md },
  py4: { paddingVertical: DesignSystem.spacing.lg },
  py5: { paddingVertical: DesignSystem.spacing.xl },
});

// Typography Styles
export const TypographyStyles = StyleSheet.create({
  // Headings
  h1: {
    fontSize: DesignSystem.typography.fontSize['4xl'],
    fontWeight: DesignSystem.typography.fontWeight.bold,
    lineHeight: DesignSystem.typography.fontSize['4xl'] * DesignSystem.typography.lineHeight.tight,
    color: DesignSystem.colors.text.primary,
  },
  
  h2: {
    fontSize: DesignSystem.typography.fontSize['3xl'],
    fontWeight: DesignSystem.typography.fontWeight.bold,
    lineHeight: DesignSystem.typography.fontSize['3xl'] * DesignSystem.typography.lineHeight.tight,
    color: DesignSystem.colors.text.primary,
  },
  
  h3: {
    fontSize: DesignSystem.typography.fontSize['2xl'],
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    lineHeight: DesignSystem.typography.fontSize['2xl'] * DesignSystem.typography.lineHeight.tight,
    color: DesignSystem.colors.text.primary,
  },
  
  h4: {
    fontSize: DesignSystem.typography.fontSize.xl,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    lineHeight: DesignSystem.typography.fontSize.xl * DesignSystem.typography.lineHeight.normal,
    color: DesignSystem.colors.text.primary,
  },
  
  h5: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    lineHeight: DesignSystem.typography.fontSize.lg * DesignSystem.typography.lineHeight.normal,
    color: DesignSystem.colors.text.primary,
  },
  
  h6: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    lineHeight: DesignSystem.typography.fontSize.base * DesignSystem.typography.lineHeight.normal,
    color: DesignSystem.colors.text.primary,
  },
  
  // Body Text
  body1: {
    fontSize: DesignSystem.typography.fontSize.base,
    fontWeight: DesignSystem.typography.fontWeight.normal,
    lineHeight: DesignSystem.typography.fontSize.base * DesignSystem.typography.lineHeight.normal,
    color: DesignSystem.colors.text.primary,
  },
  
  body2: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.normal,
    lineHeight: DesignSystem.typography.fontSize.sm * DesignSystem.typography.lineHeight.normal,
    color: DesignSystem.colors.text.secondary,
  },
  
  // Caption
  caption: {
    fontSize: DesignSystem.typography.fontSize.xs,
    fontWeight: DesignSystem.typography.fontWeight.normal,
    lineHeight: DesignSystem.typography.fontSize.xs * DesignSystem.typography.lineHeight.normal,
    color: DesignSystem.colors.text.secondary,
  },
  
  // Button Text
  button: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.semibold,
    lineHeight: DesignSystem.typography.fontSize.sm * DesignSystem.typography.lineHeight.normal,
  },
  
  // Link Text
  link: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: DesignSystem.typography.fontWeight.medium,
    lineHeight: DesignSystem.typography.fontSize.sm * DesignSystem.typography.lineHeight.normal,
    color: DesignSystem.colors.primary[500],
    textDecorationLine: 'underline',
  },
});

// Common Component Styles
export const ComponentStyles = StyleSheet.create({
  // Card Styles
  card: {
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: DesignSystem.borderRadius.lg,
    ...DesignSystem.shadows.md,
  },
  
  cardElevated: {
    backgroundColor: DesignSystem.colors.background.primary,
    borderRadius: DesignSystem.borderRadius.lg,
    ...DesignSystem.shadows.lg,
  },
  
  // Button Styles
  buttonPrimary: {
    backgroundColor: DesignSystem.colors.primary[600],
    borderRadius: DesignSystem.borderRadius.md,
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.lg,
    ...DesignSystem.shadows.sm,
  },
  
  buttonSecondary: {
    backgroundColor: DesignSystem.colors.secondary[500],
    borderRadius: DesignSystem.borderRadius.md,
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.lg,
    ...DesignSystem.shadows.sm,
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: DesignSystem.colors.primary[600],
    borderRadius: DesignSystem.borderRadius.md,
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.lg,
  },
  
  // Input Styles
  input: {
    backgroundColor: DesignSystem.colors.background.surface,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border.medium,
    borderRadius: DesignSystem.borderRadius.md,
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.md,
    fontSize: DesignSystem.typography.fontSize.base,
    color: DesignSystem.colors.text.primary,
  },
  
  inputFocused: {
    borderColor: DesignSystem.colors.border.focus,
    ...DesignSystem.shadows.sm,
  },
  
  inputError: {
    borderColor: DesignSystem.colors.error,
  },
  
  // Badge Styles
  badge: {
    paddingVertical: DesignSystem.spacing.xs,
    paddingHorizontal: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.full,
    alignSelf: 'flex-start',
  },
  
  badgePrimary: {
    backgroundColor: DesignSystem.colors.primary[600],
  },
  
  badgeSecondary: {
    backgroundColor: DesignSystem.colors.secondary[500],
  },
  
  badgeSuccess: {
    backgroundColor: DesignSystem.colors.success,
  },
  
  badgeWarning: {
    backgroundColor: DesignSystem.colors.warning,
  },
  
  badgeError: {
    backgroundColor: DesignSystem.colors.error,
  },
});

// Utility Styles
export const UtilityStyles = StyleSheet.create({
  // Display
  hidden: { display: 'none' },
  visible: { display: 'flex' },
  
  // Position
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  
  // Overflow
  overflowHidden: { overflow: 'hidden' },
  overflowVisible: { overflow: 'visible' },
  
  // Border
  border: { borderWidth: 1, borderColor: DesignSystem.colors.border.light },
  borderTop: { borderTopWidth: 1, borderTopColor: DesignSystem.colors.border.light },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: DesignSystem.colors.border.light },
  borderLeft: { borderLeftWidth: 1, borderLeftColor: DesignSystem.colors.border.light },
  borderRight: { borderRightWidth: 1, borderRightColor: DesignSystem.colors.border.light },
  
  // Rounded Corners
  rounded: { borderRadius: DesignSystem.borderRadius.md },
  roundedFull: { borderRadius: DesignSystem.borderRadius.full },
  
  // Shadow
  shadow: DesignSystem.shadows.sm,
  shadowMd: DesignSystem.shadows.md,
  shadowLg: DesignSystem.shadows.lg,
  
  // Opacity
  opacity50: { opacity: 0.5 },
  opacity75: { opacity: 0.75 },
  opacity100: { opacity: 1 },
});

// Export all styles for easy access
export const GlobalStyles = {
  layout: LayoutStyles,
  spacing: SpacingStyles,
  typography: TypographyStyles,
  components: ComponentStyles,
  utilities: UtilityStyles,
};
