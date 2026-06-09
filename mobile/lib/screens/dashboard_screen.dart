import 'package:flutter/material.dart';
import '../core/services/api_service.dart';
import '../core/services/auth_service.dart';
import '../widgets/custom_card.dart';
import '../widgets/custom_button.dart';
import 'ai_chat_dialog.dart';

class DashboardScreen extends StatefulWidget {
  final VoidCallback onNavigateToRequests;
  final VoidCallback onNavigateToAlerts;

  const DashboardScreen({
    super.key,
    required this.onNavigateToRequests,
    required this.onNavigateToAlerts,
  });

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isLoading = true;
  String? _errorMessage;
  List<dynamic> _dues = [];
  List<dynamic> _complaints = [];
  List<dynamic> _announcements = [];
  String _userName = "Arthur";

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final user = AuthService().currentUser;
      if (user != null) {
        _userName = user['full_name'] ?? "Arthur";
      }

      final myDues = await ApiService().getMyDues();
      final myComplaints = await ApiService().getMyComplaints();
      final allAnnouncements = await ApiService().getAnnouncements();

      setState(() {
        _dues = myDues;
        _complaints = myComplaints;
        _announcements = allAnnouncements;
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

  void _showAIChat(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const AIChatDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // Resolve current active due
    dynamic activeDue;
    if (_dues.isNotEmpty) {
      activeDue = _dues.firstWhere((element) => element['status'] == 'pending', orElse: () => null);
      activeDue ??= _dues.first;
    }

    // Resolve active complaint
    dynamic activeComplaint;
    if (_complaints.isNotEmpty) {
      activeComplaint = _complaints.first;
    }

    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 64,
        automaticallyImplyLeading: false,
        backgroundColor: isDark
            ? theme.colorScheme.surface
            : theme.colorScheme.surfaceContainerLowest,
        elevation: 0,
        shape: Border(bottom: BorderSide(color: theme.colorScheme.outlineVariant)),
        title: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: theme.colorScheme.outlineVariant),
                image: const DecorationImage(
                  image: NetworkImage(
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAKseNHzi8C3uDkajEVaJVmtuWOz6YGy-dmp0Gdt2sr2u0yUvM2s9DhbiHFsudvrlDfyPPgJHpO_rBWuGa6OMb8HZjuY0mLQJc0tZZ4aptGPy4H_XQaDwcT3Xbe8xhUNtrhDBYOkiOMRYDXaqV4lG2tFXOUYiJpq-Iehn3MaVkgNobITQr1fXIg3nZgvAOGVnc7kjpyKWSxpZdE1wrUbJeezKJ0DZj7DNbwC51ZuBldnp4gsnBwN5zIjhd9gHa1AIFLdqNTV8cVi4N7",
                  ),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              "APT.AI",
              style: theme.textTheme.headlineLarge?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.smart_toy, color: theme.colorScheme.primary),
            tooltip: "Ask APT.AI",
            onPressed: () => _showAIChat(context),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(child: Text("Veriler yüklenirken hata: $_errorMessage"))
              : RefreshIndicator(
                  onRefresh: _loadDashboardData,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Welcome Section
                          Text(
                            "Merhaba, $_userName",
                            style: theme.textTheme.headlineLarge,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "Bugün apartmanınızda olan her şey burada.",
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                          const SizedBox(height: 24),

                          // Current Dues Card
                          if (activeDue != null) ...[
                            CustomCard(
                              padding: const EdgeInsets.all(24),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        "GÜNCEL AİDAT",
                                        style: theme.textTheme.labelSmall?.copyWith(
                                          letterSpacing: 1.5,
                                          fontWeight: FontWeight.bold,
                                          color: theme.colorScheme.onSurfaceVariant,
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: activeDue['status'] == 'pending'
                                              ? theme.colorScheme.errorContainer
                                              : theme.colorScheme.tertiaryContainer,
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          activeDue['status'] == 'pending' ? "Ödenmemiş" : "Ödendi",
                                          style: theme.textTheme.labelSmall?.copyWith(
                                            color: activeDue['status'] == 'pending'
                                                ? theme.colorScheme.onErrorContainer
                                                : theme.colorScheme.onTertiaryContainer,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.baseline,
                                    textBaseline: TextBaseline.alphabetic,
                                    children: [
                                      Text(
                                        "\$${activeDue['amount']}",
                                        style: theme.textTheme.headlineLarge?.copyWith(
                                          fontSize: 36,
                                          fontWeight: FontWeight.w900,
                                        ),
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        "/ ${activeDue['due_date'].toString().split('-')[1]}",
                                        style: theme.textTheme.bodyLarge?.copyWith(
                                          color: theme.colorScheme.onSurfaceVariant,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 20),
                                  if (activeDue['status'] == 'pending')
                                    CustomButton(
                                      text: "Aidat Öde",
                                      icon: Icons.payments,
                                      onPressed: () {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(content: Text("Ödeme sayfasına yönlendiriliyorsunuz...")),
                                        );
                                      },
                                    ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 24),
                          ],

                          // Active Requests Section
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "Taleplerim",
                                style: theme.textTheme.headlineMedium,
                              ),
                              TextButton(
                                onPressed: widget.onNavigateToRequests,
                                child: const Text("Tümünü Gör"),
                              )
                            ],
                          ),
                          const SizedBox(height: 12),
                          if (activeComplaint != null) ...[
                            CustomCard(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              onTap: widget.onNavigateToRequests,
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
                                          activeComplaint['title'] ?? 'Request',
                                          style: theme.textTheme.headlineMedium?.copyWith(fontSize: 16),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          (activeComplaint['priority'] ?? 'normal').toString().toUpperCase(),
                                          style: theme.textTheme.labelSmall,
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: activeComplaint['status'] == 'resolved'
                                          ? theme.colorScheme.tertiaryContainer
                                          : theme.colorScheme.errorContainer,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      activeComplaint['status'] == 'resolved'
                                          ? "ÇÖZÜLDÜ"
                                          : (activeComplaint['status'] == 'in_progress' ? "İŞLEMDE" : "BEKLEMEDE"),
                                      style: TextStyle(
                                        color: activeComplaint['status'] == 'resolved'
                                            ? theme.colorScheme.onTertiaryContainer
                                            : theme.colorScheme.onErrorContainer,
                                        fontWeight: FontWeight.w600,
                                        fontSize: 11,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ] else ...[
                            const Text("Aktif bakım talebi bulunamadı."),
                          ],
                          const SizedBox(height: 12),
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              minimumSize: const Size.fromHeight(48),
                              side: BorderSide(
                                color: theme.colorScheme.outlineVariant,
                                style: BorderStyle.solid,
                                width: 1,
                              ),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(6)),
                            ),
                            icon: Icon(Icons.add, color: theme.colorScheme.onSurface),
                            label: Text(
                              "Yeni Bakım Talebi",
                              style: TextStyle(color: theme.colorScheme.onSurface, fontWeight: FontWeight.w500),
                            ),
                            onPressed: widget.onNavigateToRequests,
                          ),
                          const SizedBox(height: 24),

                          // Recent Announcements Section
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "Son Duyurular",
                                style: theme.textTheme.headlineMedium,
                              ),
                              TextButton(
                                onPressed: widget.onNavigateToAlerts,
                                child: const Text("Tümünü Gör"),
                              )
                            ],
                          ),
                          const SizedBox(height: 12),
                          if (_announcements.isEmpty)
                            const Text("Duyuru bulunamadı.")
                          else
                            Container(
                              decoration: BoxDecoration(
                                color: isDark
                                    ? theme.colorScheme.surfaceContainerLow
                                    : theme.colorScheme.surfaceContainerLowest,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: theme.colorScheme.outlineVariant),
                              ),
                              child: ListView.separated(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: _announcements.length > 2 ? 2 : _announcements.length,
                                separatorBuilder: (context, index) =>
                                    const Divider(height: 1, indent: 16, endIndent: 16),
                                itemBuilder: (context, index) {
                                  final ann = _announcements[index];
                                  return _buildAnnouncementItem(
                                    context: context,
                                    title: ann['title'] ?? '',
                                    subtitle: ann['content'] ?? '',
                                    time: "Duyuru",
                                  );
                                },
                              ),
                            ),
                          const SizedBox(height: 24),

                          // Ask AI Quick Banner
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.secondaryContainer,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  backgroundColor: theme.colorScheme.primary,
                                  child: const Icon(Icons.smart_toy, color: Colors.white),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "APT.AI'a Sor",
                                        style: theme.textTheme.headlineMedium?.copyWith(
                                          fontSize: 14,
                                          color: theme.colorScheme.onSecondaryContainer,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        "\"Misafir odasını nasıl rezerve ederim?\"",
                                        style: theme.textTheme.labelSmall?.copyWith(
                                          color: theme.colorScheme.onSecondaryContainer
                                              .withOpacity(0.8),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: theme.colorScheme.primaryContainer,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(24),
                                    ),
                                  ),
                                  onPressed: () => _showAIChat(context),
                                  child: const Text("Sor"),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],
                      ),
                    ),
                  ),
                ),
    );
  }

  Widget _buildAnnouncementItem({
    required BuildContext context,
    required String title,
    required String subtitle,
    required String time,
  }) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: theme.colorScheme.primary.withOpacity(0.1),
            ),
            child: Icon(Icons.campaign, color: theme.colorScheme.primary),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  time,
                  style: theme.textTheme.labelSmall,
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
