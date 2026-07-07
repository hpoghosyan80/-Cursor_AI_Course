# User Profile Management — Test Cases

**Feature:** User Profile Management  
**Module:** 8 — AI for QA & DevOps  
**Version:** 1.0  
**Generated with:** Cursor AI  
**Related spec:** [user-profile-management.md](../feature-spec/user-profile-management.md)  
**Test data:** [user-profile-test-data.json](../../test-data/user-profile-test-data.json)

---

## Legend

| Field | Description |
|-------|-------------|
| **ID** | Unique test case identifier |
| **Priority** | P1 (critical) · P2 (high) · P3 (medium) |
| **Auto** | Candidate for automation (Y/N) |

---

## 1. User Registration — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| REG-P-001 | Register with valid customer data | No existing user with same email | 1. Send `POST /api/auth/register` with valid payload | `validUsers.newCustomer` | `201 Created`; response body contains `id`, `name`, `email`, `role: customer`, `is_active: true`; `password_hash` not exposed; `created_at` present | P1 | Y |
| REG-P-002 | Register with minimum valid name length | Clean database | 1. Register with 2-character name | `name: "Jo"`, `email: "jo@example.com"`, `password: "ValidPass1"` | `201 Created`; name stored as `"Jo"` | P2 | Y |
| REG-P-003 | Register with maximum valid name length | Clean database | 1. Register with 120-character name | `name`: 120-char string, `email: "maxname@example.com"`, `password: "ValidPass1"` | `201 Created`; full name persisted without truncation | P2 | Y |
| REG-P-004 | Register with email plus-addressing | Clean database | 1. Register with `+` in local part | `edgeCases.emailWithPlus` | `201 Created`; email stored exactly as normalized lowercase | P3 | Y |
| REG-P-005 | Register with Unicode name | Clean database | 1. Register with non-Latin characters | `edgeCases.unicodeName` | `201 Created`; Unicode name stored and returned correctly | P2 | Y |
| REG-P-006 | Register with emoji in name | Clean database | 1. Register with emoji characters | `edgeCases.emojiName` | `201 Created`; emoji preserved in response | P3 | Y |
| REG-P-007 | Email normalized to lowercase | Clean database | 1. Register with mixed-case email | `edgeCases.emailCaseVariation` | `201 Created`; email stored as `case.test@example.com` | P1 | Y |
| REG-P-008 | Register with 8-character boundary password | Clean database | 1. Register with exactly 8-char password meeting complexity | `edgeCases.boundaryPassword8Chars` | `201 Created`; user can log in with same password | P2 | Y |
| REG-P-009 | Login immediately after registration | User registered via REG-P-001 | 1. `POST /api/auth/login` with registered credentials | `email: jane.doe@example.com`, `password: SecurePass1` | `200 OK`; `access_token` and `token_type: Bearer` returned | P1 | Y |
| REG-P-010 | Default notification preferences on register | Clean database | 1. Register user 2. `GET /api/auth/me` | `validUsers.newCustomer` | `notification_email: true`, `notification_push: false` by default | P3 | Y |

---

