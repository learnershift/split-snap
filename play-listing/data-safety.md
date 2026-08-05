# Google Play Data safety worksheet — local draft

**Status:** Draft only. Do not copy into Play Console without owner review against the final signed AAB.

| Console question | Proposed answer | Repository evidence |
|---|---|---|
| Does the app collect or share any required user data types? | No | No `INTERNET` permission; local WebView assets only; no analytics, ads, account, or backend dependencies. |
| Is all user data encrypted in transit? | Not applicable | The app has no network permission or data transmission. |
| Can users request deletion? | Yes, local deletion is available | Saved bills can be deleted/reset in the app. |
| Does the app use data for tracking? | No | No advertising IDs, analytics, or tracking SDKs. |

## Scope boundary

This worksheet describes SplitSnap’s released package only. The owner must re-evaluate every answer if dependencies, permissions, network behavior, or sharing behavior change.
