part of 'models.dart';

abstract class UserProfileEvent {}

class UserProfileEventInitialize extends UserProfileEvent {}

@freezed
class UserProfileEventUpdateDisplayName extends UserProfileEvent
    with _$UserProfileEventUpdateDisplayName {
  factory UserProfileEventUpdateDisplayName({
    required String displayName,
  }) = _UserProfileEventUpdateDisplayName;
}

@freezed
class UserProfileState with _$UserProfileState {
  const UserProfileState._();

  const factory UserProfileState({
    @Default(true) @JsonKey(ignore: true) bool isLoading,
    @Default(false) bool hasUserSetDisplayName,
    String? displayName,
    String? email,
    String? photoUrl,
    DateTime? created,
  }) = _UserProfileState;

  factory UserProfileState.fromJson(Map<String, dynamic> json) =>
      _$UserProfileStateFromJson(json);

  factory UserProfileState.fromFirestore(
    DocumentSnapshot snapshot,
    SnapshotOptions? options,
  ) {
    return UserProfileState.fromJson(
      convertFromDoc(snapshot.data() as Map<String, dynamic>),
    );
  }

  static Map<String, Object?> toFirestore(
    UserProfileState model,
    SetOptions? options,
  ) {
    return convertToDoc(model.toJson());
  }

  String getUserIdentifyingString() {
    return displayName ?? email ?? "Unknown user";
  }
}
