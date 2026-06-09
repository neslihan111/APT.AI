import '../network/api_client.dart';
import '../network/api_endpoints.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  final ApiClient _client = ApiClient();

  ApiService._internal();

  // Dues
  Future<List<dynamic>> getMyDues() async {
    final response = await _client.get(ApiEndpoints.myDues);
    return response.data;
  }

  Future<List<dynamic>> getAllDues() async {
    final response = await _client.get(ApiEndpoints.dues);
    return response.data;
  }

  Future<dynamic> createDue(int userId, double amount, String dueDate) async {
    final response = await _client.post(
      ApiEndpoints.dues,
      data: {
        'user_id': userId,
        'amount': amount,
        'due_date': dueDate,
      },
    );
    return response.data;
  }

  Future<dynamic> updateDueStatus(int dueId, String status) async {
    final response = await _client.put(
      ApiEndpoints.updateDueStatus(dueId),
      data: {'status': status},
    );
    return response.data;
  }

  // Complaints / Requests
  Future<List<dynamic>> getMyComplaints() async {
    final response = await _client.get(ApiEndpoints.myComplaints);
    return response.data;
  }

  Future<List<dynamic>> getAllComplaints() async {
    final response = await _client.get(ApiEndpoints.complaints);
    return response.data;
  }

  Future<dynamic> createComplaint(String title, String description) async {
    final response = await _client.post(
      ApiEndpoints.complaints,
      data: {
        'title': title,
        'description': description,
      },
    );
    return response.data;
  }

  Future<dynamic> updateComplaintStatus(int complaintId, String status) async {
    final response = await _client.put(
      ApiEndpoints.updateComplaintStatus(complaintId),
      data: {'status': status},
    );
    return response.data;
  }

  // Announcements
  Future<List<dynamic>> getAnnouncements() async {
    final response = await _client.get(ApiEndpoints.announcements);
    return response.data;
  }

  Future<dynamic> createAnnouncement(String title, String content) async {
    final response = await _client.post(
      ApiEndpoints.announcements,
      data: {
        'title': title,
        'content': content,
      },
    );
    return response.data;
  }

  // AI Assistant Chatbot
  Future<Map<String, dynamic>> sendMessageToAssistant(String message) async {
    final response = await _client.post(
      ApiEndpoints.aiAssistant,
      data: {'message': message},
    );
    return Map<String, dynamic>.from(response.data);
  }

  // Admin Dashboard Statistics
  Future<Map<String, dynamic>> getAdminStats() async {
    final response = await _client.get(ApiEndpoints.adminStats);
    return Map<String, dynamic>.from(response.data);
  }

  // Admin AI Dashboard Insights
  Future<Map<String, dynamic>> getAdminInsights() async {
    final response = await _client.get(ApiEndpoints.dashboardInsights);
    return Map<String, dynamic>.from(response.data);
  }

  // Admin Residents List
  Future<List<dynamic>> getResidents() async {
    final response = await _client.get(ApiEndpoints.adminResidents);
    return response.data;
  }
}
