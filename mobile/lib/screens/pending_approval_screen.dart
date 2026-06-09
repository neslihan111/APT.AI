import 'package:flutter/material.dart';
import '../core/services/auth_service.dart';
import '../widgets/custom_button.dart';
import '../main.dart';

class PendingApprovalScreen extends StatefulWidget {
  const PendingApprovalScreen({super.key});

  @override
  State<PendingApprovalScreen> createState() => _PendingApprovalScreenState();
}

class _PendingApprovalScreenState extends State<PendingApprovalScreen> {
  bool _isLoading = false;

  void _checkStatus() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final updated = await AuthService().fetchProfile();
      if (updated) {
        final role = AuthService().currentUser?['role'];
        if (role == 'admin') {
          if (!mounted) return;
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const MainAppWrapper()),
            (route) => false,
          );
          return;
        }
      }
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Başvuru durumu: Hâlâ onay bekliyor.")),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Durum alınırken hata oluştu: $e")),
        );
      }
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _logout() async {
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

    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Vector or Icon representing pending state
              Container(
                width: 140,
                height: 140,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.hourglass_empty,
                  size: 64,
                  color: theme.colorScheme.primary,
                ),
              ),
              const SizedBox(height: 32),
              Text(
                "Başvuru Onay Bekliyor",
                style: theme.textTheme.headlineLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                "Kayıt olduğunuz için teşekkür ederiz. Tüm yönetici hesapları, site sahibi tarafından manuel doğrulama gerektirir. Bu işlem genellikle 24-48 iş saati sürer.",
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              CustomButton(
                text: "Durumu Güncelle",
                icon: Icons.refresh,
                isLoading: _isLoading,
                onPressed: _checkStatus,
              ),
              const SizedBox(height: 12),
              CustomButton(
                text: "Çıkış Yap",
                icon: Icons.logout,
                isPrimary: false,
                onPressed: _logout,
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: _logout,
                child: Text(
                  "Giriş ekranına dön",
                  style: TextStyle(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
