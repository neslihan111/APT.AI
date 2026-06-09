import 'package:flutter/material.dart';
import '../core/services/api_service.dart';
import '../core/services/auth_service.dart';
import '../widgets/custom_card.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_text_field.dart';

class RequestsScreen extends StatefulWidget {
  const RequestsScreen({super.key});

  @override
  State<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends State<RequestsScreen> {
  List<dynamic> _complaints = [];
  bool _isLoading = true;
  String? _errorMessage;
  bool _isAdmin = false;

  @override
  void initState() {
    super.initState();
    _isAdmin = AuthService().currentUser?['role'] == 'admin';
    _loadComplaints();
  }

  Future<void> _loadComplaints() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final data = _isAdmin
          ? await ApiService().getAllComplaints()
          : await ApiService().getMyComplaints();
      setState(() {
        _complaints = data;
      });
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

  void _showNewRequestDialog() {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    final formKey = GlobalKey<FormState>();
    bool isSubmitting = false;

    showDialog(
      context: context,
      builder: (context) {
        final theme = Theme.of(context);
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: Text("Yeni Bakım Talebi", style: theme.textTheme.headlineMedium),
              content: Form(
                key: formKey,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CustomTextField(
                        label: "Talep Başlığı",
                        placeholder: "Örn: Mutfak Musluğu Sızıntısı",
                        prefixIcon: Icons.title,
                        controller: titleController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return "Lütfen bir başlık girin";
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      Text(
                        "Açıklama",
                        style: theme.textTheme.labelMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: descriptionController,
                        maxLines: 3,
                        decoration: InputDecoration(
                          hintText: "Sorunu detaylı olarak açıklayın...",
                          filled: true,
                          fillColor: theme.colorScheme.surfaceContainerLow,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: theme.colorScheme.outlineVariant),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text("İptal"),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: isSubmitting
                      ? null
                      : () async {
                          if (formKey.currentState!.validate()) {
                            setDialogState(() {
                              isSubmitting = true;
                            });
                            try {
                              await ApiService().createComplaint(
                                titleController.text,
                                descriptionController.text,
                              );
                              if (context.mounted) {
                                Navigator.of(context).pop();
                                _loadComplaints();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text("Talep başarıyla gönderildi.")),
                                );
                              }
                            } catch (err) {
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text("Gönderim başarısız: $err")),
                                );
                              }
                            } finally {
                              setDialogState(() {
                                isSubmitting = false;
                              });
                            }
                          }
                        },
                  child: isSubmitting
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text("Gönder"),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _updateStatus(int id, String currentStatus) {
    final theme = Theme.of(context);
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("Durumu Güncelle", style: theme.textTheme.headlineMedium),
              const SizedBox(height: 16),
              ListTile(
                title: const Text("Beklemede"),
                leading: const Icon(Icons.hourglass_empty),
                onTap: () => _changeStatus(id, "pending"),
              ),
              ListTile(
                title: const Text("İşlemde"),
                leading: const Icon(Icons.engineering),
                onTap: () => _changeStatus(id, "in_progress"),
              ),
              ListTile(
                title: const Text("Çözüldü"),
                leading: const Icon(Icons.check_circle_outline, color: Colors.green),
                onTap: () => _changeStatus(id, "resolved"),
              ),
            ],
          ),
        );
      },
    );
  }

  void _changeStatus(int id, String newStatus) async {
    Navigator.of(context).pop();
    setState(() {
      _isLoading = true;
    });

    try {
      await ApiService().updateComplaintStatus(id, newStatus);
      _loadComplaints();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Durum $newStatus olarak güncellendi")),
        );
      }
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Durum güncellenemedi: $err")),
        );
      }
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
        automaticallyImplyLeading: false,
        backgroundColor: isDark
            ? theme.colorScheme.surface
            : theme.colorScheme.surfaceContainerLowest,
        elevation: 0,
        shape: Border(bottom: BorderSide(color: theme.colorScheme.outlineVariant)),
        title: Text(
          _isAdmin ? "Şikayet Kuyruğu" : "Taleplerim",
          style: theme.textTheme.headlineLarge?.copyWith(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadComplaints,
          )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(child: Text("Hata: $_errorMessage"))
              : RefreshIndicator(
                  onRefresh: _loadComplaints,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16.0),
                    itemCount: _complaints.length + (_isAdmin ? 0 : 1),
                    itemBuilder: (context, index) {
                      if (index == _complaints.length) {
                        return Padding(
                          padding: const EdgeInsets.only(top: 16.0),
                          child: CustomButton(
                            text: "Yeni Bakım Talebi",
                            icon: Icons.add,
                            onPressed: _showNewRequestDialog,
                          ),
                        );
                      }

                      final complaint = _complaints[index];
                      final id = complaint['id'];
                      final status = complaint['status'] ?? 'pending';

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12.0),
                        child: CustomCard(
                          padding: const EdgeInsets.all(16),
                          onTap: _isAdmin ? () => _updateStatus(id, status) : null,
                          child: Row(
                            children: [
                              Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.secondaryContainer,
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  Icons.build,
                                  color: theme.colorScheme.onSecondaryContainer,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      complaint['title'] ?? '',
                                      style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        Container(
                                          width: 8,
                                          height: 8,
                                          decoration: BoxDecoration(
                                            color: status == "resolved"
                                                ? theme.colorScheme.tertiary
                                                : theme.colorScheme.error,
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          status == "pending"
                                              ? "Beklemede"
                                              : (status == "in_progress" ? "İşlemde" : "Çözüldü"),
                                          style: theme.textTheme.labelSmall?.copyWith(
                                            color: status == "resolved"
                                                ? theme.colorScheme.tertiary
                                                : theme.colorScheme.error,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              if (complaint['priority'] != null)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: complaint['priority'] == 'high'
                                        ? theme.colorScheme.errorContainer
                                        : theme.colorScheme.secondaryContainer,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    complaint['priority'].toString().toUpperCase(),
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: complaint['priority'] == 'high'
                                          ? theme.colorScheme.onErrorContainer
                                          : theme.colorScheme.onSecondaryContainer,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
