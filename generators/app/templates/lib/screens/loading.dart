import 'package:flutter/material.dart';

import 'package:<%= packageName %>/widgets/app_wordmark.dart';

class LoadingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: AppWordmark(),
      ),
      body: const Center(child: CircularProgressIndicator()),
    );
  }
}
