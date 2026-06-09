import '../network/api_client.dart';
import '../network/api_endpoints.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;

  final ApiClient _client = ApiClient();
  Map<String, dynamic>? _currentUser;

  AuthService._internal();

  Map<String, dynamic>? get currentUser => _currentUser;

  Future<bool> login(String email, String password) async {
    try {
      final loginUrl = '${ApiEndpoints.baseUrl}${ApiEndpoints.login}';
      print('LOGIN URL: $loginUrl');
      print('--- FLUTTER AUTH DEBUG: REQUEST START ---');
      print('Base URL: ${ApiEndpoints.baseUrl}');
      print('Endpoint: ${ApiEndpoints.login}');
      print('Payload: {"email": "$email"}');
      
      final response = await _client.post(
        ApiEndpoints.login,
        data: {
          'email': email,
          'password': password,
        },
      );

      print('--- FLUTTER AUTH DEBUG: RESPONSE ---');
      print('Status Code: ${response.statusCode}');
      print('Response Data: ${response.data}');

      final token = response.data['access_token'];
      if (token != null) {
        await _client.storage.write(key: 'jwt_token', value: token);
        // Load user details
        return await fetchProfile();
      }
      return false;
    } catch (e) {
      print('--- FLUTTER AUTH DEBUG: ERROR ---');
      print('Exception message: $e');
      rethrow;
    }
  }

  Future<bool> register({
    required String registerType,
    required String fullName,
    required String email,
    required String password,
    String? siteCode,
    int? buildingId,
    int? apartmentId,
    String? phone,
    String? siteName,
    String? city,
    String? address,
  }) async {
    try {
      await _client.post(
        ApiEndpoints.register,
        data: {
          'register_type': registerType,
          'full_name': fullName,
          'email': email,
          'password': password,
          if (siteCode != null) 'site_code': siteCode,
          if (buildingId != null) 'building_id': buildingId,
          if (apartmentId != null) 'apartment_id': apartmentId,
          if (phone != null) 'phone': phone,
          if (siteName != null) 'site_name': siteName,
          if (city != null) 'city': city,
          if (address != null) 'address': address,
        },
      );
      return true;
    } catch (e) {
      rethrow;
    }
  }

  Future<bool> fetchProfile() async {
    try {
      final response = await _client.get(ApiEndpoints.me);
      _currentUser = response.data;
      return _currentUser != null;
    } catch (e) {
      _currentUser = null;
      return false;
    }
  }

  Future<void> logout() async {
    await _client.storage.delete(key: 'jwt_token');
    _currentUser = null;
  }

  Future<bool> isAuthenticated() async {
    final token = await _client.storage.read(key: 'jwt_token');
    if (token != null && token.isNotEmpty) {
      return await fetchProfile();
    }
    return false;
  }

  Future<Map<String, dynamic>> validateInviteCode(String code) async {
    try {
      final response = await _client.post(
        ApiEndpoints.validateInvite,
        data: {'code': code},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  Future<List<dynamic>> getBuildings(int siteId) async {
    try {
      final path = ApiEndpoints.publicBuildings.replaceAll('{siteId}', siteId.toString());
      final response = await _client.get(path);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  Future<List<dynamic>> getApartments(int buildingId) async {
    try {
      final path = ApiEndpoints.publicApartments.replaceAll('{buildingId}', buildingId.toString());
      final response = await _client.get(path);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
}
