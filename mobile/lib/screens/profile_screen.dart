import 'package:flutter/material.dart';
import '../core/services/auth_service.dart';
import '../widgets/custom_card.dart';
import '../main.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback onNavigateToRegister;
  final VoidCallback onNavigateToAdminApp;
  final VoidCallback onToggleTheme;
  final bool isDarkMode;

  const ProfileScreen({
    super.key,
    required this.onNavigateToRegister,
    required this.onNavigateToAdminApp,
    required this.onToggleTheme,
    required this.isDarkMode,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Map<String, dynamic>? _user;

  @override
  void initState() {
    super.initState();
    _user = AuthService().currentUser;
  }

  void _handleLogout() async {
    await AuthService().logout();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const MainAppWrapper()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final userName = _user?['full_name'] ?? "Kullanıcı";
    final userEmail = _user?['email'] ?? "info@aptai.com";
    final roleRaw = _user?['role'] ?? "resident";
    String userRole = "Sakin";
    if (roleRaw == "admin") {
      userRole = "Yönetici";
    } else if (roleRaw == "pending_admin") {
      userRole = "Onay Bekleyen Yönetici";
    }
    final siteName = _user?['site']?['name'] ?? "Siteniz";

    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 64,
        automaticallyImplyLeading: false,
        backgroundColor: isDark
            ? theme.colorScheme.surface
            : theme.colorScheme.surfaceContainerLowest,
        elevation: 0,
        shape: Border(bottom: BorderSide(color: theme.colorScheme.outlineVariant)),
        title: Text(
          "Profil",
          style: theme.textTheme.headlineLarge?.copyWith(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // User Detail Box
            CustomCard(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: theme.colorScheme.outlineVariant, width: 2),
                      image: const DecorationImage(
                        image: NetworkImage(
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuAKseNHzi8C3uDkajEVaJVmtuWOz6YGy-dmp0Gdt2sr2u0yUvM2s9DhbiHFsudvrlDfyPPgJHpO_rBWuGa6OMb8HZjuY0mLQJc0tZZ4aptGPy4H_XQaDwcT3Xbe8xhUNtrhDBYOkiOMRYDXaqV4lG2tFXOUYiJpq-Iehn3MaVkgNobITQr1fXIg3nZgvAOGVnc7kjpyKWSxpZdE1wrUbJeezKJ0DZj7DNbwC51ZuBldnp4gsnBwN5zIjhd9gHa1AIFLdqNTV8cVi4N7",
                        ),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          userName,
                          style: theme.textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          "$siteName - ${userRole.toUpperCase()}",
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                            fontSize: 14,
                          ),
                        ),
                        Text(
                          userEmail,
                          style: theme.textTheme.labelSmall,
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Settings options
            CustomCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                   SwitchListTile(
                    title: const Text("Koyu Tema"),
                    subtitle: const Text("Renk temasını değiştirin"),
                    value: widget.isDarkMode,
                    onChanged: (val) => widget.onToggleTheme(),
                    secondary: const Icon(Icons.palette),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.admin_panel_settings),
                    title: const Text("Yönetici Erişim Başvurusu"),
                    subtitle: const Text("Apartman / Site yöneticisi başvurusu yapın"),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: widget.onNavigateToAdminApp,
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.person_add),
                    title: const Text("Sakin Kayıt Paneli"),
                    subtitle: const Text("Kayıt akışı demo sayfasını açın"),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: widget.onNavigateToRegister,
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.logout, color: Colors.red),
                    title: const Text("Çıkış Yap", style: TextStyle(color: Colors.red)),
                    onTap: _handleLogout,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              "APT.AI Mobil sürüm 1.0.0",
              style: theme.textTheme.labelSmall,
            )
          ],
        ),
      ),
    );
  }
}
