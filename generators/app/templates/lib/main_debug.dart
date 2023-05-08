import 'package:flutter/material.dart';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_loggy/flutter_loggy.dart';
import 'package:loggy/loggy.dart';

import 'package:<%= packageName %>/app.dart';
import 'package:<%= packageName %>/blocs/debug_observer.dart';
import 'package:<%= packageName %>/firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load Firebase
  final firebaseApp = await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Configure FirebaseAuth and Firestore to connect to local emulators
  FirebaseAuth.instanceFor(app: firebaseApp).useAuthEmulator(
    "localhost",
    9099,
  );
  FirebaseFirestore.instanceFor(app: firebaseApp).useFirestoreEmulator(
    "localhost",
    8080,
  );

  Loggy.initLoggy(
    logPrinter: const PrettyDeveloperPrinter(),
  );

  BlocOverrides.runZoned(
    () {
      runApp(<%= appNamePascal %>App(firebaseApp: firebaseApp));
    },
    blocObserver: DebugBlocObserver(),
  );
}