## 2. User Registration — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| REG-N-001 | Reject duplicate email | User `jane.doe@example.com` exists | 1. Register with same email | `validUsers.newCustomer` | `409 CONFLICT`; message `"Email already registered"`; no duplicate row created | P1 | Y |
| REG-N-002 | Reject missing name | None | 1. POST without `name` field | `invalidRegistration.missingName` | `422 Unprocessable Entity`; validation error on `name` | P1 | Y |
| REG-N-003 | Reject name below minimum length | None | 1. Register with 1-character name | `invalidRegistration.shortName` | `422`; error indicates name length 2–120 | P1 | Y |
| REG-N-004 | Reject name above maximum length | None | 1. Register with 121+ character name | `invalidRegistration.longName` | `422`; validation error on `name` | P2 | Y |
| REG-N-005 | Reject invalid email format | None | 1. Register with malformed email | `invalidRegistration.invalidEmail` | `422`; validation error on `email` | P1 | Y |
| REG-N-006 | Reject password below minimum length | None | 1. Register with 7-char password | `invalidRegistration.shortPassword` | `422`; error on `password` minimum length | P1 | Y |
| REG-N-007 | Reject password without uppercase | None | 1. Register | `invalidRegistration.weakPasswordNoUpper` | `422`; password complexity error | P2 | Y |
| REG-N-008 | Reject password without lowercase | None | 1. Register | `invalidRegistration.weakPasswordNoLower` | `422`; password complexity error | P2 | Y |
| REG-N-009 | Reject password without digit | None | 1. Register | `invalidRegistration.weakPasswordNoDigit` | `422`; password complexity error | P2 | Y |
| REG-N-010 | Reject empty request body | None | 1. POST with `{}` | Empty JSON | `422`; multiple field validation errors | P2 | Y |
| REG-N-011 | Reject null values | None | 1. POST with null fields | `{"name": null, "email": null, "password": null}` | `422`; validation errors | P3 | Y |
| REG-N-012 | Reject role escalation to admin | None | 1. Register requesting `admin` role | `invalidRegistration.roleEscalation` | `403 FORBIDDEN`; message about customer-only self-registration | P1 | Y |
| REG-N-013 | Reject role escalation to agent | None | 1. Register with `role: agent` | `name: "Agent Wannabe"`, `email: "fake@agent.com"`, `password: "ValidPass1"`, `role: agent` | `403 FORBIDDEN` | P1 | Y |
| REG-N-014 | Reject extra unknown fields (strict mode) | None | 1. POST with unknown `is_admin: true` | Valid user + `"is_admin": true` | `422` or field stripped; `is_admin` never `true` in DB | P2 | Y |

---

## 3. User Registration — Edge Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| REG-E-001 | Whitespace-trimmed name | Clean database | 1. Register with padded name | `edgeCases.whitespacePaddedName` | Name stored as `"Padded Name"` (trimmed) or rejected with clear error — behavior documented consistently | P3 | Y |
| REG-E-002 | Concurrent duplicate registration | Two parallel requests | 1. Send two simultaneous POSTs with same email | Same `validUsers.newCustomer` payload | Exactly one `201`; other returns `409`; DB has single record | P2 | Y |
| REG-E-003 | Register after soft-deleted account (same email) | User soft-deleted within grace period | 1. Attempt register with deleted user's email | Same email as deleted account | `409` during grace period OR `201` if email released — per business rule | P2 | Y |
| REG-E-004 | Very long email local part | Clean database | 1. Register with 64-char local part | Email at RFC max local length | `201` or `422` — must match documented limit | P3 | Y |
| REG-E-005 | Content-Type not JSON | None | 1. POST `text/plain` body | Plain text credentials | `415 Unsupported Media Type` or `400` | P3 | Y |
| REG-E-006 | Rate limit on registration | 20+ requests in 1 minute | 1. Send 21 register requests rapidly | Unique emails each time | First 20 succeed or fail independently; 21st returns `429 Too Many Requests` | P2 | Y |

---

## 4. User Registration — Security Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| REG-S-001 | SQL injection in email field | None | 1. Register with SQL payload in email | `invalidRegistration.sqlInjectionEmail` | `422` or safe storage; no SQL execution; users table intact | P1 | Y |
| REG-S-002 | XSS in name field | None | 1. Register with script tag in name | `invalidRegistration.xssInName` | Name stored escaped/sanitized; no script execution in API response | P1 | Y |
| REG-S-003 | Password not returned in response | Successful registration | 1. Register 2. Inspect response body | `validUsers.newCustomer` | No `password`, `password_hash`, or hash fragments in response | P1 | Y |
| REG-S-004 | Password stored hashed | Successful registration | 1. Register 2. Query DB directly | `validUsers.newCustomer` | `password_hash` is bcrypt; not equal to plaintext | P1 | Y |
| REG-S-005 | Mass assignment via extra fields | None | 1. Register with `is_active: false` | Valid user + `"is_active": false` | User created with `is_active: true` (server default) | P1 | Y |
| REG-S-006 | NoSQL/JSON injection in body | None | 1. POST `{"email": {"$gt": ""}}` | Malformed object as email | `422`; no authentication bypass | P2 | Y |
| REG-S-007 | HTTPS-only recommendation | Production env | 1. Register over HTTP (if enforced) | Valid payload | Request rejected or redirected to HTTPS | P3 | N |

