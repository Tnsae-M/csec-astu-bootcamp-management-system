# Final Frontend Integration & Refinement Plan

Based on your feedback, here is the final, step-by-step plan to clean up the frontend, fix functionality, and complete the integration. Once you approve this, I will execute these steps in order.

---

## Phase 1: Global Settings & Auth Clean-up

1.  **Remove Settings Component completely**:
    *   Delete `SettingsPage.tsx`.
    *   Remove "Settings" from `Navbar.tsx` DropdownMenu.
    *   Remove "Settings" from Quick Access links in `Sidebar.tsx`.
    *   Remove `/dashboard/settings` route mapping in the app router.
2.  **Clean up Login Page (`LoginPage.tsx`)**:
    *   Remove the "Demo Credentials" section containing the four hardcoded emails and passwords.

---

## Phase 2: Navigation & Routing Fixes

1.  **Card Routing**:
    *   In `DivisionsPage.tsx`, remove the "View Bootcamps" button. Add an `onClick` event to the `Card` component so clicking anywhere on the card routes to `/dashboard/divisions/:id/bootcamps`.
    *   In `BootcampsPage.tsx`, remove "View Sessions" and "Manage" buttons. Make the entire card route to `/dashboard/bootcamps/:id/sessions`.
2.  **Sidebar Sessions Route (Student)**:
    *   Confirm `/dashboard/sessions` routes to the `SessionsPage.tsx` component which displays a general list of sessions the student is attending.
    *   Clicking a session on that general page will route them into the specific `SessionDetailPage.tsx` flow.
3.  **Navbar Clean-up**:
    *   Remove the hardcoded search bar ("Quick search divisions...") from `Navbar.tsx`.
4.  **Notification Integration**:
    *   Wire up the bell icon in `Navbar.tsx` to display a dropdown/modal using `notifications.items` from the Redux store.

---

## Phase 3: Dashboard & Component Clean-up

1.  **Overview Dashboard (`OverviewPage.tsx`)**:
    *   **Remove Hardcoded Charts**: Delete the `AreaChart` and `BarChart` for "Growth Trends" and "Session Trends" entirely.
    *   **Keep Supported Role Cards**: Retain the `StatCard` components that correspond to actual backend modules (Users, Divisions, Bootcamps, Sessions, Tasks, Attendance, Groups, Feedback). Remove any cards that do not map to these core modules. We will use available Redux slices to populate them where possible, or leave them safely mocked/defaulted until specific aggregation endpoints are built.
2.  **Student Progress Page (`ProgressPage.tsx`)**:
    *   Strip out all over-engineered mock elements: Delete the `AreaChart` (Skill Growth), "Division Mastery" list, "Milestone Progress", and "Total Streak" components.
    *   Keep the top-level StatCards (Grade, Attendance, Tasks, Badges) as they loosely match backend modules, and use available backend data to populate them if possible.

---

## Phase 4: Modal Functionality Audit

1.  **Audit & Fix All Modals**:
    *   Check `DivisionsPage.tsx`, `BootcampsPage.tsx`, `SessionsPage.tsx`, and `GroupsPage.tsx` (and any other pages with creation modals).
    *   Ensure every modal's `onSubmit` handler correctly dispatches the relevant API call or Redux thunk.
    *   Ensure they handle loading/error states properly and close on success, resolving the issue where buttons were "not functional" or failing silently.
