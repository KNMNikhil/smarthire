import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Update this to your deployed backend URL or correct local network IP
  static const String baseUrl = 'http://192.168.68.105:5000/api';

  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    
    return {
      'Content-Type': 'application/json',
      if (token != null) 'x-auth-token': token,
    };
  }

  static Future<Map<String, dynamic>> login(String email, String password, String role) async {
    final endpoint = role == 'admin' ? '/auth/admin' : '/auth/student';
    final url = Uri.parse('$baseUrl$endpoint');

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        if (responseData['token'] != null) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', responseData['token']);
          await prefs.setString('role', role);
          // Store user details if available
          if (responseData['student'] != null) {
            await prefs.setString('user', jsonEncode(responseData['student']));
          } else if (responseData['admin'] != null) {
            await prefs.setString('user', jsonEncode(responseData['admin']));
          }
        }
        return {'success': true, 'data': responseData};
      } else {
        return {'success': false, 'message': responseData['msg'] ?? 'Login failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: ${e.toString()}'};
    }
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('role');
    await prefs.remove('user');
  }

  static Future<Map<String, dynamic>> getStudentDashboard() async {
    final url = Uri.parse('$baseUrl/students/dashboard');
    final headers = await _getHeaders();

    try {
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to load dashboard data');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
