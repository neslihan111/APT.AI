import 'package:flutter/material.dart';
import '../core/services/api_service.dart';

class Message {
  final String text;
  final bool isUser;
  final List<dynamic>? actions;
  final DateTime timestamp;

  Message(this.text, this.isUser, {this.actions, DateTime? time})
      : timestamp = time ?? DateTime.now();
}

class AIChatDialog extends StatefulWidget {
  const AIChatDialog({super.key});

  @override
  State<AIChatDialog> createState() => _AIChatDialogState();
}

class _AIChatDialogState extends State<AIChatDialog> {
  final List<Message> _messages = [
    Message("Merhaba! Bugün size nasıl yardımcı olabilirim?", false),
  ];
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;

  void _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(Message(text, true));
      _isLoading = true;
    });
    _controller.clear();
    _scrollToBottom();

    try {
      final response = await ApiService().sendMessageToAssistant(text);
      final answer = response['answer'] ?? "Bunu sizin için kontrol ediyorum.";
      final actions = response['actions'] as List<dynamic>?;

      setState(() {
        _messages.add(Message(answer, false, actions: actions));
      });
    } catch (e) {
      setState(() {
        _messages.add(Message("Hata: ${e.toString()}", false));
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      backgroundColor: theme.colorScheme.surfaceContainerLowest,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 500, maxHeight: 600),
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: theme.colorScheme.outlineVariant)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: theme.colorScheme.primary,
                    radius: 18,
                    child: Icon(Icons.smart_toy, color: theme.colorScheme.onPrimary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "APT.AI'a Sor",
                          style: theme.textTheme.headlineMedium?.copyWith(fontSize: 16),
                        ),
                        Text(
                          "Yapay Zeka Yapı Asistanı",
                          style: theme.textTheme.labelSmall?.copyWith(fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  )
                ],
              ),
            ),
            // Chat messages
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final message = _messages[index];
                  return _buildMessageBubble(message);
                },
              ),
            ),
            if (_isLoading)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  children: [
                    SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      "APT.AI düşünüyor...",
                      style: theme.textTheme.labelSmall,
                    ),
                  ],
                ),
              ),
             // Suggestion pills
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildSuggestionPill("Aidat borcum var mı?"),
                    const SizedBox(width: 8),
                    _buildSuggestionPill("Son duyuru ne?"),
                    const SizedBox(width: 8),
                    _buildSuggestionPill("Aktif şikayetlerim?"),
                  ],
                ),
              ),
            ),
            // Footer
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: theme.colorScheme.outlineVariant)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      decoration: InputDecoration(
                        hintText: "Sorunuzu yazın...",
                        hintStyle: TextStyle(color: theme.colorScheme.onSurfaceVariant.withOpacity(0.5)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        filled: true,
                        fillColor: theme.colorScheme.surfaceContainerLow,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  CircleAvatar(
                    backgroundColor: theme.colorScheme.primary,
                    radius: 20,
                    child: IconButton(
                      icon: const Icon(Icons.send, color: Colors.white, size: 18),
                      onPressed: _sendMessage,
                    ),
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildSuggestionPill(String text) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return ActionChip(
      label: Text(
        text,
        style: TextStyle(
          color: isDark ? theme.colorScheme.onSurface : const Color(0xFF475569),
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
      backgroundColor: isDark ? theme.colorScheme.surfaceContainerHigh : const Color(0xFFF1F5F9),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isDark ? theme.colorScheme.outline : const Color(0xFFCBD5E1),
          width: 1,
        ),
      ),
      onPressed: () {
        _controller.text = text;
        _sendMessage();
      },
    );
  }

  Widget _buildMessageBubble(Message message) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final bubbleBg = message.isUser
        ? theme.colorScheme.primary
        : (isDark ? theme.colorScheme.surfaceContainerLow : Colors.white);

    final bubbleFg = message.isUser
        ? theme.colorScheme.onPrimary
        : (isDark ? theme.colorScheme.onSurface : const Color(0xFF0F172A));

    final align = message.isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start;
    final bubbleRadius = BorderRadius.circular(12);

    final border = message.isUser
        ? null
        : Border.all(
            color: isDark ? theme.colorScheme.outline : const Color(0xFFE2E8F0),
            width: 1,
          );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Column(
        crossAxisAlignment: align,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: bubbleBg,
              borderRadius: bubbleRadius,
              border: border,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  message.text,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: bubbleFg,
                    fontSize: 14,
                  ),
                ),
                if (message.actions != null && message.actions!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  ...message.actions!.map((action) {
                    return Padding(
                      padding: const EdgeInsets.only(top: 4.0),
                      child: TextButton(
                        style: TextButton.styleFrom(
                          backgroundColor: const Color(0xFFE0F2FE),
                          foregroundColor: const Color(0xFF0369A1),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(6),
                            side: const BorderSide(color: Color(0xFFBAE6FD), width: 1),
                          ),
                        ),
                        onPressed: () {
                          // Simple mock navigator alert for actions
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text("Eylem: ${action['label']} tetiklendi.")),
                          );
                        },
                        child: Text(
                          action['label'] ?? 'Eylem',
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                        ),
                      ),
                    );
                  }),
                ]
              ],
            ),
          ),
          const SizedBox(height: 2),
          Text(
            "${message.timestamp.hour.toString().padLeft(2, '0')}:${message.timestamp.minute.toString().padLeft(2, '0')}",
            style: theme.textTheme.labelSmall?.copyWith(fontSize: 10),
          )
        ],
      ),
    );
  }
}
