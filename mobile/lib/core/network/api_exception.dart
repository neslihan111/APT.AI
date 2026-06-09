import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException({required this.message, this.statusCode});

  factory ApiException.fromDioError(DioException error) {
    String message = "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
    int? statusCode = error.response?.statusCode;

    if (error.response?.data != null && error.response?.data is Map) {
      final detail = error.response?.data['detail'];
      if (detail != null) {
        message = detail.toString();
        return ApiException(message: message, statusCode: statusCode);
      }
    }
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        message = "Sunucu bağlantı zaman aşımına uğradı.";
        break;
      case DioExceptionType.badResponse:
        if (statusCode == 401) {
          message = "E-posta veya şifre hatalı.";
        } else if (statusCode == 403) {
          message = "Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.";
        } else if (statusCode == 404) {
          message = "İstenen kaynak bulunamadı.";
        } else if (statusCode == 500) {
          message = "Sunucu hatası oluştu.";
        }
        break;
      case DioExceptionType.cancel:
        message = "İstek iptal edildi.";
        break;
      case DioExceptionType.connectionError:
        message = "Sunucuya bağlanılamadı.";
        break;
      default:
        break;
    }

    return ApiException(message: message, statusCode: statusCode);
  }

  @override
  String toString() => message;
}
