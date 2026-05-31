# Security Specification for Luna App

## Data Invariants
1. A user can only access their own profile data.
2. A log entry must belong to the authenticated user and cannot be created for another user.
3. User plan can only be updated by the system or via specific payment actions (simulated here).
4. Critical fields like `createdAt` are immutable after creation.
5. `updatedAt` must always be the current server time during updates.

## The "Dirty Dozen" Payloads
1. Attempt to create a user profile with a different UID than authenticated.
2. Attempt to read another user's profile.
3. Attempt to update another user's profile.
4. Attempt to create a log entry in another user's subcollection.
5. Attempt to read another user's logs.
6. Attempt to delete another user's logs.
7. Attempt to inject a 1MB string into the `mood` field of a log.
8. Attempt to change `createdAt` on a user profile.
9. Attempt to update a log entry with more than 50 symptoms (DOS attack).
10. Attempt to set `plan` to 'premium' without going through the payment flow (modeled as a restricted field).
11. Attempt to create a log without a `date`.
12. Attempt to use an invalid ID string (e.g., containing script tags).

## Test Runner
(Tests would go here, for now I will focus on the rules implementation)
