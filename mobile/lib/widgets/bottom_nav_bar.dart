import 'package:flutter/material.dart';

class CustomBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const CustomBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final backgroundColor = isDark
        ? theme.colorScheme.surface
        : theme.colorScheme.surfaceContainerLowest;

    return Container(
      height: 80,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(12),
          topRight: Radius.circular(12),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color.fromRGBO(15, 23, 42, 0.05),
            blurRadius: 12,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(
            context: context,
            index: 0,
            icon: Icons.dashboard,
            filledIcon: Icons.dashboard,
            label: "Ana Sayfa",
          ),
          _buildNavItem(
            context: context,
            index: 1,
            icon: Icons.assignment_outlined,
            filledIcon: Icons.assignment,
            label: "Şikayetler",
          ),
          _buildNavItem(
            context: context,
            index: 2,
            icon: Icons.notifications_outlined,
            filledIcon: Icons.notifications,
            label: "Duyurular",
            hasBadge: true,
          ),
          _buildNavItem(
            context: context,
            index: 3,
            icon: Icons.person_outline,
            filledIcon: Icons.person,
            label: "Profil",
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required BuildContext context,
    required int index,
    required IconData icon,
    required IconData filledIcon,
    required String label,
    bool hasBadge = false,
  }) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final isActive = currentIndex == index;

    final activeBg = isDark
        ? theme.colorScheme.primaryContainer
        : theme.colorScheme.secondaryContainer;

    final activeFg = isDark
        ? theme.colorScheme.onPrimaryContainer
        : theme.colorScheme.onSecondaryContainer;

    final inactiveFg = theme.colorScheme.onSurfaceVariant;

    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? activeBg : Colors.transparent,
          borderRadius: BorderRadius.circular(24),
        ),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  isActive ? filledIcon : icon,
                  color: isActive ? activeFg : inactiveFg,
                  size: 24,
                ),
                const SizedBox(height: 2),
                Text(
                  label,
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: isActive ? activeFg : inactiveFg,
                    fontSize: 12,
                    fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                  ),
                ),
              ],
            ),
            if (hasBadge)
              Positioned(
                top: 2,
                right: 14,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.error,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
