import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'widgets/bottom_nav_bar.dart';
import 'core/services/auth_service.dart';
import 'screens/login_screen.dart';
import 'screens/pending_approval_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/admin_dashboard_screen.dart';
import 'screens/requests_screen.dart';
import 'screens/alerts_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/registration_screen.dart';
import 'screens/admin_application_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool _isDarkMode = false;

  void _toggleTheme() {
    setState(() {
      _isDarkMode = !_isDarkMode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'APT.AI Mobile',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: MainAppWrapper(
        isDarkMode: _isDarkMode,
        onToggleTheme: _toggleTheme,
      ),
      routes: {
        '/login': (context) => const LoginScreen(),
        '/register': (context) => RegistrationScreen(
              onRegistrationSuccess: () => Navigator.of(context).pushReplacementNamed('/login'),
              onNavigateToLogin: () => Navigator.of(context).pushReplacementNamed('/login'),
            ),
        '/apply-admin': (context) => AdminApplicationScreen(
              onSubmitSuccess: () => Navigator.of(context).pushReplacementNamed('/login'),
            ),
      },
    );
  }
}

class MainAppWrapper extends StatelessWidget {
  final bool isDarkMode;
  final VoidCallback? onToggleTheme;

  const MainAppWrapper({
    super.key,
    this.isDarkMode = false,
    this.onToggleTheme,
  });

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: AuthService().isAuthenticated(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final isAuthenticated = snapshot.data ?? false;
        if (!isAuthenticated) {
          return const LoginScreen();
        }

        final role = AuthService().currentUser?['role'];
        if (role == 'pending_admin') {
          return const PendingApprovalScreen();
        }

        // Return shell with specific dashboard view
        return MainShell(
          role: role ?? 'resident',
          isDarkMode: isDarkMode,
          onToggleTheme: onToggleTheme ?? () {},
        );
      },
    );
  }
}

class MainShell extends StatefulWidget {
  final String role;
  final bool isDarkMode;
  final VoidCallback onToggleTheme;

  const MainShell({
    super.key,
    required this.role,
    required this.isDarkMode,
    required this.onToggleTheme,
  });

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;
  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    final isAdmin = widget.role == 'admin';

    _screens = [
      isAdmin
          ? AdminDashboardScreen(
              onNavigateToRequests: () {
                setState(() {
                  _currentIndex = 1;
                });
              },
              onNavigateToAlerts: () {
                setState(() {
                  _currentIndex = 2;
                });
              },
            )
          : DashboardScreen(
              onNavigateToRequests: () {
                setState(() {
                  _currentIndex = 1;
                });
              },
              onNavigateToAlerts: () {
                setState(() {
                  _currentIndex = 2;
                });
              },
            ),
      const RequestsScreen(),
      const AlertsScreen(),
      ProfileScreen(
        isDarkMode: widget.isDarkMode,
        onToggleTheme: widget.onToggleTheme,
        onNavigateToRegister: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => RegistrationScreen(
                onRegistrationSuccess: () => Navigator.of(context).pop(),
                onNavigateToLogin: () => Navigator.of(context).pop(),
              ),
            ),
          );
        },
        onNavigateToAdminApp: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => AdminApplicationScreen(
                onSubmitSuccess: () => Navigator.of(context).pop(),
              ),
            ),
          );
        },
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
