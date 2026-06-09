import 'package:flutter/material.dart';
import '../core/services/auth_service.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_text_field.dart';

class RegistrationScreen extends StatefulWidget {
  final VoidCallback onRegistrationSuccess;
  final VoidCallback onNavigateToLogin;

  const RegistrationScreen({
    super.key,
    required this.onRegistrationSuccess,
    required this.onNavigateToLogin,
  });

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _inviteController = TextEditingController();
  final _phoneController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;

  // Invite code validation state
  bool _isInviteValidated = false;
  String? _validatedSiteName;

  List<dynamic> _buildings = [];
  int? _selectedBuildingId;

  List<dynamic> _apartments = [];
  int? _selectedApartmentId;

  void _validateInvite() async {
    final code = _inviteController.text.trim();
    if (code.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Davet kodu 6 haneli olmalıdır.")),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final res = await AuthService().validateInviteCode(code);
      if (res['valid'] == true) {
        final siteId = res['site_id'];
        final buildingsList = await AuthService().getBuildings(siteId);

        setState(() {
          _isInviteValidated = true;
          _validatedSiteName = res['site_name'];
          _buildings = buildingsList;
          _selectedBuildingId = null;
          _selectedApartmentId = null;
        });
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

  void _onBuildingChanged(int? buildingId) async {
    if (buildingId == null) return;
    setState(() {
      _selectedBuildingId = buildingId;
      _selectedApartmentId = null;
      _apartments = [];
      _isLoading = true;
    });

    try {
      final list = await AuthService().getApartments(buildingId);
      setState(() {
        _apartments = list;
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Apartmanlar yüklenirken hata: $e")),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_isInviteValidated) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Lütfen önce geçerli bir davet kodu doğrulayın.")),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final success = await AuthService().register(
        registerType: "resident",
        fullName: _nameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
        siteCode: _inviteController.text.trim(),
        buildingId: _selectedBuildingId,
        apartmentId: _selectedApartmentId,
        phone: _phoneController.text.trim(),
      );

      if (success) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Kayıt başarılı! Şimdi giriş yapabilirsiniz.")),
        );
        widget.onRegistrationSuccess();
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
              "APT.AI Kayıt",
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
              constraints: const BoxConstraints(maxWidth: 400),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      "Hesap Oluştur",
                      style: theme.textTheme.headlineLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Evinize hoş geldiniz. Apartman sakini olarak kaydolmak için bilgilerinizi girin.",
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

                    // Invite Code Container First
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.secondaryContainer.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: theme.colorScheme.secondaryContainer),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.key, color: theme.colorScheme.primary, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                "Davet Kodu Doğrulama",
                                style: theme.textTheme.headlineMedium?.copyWith(fontSize: 16),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "Yöneticinizden aldığınız 6 haneli davet kodunu girin.",
                            style: theme.textTheme.labelSmall?.copyWith(
                              color: theme.colorScheme.onSecondaryContainer,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: CustomTextField(
                                  label: "",
                                  placeholder: "KOD",
                                  prefixIcon: Icons.vpn_key_outlined,
                                  controller: _inviteController,
                                  maxLength: 6,
                                ),
                              ),
                              const SizedBox(width: 12),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: theme.colorScheme.primary,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                onPressed: _validateInvite,
                                child: const Text("Doğrula"),
                              )
                            ],
                          ),
                          if (_isInviteValidated) ...[
                            const SizedBox(height: 12),
                            Text(
                              "Site Doğrulandı: $_validatedSiteName",
                              style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                            ),
                          ]
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    if (_isInviteValidated) ...[
                      // Building Selection Dropdown
                      DropdownButtonFormField<int>(
                        value: _selectedBuildingId,
                        hint: const Text("Bina / Blok Seçin"),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: theme.colorScheme.surfaceContainerLow,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        items: _buildings.map((b) {
                          return DropdownMenuItem<int>(
                            value: b['id'],
                            child: Text(b['name']),
                          );
                        }).toList(),
                        onChanged: _onBuildingChanged,
                      ),
                      const SizedBox(height: 16),

                      // Apartment Selection Dropdown
                      DropdownButtonFormField<int>(
                        value: _selectedApartmentId,
                        hint: const Text("Daire Seçin"),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: theme.colorScheme.surfaceContainerLow,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        items: _apartments.map((a) {
                          return DropdownMenuItem<int>(
                            value: a['id'],
                            child: Text("Daire ${a['apartment_number']} (Kat ${a['floor']})"),
                          );
                        }).toList(),
                        onChanged: (val) {
                          setState(() {
                            _selectedApartmentId = val;
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                    ],

                    CustomTextField(
                      label: "Ad Soyad",
                      placeholder: "John Doe",
                      prefixIcon: Icons.person,
                      controller: _nameController,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return "Lütfen adınızı giriniz";
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    CustomTextField(
                      label: "E-posta Adresi",
                      placeholder: "isim@ornek.com",
                      prefixIcon: Icons.mail,
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return "Lütfen e-posta adresinizi giriniz";
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
                      label: "Şifre Oluştur",
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
                    const SizedBox(height: 16),

                    CustomTextField(
                      label: "Şifreyi Onayla",
                      placeholder: "••••••••",
                      prefixIcon: Icons.verified_user,
                      isPassword: true,
                      controller: _confirmPasswordController,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Lütfen şifreyi onaylayın";
                        }
                        if (value != _passwordController.text) {
                          return "Şifreler eşleşmiyor";
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),

                    CustomButton(
                      text: "Kaydol",
                      icon: Icons.arrow_forward,
                      isLoading: _isLoading,
                      onPressed: _handleRegister,
                      height: 56,
                    ),
                    const SizedBox(height: 24),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Zaten hesabınız var mı? ",
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            if (Navigator.of(context).canPop()) {
                              Navigator.of(context).pop();
                            } else {
                              Navigator.of(context).pushReplacementNamed('/login');
                            }
                          },
                          child: Text(
                            "Giriş ekranına dön",
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