---

## 5. Profile Retrieval — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PROF-P-001 | Get own profile when authenticated | Valid JWT for user | 1. `GET /api/auth/me` with Bearer token | Token from `jane.doe@example.com` login | `200 OK`; profile matches registered data; no sensitive fields | P1 | Y |
| PROF-P-002 | Profile includes timestamps | User exists | 1. `GET /api/auth/me` | Valid token | `created_at` present; `updated_at` present after any update | P2 | Y |
| PROF-P-003 | Profile reflects recent update | User updated profile | 1. PATCH profile 2. GET /me | `profileUpdates.validPartial` | GET returns updated `name` and `bio` | P1 | Y |

---

## 6. Profile Retrieval — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PROF-N-001 | Reject unauthenticated request | No token | 1. `GET /api/auth/me` without Authorization | None | `401 UNAUTHORIZED` | P1 | Y |
| PROF-N-002 | Reject invalid JWT | None | 1. GET with malformed token | `securityPayloads.jwtTampered` | `401`; error code `UNAUTHORIZED` | P1 | Y |
| PROF-N-003 | Reject expired JWT | Expired token | 1. GET with expired token | Expired JWT (>24h) | `401`; message indicates token expired | P1 | Y |
| PROF-N-004 | Reject revoked token after logout | User logged out | 1. Login 2. Logout 3. GET /me with old token | Revoked token | `401`; token on blocklist | P1 | Y |
| PROF-N-005 | Reject disabled account token | `is_active: false` | 1. GET /me with pre-revocation token | Disabled user token | `403 FORBIDDEN`; account disabled message | P1 | Y |

---

## 7. Profile Updates — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| UPD-P-001 | Update name and bio | Authenticated customer | 1. `PATCH /api/users/me` | `profileUpdates.validPartial` | `200 OK`; fields updated; `updated_at` changed | P1 | Y |
| UPD-P-002 | Update email to new unique address | Authenticated | 1. PATCH email | `profileUpdates.validEmailChange` | `200 OK`; email updated and normalized lowercase | P1 | Y |
| UPD-P-003 | Update notification preferences | Authenticated | 1. PATCH preferences | `profileUpdates.validPreferences` | `200 OK`; booleans updated | P2 | Y |
| UPD-P-004 | Update avatar URL (HTTPS) | Authenticated | 1. PATCH avatar_url | `avatar_url: https://cdn.example.com/new.png` | `200 OK`; URL stored | P2 | Y |
| UPD-P-005 | Partial update leaves other fields unchanged | User has existing bio | 1. PATCH only `name` | `{"name": "New Name Only"}` | Only `name` changes; `bio`, `email` unchanged | P1 | Y |
| UPD-P-006 | Clear bio with empty string | Authenticated | 1. PATCH `bio: ""` | Empty string | `200 OK`; bio cleared | P3 | Y |
| UPD-P-007 | Clear avatar URL | Authenticated | 1. PATCH `avatar_url: ""` or `null` | Empty/null | `200 OK`; avatar removed | P3 | Y |

---

