import 'package:flutter/foundation.dart';

class ApiEndpoints {
  // MANUEL IP YAPILANDIRMASI: Fiziksel cihazda test ederken burayı kendi yerel IP'nizle güncelleyebilirsiniz.
  // Boş bırakılırsa varsayılan kurallar (localhost/10.0.2.2) geçerli olur.
  static const String customLocalIp = ''; // Örneğin: '192.168.1.100'

  // Base URL resolution helper
  static String get baseUrl {
    if (customLocalIp.isNotEmpty) {
      return 'http://$customLocalIp:8000';
    }
    if (kIsWeb) {
      return 'http://127.0.0.1:8000';
    }
    // For Android emulator, use 10.0.2.2, otherwise 127.0.0.1 for iOS/Desktop.
    // If running on a physical device, update this to your machine's local IP address.
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return 'http://10.0.2.2:8000';
      default:
        return 'http://127.0.0.1:8000';
    }
  }

  // Auth
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String me = '/auth/me';
  static const String validateInvite = '/auth/validate-invite-code';
  static const String publicBuildings = '/auth/site/{siteId}/buildings';
  static const String publicApartments = '/auth/building/{buildingId}/apartments';
  static const String listUsers = '/auth/users';

  // Complaints / Requests
  static const String complaints = '/complaints';
  static const String myComplaints = '/complaints/my';
  static String updateComplaintStatus(int id) => '/complaints/$id/status';

  // Dues
  static const String dues = '/dues';
  static const String myDues = '/dues/my';
  static String updateDueStatus(int id) => '/dues/$id/status';

  // Announcements
  static const String announcements = '/announcements';

  // AI Assistant
  static const String aiAssistant = '/ai/assistant';
  static const String dashboardInsights = '/ai/dashboard-insights';

  // Admin
  static const String adminSite = '/admin/site';
  static const String adminStats = '/admin/stats';
  static const String adminResidents = '/admin/residents';
  static const String adminInviteCodes = '/admin/invite-codes';
  static const String adminBuildings = '/admin/buildings';
  static const String adminApartments = '/admin/apartments';
  static const String adminTransfer = '/admin/transfer';
}
