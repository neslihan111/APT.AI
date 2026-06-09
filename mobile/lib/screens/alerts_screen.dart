import 'package:flutter/material.dart';
import '../core/services/api_service.dart';
import '../core/services/auth_service.dart';
import '../widgets/custom_card.dart';
import '../widgets/custom_text_field.dart';

class AlertsScreen extends StatefulWidget {
  const AlertsScreen({super.key});

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  List<dynamic> _announcements = [];
  bool _isLoading = true;
  String? _errorMessage;
  bool _isAdmin = false;

  @override
  void initState() {
    super.initState();
    _isAdmin = AuthService().currentUser?['role'] == 'admin';
    _loadAnnouncements();
  }

  Future<void> _loadAnnouncements() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final data = await ApiService().getAnnouncements();
      setState(() {
        _announcements = data;
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

  void _showNewAnnouncementDialog() {
    final titleController = TextEditingController();
    final contentController = TextEditingController();
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
              title: Text("Duyuru Oluştur", style: theme.textTheme.headlineMedium),
              content: Form(
                key: formKey,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CustomTextField(
                        label: "Başlık",
                        placeholder: "Örn: Asansör Bakımı",
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
                      TextFormField(
                        controller: contentController,
                        maxLines: 4,
                        decoration: InputDecoration(
                          hintText: "Duyuru içeriğini girin...",
                          filled: true,
                          fillColor: theme.colorScheme.surfaceContainerLow,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: theme.colorScheme.outlineVariant),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return "Lütfen içerik girin";
                          }
                          return null;
                        },
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
                              await ApiService().createAnnouncement(
                                titleController.text,
                                contentController.text,
                              );
                              if (context.mounted) {
                                Navigator.of(context).pop();
                                _loadAnnouncements();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text("Duyuru oluşturuldu.")),
                                );
                              }
                            } catch (err) {
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text("Paylaşım başarısız oldu: $err")),
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
                      : const Text("Yayınla"),
                ),
              ],
            );
          },
        );
      },
    );
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
          "Duyurular & İlanlar",
          style: theme.textTheme.headlineLarge?.copyWith(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          if (_isAdmin)
            IconButton(
              icon: const Icon(Icons.add_comment),
              tooltip: "Duyuru Paylaş",
              onPressed: _showNewAnnouncementDialog,
            ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadAnnouncements,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(child: Text("Hata: $_errorMessage"))
              : RefreshIndicator(
                  onRefresh: _loadAnnouncements,
                  child: _announcements.isEmpty
                      ? const Center(child: Text("Henüz bir duyuru yayınlanmamış."))
                      : ListView.builder(
                          padding: const EdgeInsets.all(16.0),
                          itemCount: _announcements.length,
                          itemBuilder: (context, index) {
                            final ann = _announcements[index];
                            final hasAiSummary = ann['summary'] != null;

                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12.0),
                              child: CustomCard(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        CircleAvatar(
                                          backgroundColor: theme.colorScheme.secondaryContainer,
                                          child: Icon(
                                            Icons.campaign,
                                            color: theme.colorScheme.onSecondaryContainer,
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                ann['title'] ?? '',
                                                style: theme.textTheme.headlineMedium?.copyWith(
                                                  fontSize: 16,
                                                  color: theme.colorScheme.onSurface,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                "Duyuru",
                                                style: theme.textTheme.labelSmall,
                                              ),
                                            ],
                                          ),
                                        )
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      ann['content'] ?? '',
                                      style: theme.textTheme.bodyLarge?.copyWith(fontSize: 14, height: 1.4),
                                    ),
                                    if (hasAiSummary) ...[
                                      const SizedBox(height: 12),
                                      Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: theme.colorScheme.primary.withOpacity(0.05),
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(color: theme.colorScheme.primary.withOpacity(0.1)),
                                        ),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                Icon(Icons.auto_awesome, color: theme.colorScheme.primary, size: 14),
                                                const SizedBox(width: 6),
                                                Text(
                                                  "APT.AI Özeti",
                                                  style: TextStyle(
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.bold,
                                                    color: theme.colorScheme.primary,
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              ann['summary'] ?? '',
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontStyle: FontStyle.italic,
                                                color: theme.colorScheme.onSurface.withOpacity(0.8),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
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