## 8. Profile Updates — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| UPD-N-001 | Reject unauthenticated update | No token | 1. PATCH without auth | `profileUpdates.validPartial` | `401 UNAUTHORIZED` | P1 | Y |
| UPD-N-002 | Reject duplicate email | Another user owns target email | 1. PATCH to existing email | Email of `john.smith@example.com` | `409 CONFLICT` | P1 | Y |
| UPD-N-003 | Reject invalid email format | Authenticated | 1. PATCH bad email | `{"email": "bad@"}` | `422` validation error | P1 | Y |
| UPD-N-004 | Reject bio exceeding 500 chars | Authenticated | 1. PATCH long bio | `profileUpdates.invalidBioTooLong` | `422`; bio length error | P2 | Y |
| UPD-N-005 | Reject invalid avatar URL | Authenticated | 1. PATCH malformed URL | `profileUpdates.invalidAvatarUrl` | `422` validation error | P2 | Y |
| UPD-N-006 | Reject HTTP avatar URL (HTTPS only) | Authenticated | 1. PATCH http URL | `profileUpdates.httpAvatarUrl` | `422` or `400`; HTTPS required | P2 | Y |
| UPD-N-007 | Reject empty name | Authenticated | 1. PATCH empty name | `profileUpdates.emptyName` | `422`; name required/min length | P1 | Y |
| UPD-N-008 | Reject role self-escalation | Customer authenticated | 1. PATCH role to admin | `profileUpdates.roleEscalationAttempt` | `403 FORBIDDEN` or field ignored with audit log | P1 | Y |
| UPD-N-009 | Reject update to another user's profile (IDOR) | Token for user A | 1. `PATCH /api/users/{id}` for user B | `securityPayloads.idorUserId` | `403` or `404`; no cross-user modification | P1 | Y |
| UPD-N-010 | Reject PATCH with no valid fields | Authenticated | 1. PATCH `{}` | Empty object | `400` or `422`; no-op rejected or ignored per spec | P3 | Y |

---

## 9. Profile Updates — Edge Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| UPD-E-001 | Bio at exactly 500 characters | Authenticated | 1. PATCH max-length bio | `edgeCases.maxLengthBio` | `200 OK`; full 500 chars stored | P2 | Y |
| UPD-E-002 | Unicode and emoji in bio | Authenticated | 1. PATCH bio with Unicode/emoji | `bio: "Hello 世界 🌍"` | `200 OK`; characters preserved | P3 | Y |
| UPD-E-003 | Idempotent duplicate PATCH | Authenticated | 1. PATCH same data twice | `profileUpdates.validPartial` | Both return `200`; no duplicate side effects | P3 | Y |
| UPD-E-004 | Email change requires re-login (if enforced) | Authenticated | 1. Change email 2. Use old token | Email change flow | Old token invalidated OR still valid per policy — documented | P2 | Y |
| UPD-E-005 | Concurrent profile updates | Two parallel PATCH | 1. Simultaneous updates to different fields | Name + bio concurrently | Last-write-wins or optimistic locking — no corrupted state | P2 | Y |

---

## 10. Profile Updates — Security Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| UPD-S-001 | XSS sanitization in bio | Authenticated | 1. PATCH bio with `<script>alert(1)</script>` | XSS payload | Stored escaped; safe in JSON response | P1 | Y |
| UPD-S-002 | SSRF via avatar URL | Authenticated | 1. PATCH internal metadata URL | `securityPayloads.ssrfInternalUrl` | `422` or URL validation blocks internal IPs | P1 | Y |
| UPD-S-003 | Path traversal in avatar URL | Authenticated | 1. PATCH traversal URL | `securityPayloads.pathTraversalAvatar` | Rejected or normalized; no file system access | P2 | Y |
| UPD-S-004 | Mass assignment of is_active | Authenticated | 1. PATCH `is_active: true` while deleted | `{"is_active": true}` | Field ignored; cannot self-reactivate via PATCH | P1 | Y |
| UPD-S-005 | CSRF protection (cookie auth) | Cookie-based session | 1. Cross-origin PATCH without token | Forged request | `401/403` — not applicable if JWT-only | P3 | N |

---

## 11. Password Change — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PWD-P-001 | Change password with valid credentials | Authenticated user | 1. `PUT /api/users/me/password` | `passwordChange.valid` | `200 OK`; success message; old password no longer works | P1 | Y |
| PWD-P-002 | Login with new password after change | Password changed | 1. Login with new password | `new_password: NewSecure2` | `200 OK`; new JWT issued | P1 | Y |
| PWD-P-003 | All sessions invalidated after change | Multiple active tokens | 1. Change password 2. Use old token | `passwordChange.valid` | Old JWT returns `401` on protected endpoints | P1 | Y |

