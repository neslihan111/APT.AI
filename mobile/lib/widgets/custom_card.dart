import 'package:flutter/material.dart';

class CustomCard extends StatelessWidget {
  final Widget child;
  final Color? backgroundColor;
  final BorderSide? borderSide;
  final double? borderRadius;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;

  const CustomCard({
    super.key,
    required this.child,
    this.backgroundColor,
    this.borderSide,
    this.borderRadius,
    this.padding,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final finalBorderRadius = borderRadius ?? 12.0;
    
    Widget cardContent = Container(
      padding: padding ?? const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: backgroundColor ?? theme.cardTheme.color ?? theme.colorScheme.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(finalBorderRadius),
        border: Border.fromBorderSide(
          borderSide ??
              (theme.cardTheme.shape is RoundedRectangleBorder
                  ? (theme.cardTheme.shape as RoundedRectangleBorder).side
                  : BorderSide(color: theme.colorScheme.outlineVariant, width: 1)),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color.fromRGBO(0, 0, 0, 0.05),
            blurRadius: 3,
            offset: Offset(0, 1),
          )
        ],
      ),
      child: child,
    );

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(finalBorderRadius),
        child: cardContent,
      );
    }

    return cardContent;
  }
}
