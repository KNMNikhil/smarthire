import 'package:flutter/material.dart';

class InterviewsScreen extends StatelessWidget {
  const InterviewsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.business_center, size: 80, color: Colors.white24),
          SizedBox(height: 16),
          Text(
            'Interviews Dashboard',
            style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Text(
            'Track your upcoming drives and applications',
            style: TextStyle(color: Colors.grey, fontSize: 16),
          ),
        ],
      ),
    );
  }
}