---

## 12. Password Change — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PWD-N-001 | Reject wrong current password | Authenticated | 1. PUT password | `passwordChange.wrongCurrent` | `401 UNAUTHORIZED`; password unchanged | P1 | Y |
| PWD-N-002 | Reject mismatched confirm password | Authenticated | 1. PUT password | `passwordChange.mismatchedConfirm` | `422`; confirm mismatch error | P1 | Y |
| PWD-N-003 | Reject new password same as current | Authenticated | 1. PUT password | `passwordChange.sameAsCurrent` | `400`; cannot reuse current password | P2 | Y |
| PWD-N-004 | Reject weak new password | Authenticated | 1. PUT password | `passwordChange.weakNewPassword` | `422`; complexity validation error | P1 | Y |
| PWD-N-005 | Reject unauthenticated password change | No token | 1. PUT without auth | `passwordChange.valid` | `401 UNAUTHORIZED` | P1 | Y |
| PWD-N-006 | Reject missing current_password | Authenticated | 1. PUT without current | `{"new_password": "NewSecure2"}` | `422`; required field error | P1 | Y |
| PWD-N-007 | Reject common/breached password | Authenticated | 1. PUT common password | `passwordChange.commonPassword` | `422` if breach list enabled; otherwise document acceptance | P2 | Y |

---

## 13. Password Change — Edge Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PWD-E-001 | Password at minimum length (8) | Authenticated | 1. Change to 8-char complex password | `new_password: "Abcd123!"` | `200 OK` | P2 | Y |
| PWD-E-002 | Password at maximum length | Authenticated | 1. Change to 128-char password | 128-char complex string | `200 OK` or `422` per documented max | P3 | Y |
| PWD-E-003 | Rate limit on password change | 5+ attempts in 1 min | 1. Send 6 password change requests | Any payloads | 6th returns `429` | P2 | Y |
| PWD-E-004 | Unicode characters in password | Authenticated | 1. Set password with Unicode | `new_password: "Pässw0rd!"` | `200 OK` if supported; or `422` with clear message | P3 | Y |

---

## 14. Password Change — Security Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| PWD-S-001 | Timing-safe wrong password response | Authenticated | 1. Compare response time wrong vs right current password | Wrong vs correct | Similar response times; no user enumeration via timing | P2 | Y |
| PWD-S-002 | Password not logged | Password change | 1. Change password 2. Inspect server logs | `passwordChange.valid` | Plaintext passwords absent from logs | P1 | Y |
| PWD-S-003 | Brute force current password | Authenticated | 1. Rapid wrong current_password attempts | `securityPayloads.bruteForcePasswords` | Account lockout or rate limit after N failures | P1 | Y |
| PWD-S-004 | New password hash differs from old | After change | 1. Compare DB hash before/after | Valid change | `password_hash` updated; bcrypt salt unique | P1 | Y |

---

## 15. Account Deletion — Positive Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| DEL-P-001 | Soft delete with valid confirmation | Authenticated active user | 1. `DELETE /api/users/me` | `accountDeletion.valid` | `200 OK`; `is_active: false`; user cannot login | P1 | Y |
| DEL-P-002 | Profile inaccessible after deletion | Account deleted | 1. GET /me with old token | Pre-deletion token | `401` or `403`; account disabled | P1 | Y |
| DEL-P-003 | Reactivate within grace period | Deleted < 30 days ago | 1. `POST /api/users/me/reactivate` | Email + password | `200 OK`; `is_active: true`; user can login | P2 | Y |
| DEL-P-004 | Data retained during grace period | Soft-deleted user | 1. Admin/support queries user record | Deleted user ID | Record exists with `is_active: false` | P2 | Y |

---

