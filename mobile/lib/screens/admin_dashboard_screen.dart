import 'package:flutter/material.dart';
import '../core/services/api_service.dart';
import '../widgets/custom_card.dart';
import 'ai_chat_dialog.dart';

class AdminDashboardScreen extends StatefulWidget {
  final VoidCallback onNavigateToRequests;
  final VoidCallback onNavigateToAlerts;

  const AdminDashboardScreen({
    super.key,
    required this.onNavigateToRequests,
    required this.onNavigateToAlerts,
  });

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  Map<String, dynamic>? _stats;
  List<dynamic> _complaints = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadAdminData();
  }

  Future<void> _loadAdminData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final statsData = await ApiService().getAdminStats();
      final complaintsData = await ApiService().getAllComplaints();

      setState(() {
        _stats = statsData;
        _complaints = complaintsData;
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
            Icon(Icons.admin_panel_settings, color: theme.colorScheme.primary),
            const SizedBox(width: 8),
            Text(
              "APT.AI Admin",
              style: theme.textTheme.headlineLarge?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
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
              ? Center(child: Text("Hata: $_errorMessage"))
              : RefreshIndicator(
                  onRefresh: _loadAdminData,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Mülk Özeti",
                            style: theme.textTheme.headlineLarge,
                          ),
                          const SizedBox(height: 16),

                          // Bento grid style statistics cards
                          if (_stats != null) ...[
                            GridView.count(
                              crossAxisCount: 2,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              crossAxisSpacing: 12,
                              mainAxisSpacing: 12,
                              childAspectRatio: 1.4,
                              children: [
                                _buildStatCard("Sakinler", _stats!['total_residents'].toString(), Icons.people),
                                _buildStatCard("Binalar", _stats!['total_buildings'].toString(), Icons.domain),
                                _buildStatCard("Daireler", _stats!['total_apartments'].toString(), Icons.meeting_room),
                                _buildStatCard("Toplam Aidat", _stats!['total_dues'].toString(), Icons.payments),
                              ],
                            ),
                            const SizedBox(height: 24),
                          ],

                          // AI Insights section
                          CustomCard(
                            backgroundColor: theme.colorScheme.secondaryContainer.withOpacity(0.2),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  backgroundColor: theme.colorScheme.primary,
                                  child: const Icon(Icons.psychology, color: Colors.white),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "AI Topluluk Analizleri",
                                        style: theme.textTheme.headlineMedium?.copyWith(fontSize: 14),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        "Bırakın APT.AI şikayetleri değerlendirsin ve örüntüleri bulsun.",
                                        style: theme.textTheme.bodyLarge?.copyWith(fontSize: 12),
                                      ),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.arrow_forward),
                                  onPressed: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text("Analiz paneli yükleniyor...")),
                                    );
                                  },
                                )
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),

                          // Queued Requests Section
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                "Son Şikayetler",
                                style: theme.textTheme.headlineMedium,
                              ),
                              TextButton(
                                onPressed: widget.onNavigateToRequests,
                                child: const Text("Tümünü Gör"),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          if (_complaints.isEmpty)
                            const Center(child: Text("Aktif şikayet bulunmuyor."))
                          else
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _complaints.length > 3 ? 3 : _complaints.length,
                              itemBuilder: (context, index) {
                                final complaint = _complaints[index];
                                final priority = (complaint['priority'] ?? 'normal').toString().toLowerCase();
                                Color badgeBgColor = const Color(0xFFFEF3C7);
                                Color badgeTextColor = const Color(0xFFB45309);
                                if (priority == 'high') {
                                  badgeBgColor = const Color(0xFFFEE2E2);
                                  badgeTextColor = const Color(0xFFB91C1C);
                                } else if (priority == 'low' || priority == 'normal') {
                                  badgeBgColor = const Color(0xFFDCFCE3);
                                  badgeTextColor = const Color(0xFF15803D);
                                }

                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 8.0),
                                  child: CustomCard(
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                    child: Row(
                                      children: [
                                        Icon(Icons.plumbing, color: theme.colorScheme.secondary),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                complaint['title'] ?? '',
                                                style: theme.textTheme.headlineMedium?.copyWith(fontSize: 16),
                                              ),
                                              const SizedBox(height: 2),
                                              Text(
                                                (complaint['status'] ?? '').toString().toUpperCase(),
                                                style: theme.textTheme.labelSmall,
                                              ),
                                            ],
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: badgeBgColor,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            priority.toUpperCase(),
                                            style: TextStyle(
                                              color: badgeTextColor,
                                              fontWeight: FontWeight.w600,
                                              fontSize: 11,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon) {
    final theme = Theme.of(context);
    return CustomCard(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: theme.textTheme.labelSmall?.copyWith(fontWeight: FontWeight.bold),
              ),
              Icon(icon, color: theme.colorScheme.primary, size: 20),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: theme.textTheme.headlineLarge?.copyWith(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
