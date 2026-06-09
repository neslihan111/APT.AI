import 'package:flutter/material.dart';
import '../core/services/auth_service.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_text_field.dart';

class AdminApplicationScreen extends StatefulWidget {
  final VoidCallback onSubmitSuccess;

  const AdminApplicationScreen({
    super.key,
    required this.onSubmitSuccess,
  });

  @override
  State<AdminApplicationScreen> createState() => _AdminApplicationScreenState();
}

class _AdminApplicationScreenState extends State<AdminApplicationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _siteController = TextEditingController();
  final _cityController = TextEditingController();
  final _addressController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  void _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final success = await AuthService().register(
        registerType: "manager",
        fullName: _nameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
        phone: _phoneController.text.trim(),
        siteName: _siteController.text.trim(),
        city: _cityController.text.trim(),
        address: _addressController.text.trim(),
      );

      if (success) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Yönetici başvurunuz başarıyla alındı! Onay bekliyor.")),
        );
        widget.onSubmitSuccess();
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 64,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              Navigator.of(context).pushReplacementNamed('/login');
            }
          },
        ),
        backgroundColor: isDark
            ? theme.colorScheme.surface
            : theme.colorScheme.surfaceContainerLowest,
        elevation: 0,
        shape: Border(bottom: BorderSide(color: theme.colorScheme.outlineVariant)),
        title: Row(
          children: [
            Icon(Icons.apartment, color: theme.colorScheme.primary),
            const SizedBox(width: 8),
            Text(
              "APT.AI Yönetici",
              style: theme.textTheme.headlineLarge?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 600),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    "Yönetici Başvurusu",
                    style: theme.textTheme.headlineLarge,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Mülkünüz için yönetici erişimi talep etmek üzere aşağıdaki formu doldurun.",
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 24),

                  if (_errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.errorContainer,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: theme.colorScheme.error),
                      ),
                      child: Text(
                        _errorMessage!,
                        style: TextStyle(color: theme.colorScheme.onErrorContainer),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        CustomTextField(
                          label: "Ad Soyad",
                          placeholder: "Adınızı ve soyadınızı girin",
                          prefixIcon: Icons.person,
                          controller: _nameController,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return "Lütfen adınızı giriniz";
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        CustomTextField(
                          label: "E-posta",
                          placeholder: "is@eposta.com",
                          prefixIcon: Icons.email,
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return "Lütfen iş e-posta adresinizi giriniz";
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        CustomTextField(
                          label: "Telefon Numarası",
                          placeholder: "0555 000 0000",
                          prefixIcon: Icons.phone,
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                        ),
                        const SizedBox(height: 16),

                        CustomTextField(
                          label: "Site/Apartman Adı",
                          placeholder: "Örn: Yıldız Sitesi",
                          prefixIcon: Icons.domain,
                          controller: _siteController,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return "Lütfen site/apartman adını giriniz";
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        Row(
                          children: [
                            Expanded(
                              child: CustomTextField(
                                label: "Şehir",
                                placeholder: "Örn: İstanbul",
                                prefixIcon: Icons.location_city,
                                controller: _cityController,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return "Zorunlu";
                                  }
                                  return null;
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: CustomTextField(
                                label: "Adres",
                                placeholder: "Örn: Kadıköy",
                                prefixIcon: Icons.map,
                                controller: _addressController,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return "Zorunlu";
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        CustomTextField(
                          label: "Şifre",
                          placeholder: "••••••••",
                          prefixIcon: Icons.lock,
                          isPassword: true,
                          controller: _passwordController,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return "Lütfen şifre giriniz";
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        CustomButton(
                          text: "Başvuruyu Gönder",
                          icon: Icons.send,
                          isLoading: _isLoading,
                          onPressed: _handleSubmit,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Notice cards
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.08),
                      border: Border.all(color: Colors.blue.withOpacity(0.2)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.info, color: theme.colorScheme.primary, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              "Onay Bildirimi",
                              style: theme.textTheme.headlineMedium?.copyWith(
                                fontSize: 14,
                                color: theme.colorScheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "Tüm yönetici başvurularının site sahibi tarafından manuel onay sürecine tabi olduğunu lütfen unutmayın. Bu işlem genellikle 24-48 iş saati sürer. Durumunuz güncellendiğinde bir e-posta bildirimi alacaksınız.",
                          style: theme.textTheme.bodyLarge?.copyWith(fontSize: 13, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  Center(
                    child: TextButton(
                      onPressed: () {
                        if (Navigator.of(context).canPop()) {
                          Navigator.of(context).pop();
                        } else {
                          Navigator.of(context).pushReplacementNamed('/login');
                        }
                      },
                      child: Text(
                        "Giriş ekranına dön",
                        style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