## 16. Account Deletion — Negative Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| DEL-N-001 | Reject deletion without password | Authenticated | 1. DELETE without password | `accountDeletion.missingConfirmation` | `422`; password required | P1 | Y |
| DEL-N-002 | Reject deletion with wrong password | Authenticated | 1. DELETE | `accountDeletion.wrongPassword` | `401 UNAUTHORIZED`; account remains active | P1 | Y |
| DEL-N-003 | Reject deletion without confirmation text | Authenticated | 1. DELETE without `confirmation: DELETE` | Password only | `422`; confirmation required | P1 | Y |
| DEL-N-004 | Reject case-sensitive confirmation mismatch | Authenticated | 1. DELETE with `delete` lowercase | `accountDeletion.wrongConfirmationText` | `422`; must be exact `DELETE` | P2 | Y |
| DEL-N-005 | Reject unauthenticated deletion | No token | 1. DELETE without auth | `accountDeletion.valid` | `401 UNAUTHORIZED` | P1 | Y |
| DEL-N-006 | Reject double deletion | Already deleted | 1. DELETE again | Valid credentials | `403` or `404`; idempotent error | P2 | Y |
| DEL-N-007 | Reject reactivation after grace period | Deleted > 30 days | 1. POST reactivate | Valid credentials | `404` or `410 Gone`; account permanently purged | P2 | Y |

---

## 17. Account Deletion — Edge Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| DEL-E-001 | Delete account with open tickets (Module 7) | Customer with active tickets | 1. DELETE account | Valid deletion payload | Tickets anonymized or retained per policy; no orphaned FK errors | P2 | Y |
| DEL-E-002 | Email reusable after permanent purge | 30+ days post-delete | 1. Register with same email | Previously deleted email | `201 Created` | P2 | Y |
| DEL-E-003 | Grace period boundary (day 30) | Deleted exactly 30 days ago | 1. Attempt reactivate | Valid credentials | Success or failure at exact boundary — documented | P3 | Y |

---

## 18. Account Deletion — Security Test Cases

| ID | Title | Preconditions | Test Steps | Test Data | Expected Result | Priority | Auto |
|----|-------|---------------|------------|-----------|-----------------|----------|------|
| DEL-S-001 | Cannot delete another user's account | Token for user A | 1. `DELETE /api/users/{id}` | Other user's ID | `403 FORBIDDEN` | P1 | Y |
| DEL-S-002 | Admin cannot hard-delete without audit | Admin role | 1. Admin DELETE user | Admin token + target ID | Requires audit trail; soft delete only for self-service | P2 | Y |
| DEL-S-003 | Deletion requires fresh authentication (if enforced) | Stale session | 1. DELETE with old token (>1h) | Old JWT | `401` if step-up auth required | P3 | N |
| DEL-S-004 | PII scrubbing on permanent purge | Post-grace cron job | 1. Verify purged record | Deleted user | Email/name anonymized or record removed; no PII in logs | P1 | Y |

---

## Test Summary

| Category | Registration | Profile GET | Profile UPDATE | Password | Deletion | **Total** |
|----------|-------------|-------------|----------------|----------|----------|-----------|
| Positive | 10 | 3 | 7 | 3 | 4 | **27** |
| Negative | 14 | 5 | 10 | 7 | 7 | **43** |
| Edge | 6 | — | 5 | 4 | 3 | **18** |
| Security | 7 | — | 5 | 4 | 4 | **20** |
| **Total** | **37** | **8** | **27** | **18** | **18** | **108** |

---

## Execution Notes

1. **Environment:** Run against local API (`http://localhost:5000`) or staging with isolated test database.
2. **Setup:** Reset DB or use unique emails per run to avoid `409` conflicts.
3. **Auth helper:** Register → login → store `access_token` for authenticated cases.
4. **Automation:** Cases marked **Auto: Y** are suitable for pytest (Module 7) or Playwright (Module 6) in later Module 8 exercises.
5. **Traceability:** Map automated test function names to IDs (e.g. `test_REG_P_001_register_valid_customer`).

---

## AI Generation Prompt

The test cases above were generated using the following prompt (also recorded in [AI_PROMPTS.md](../AI_PROMPTS.md)):

> Generate comprehensive test cases for a new user profile management feature. Include positive test cases, negative test cases, edge cases, and security test cases. Cover user registration, profile updates, password changes, and account deletion. Use AI to create detailed test scenarios with expected results and test data.
