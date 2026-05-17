# Implementation Plan - Subscription, Personalized Dashboard, Market Intelligence & Support

This plan outlines the steps to add subscription management, personalized dashboard elements, smart market recommendations, and a global support floating button to the Zyro Business Toolkit.

## Scope Summary
- **Subscription Hub**: A new management screen for plans and prepaid cards with M-Pesa/WaafiPay integration.
- **Personalized Dashboard**: Dynamic greetings, behavior-based shortcuts (invoices/reports), and smart notifications (low stock/drafts).
- **Market Intelligence**: A "Recommended for You" section based on sales history.
- **Support Integration**: A global floating "Need Help?" button with a contact bottom sheet.

## Affected Areas
- `src/pages/Settings.tsx`: Will host the entry point/content for Subscriptions.
- `src/pages/Dashboard.tsx`: Will be updated with personalized greetings and dynamic cards.
- `src/App.tsx`: Will host the global floating help button.
- `src/lib/store.ts`: Might need updates to track user "behavior" (e.g., counters for invoice/report views) if using mock state.
- `src/lib/i18n.ts`: New translations for the new features.

## Phase 1: Global Support Button (frontend_engineer)
**Goal**: Add the "Need Help?" floating button accessible across all main screens.
1. Create `src/components/SupportButton.tsx` using `Lucide` icons and Shadcn UI `Drawer` or `Sheet`.
2. Implement options: Call (+252637494948), WhatsApp (+252637494948), Email (maxamed446510@gmail.com).
3. Integrate the button into `src/App.tsx` outside the main routing motion div to ensure it stays fixed.

## Phase 2: Subscription & Payment Hub (frontend_engineer)
**Goal**: Implement the subscription plans and payment flow.
1. Update `src/pages/Settings.tsx` to include a "Subscription" section.
2. Create a sub-view or component `src/components/SubscriptionPlans.tsx`:
   - Plans: Basic ($9.99), Pro ($19.99), Market Intelligence ($7.99).
   - Prepaid Cards: 25 ($2.99), 100 ($7.99), 500 ($24.99).
3. Implement `src/components/PaymentSelection.tsx`:
   - Options: M-Pesa (default for KE/ET), WaafiPay.
   - For WaafiPay: Show a `AlertDialog` (Shadcn) with "You will be securely redirected...".
4. Update translations in `src/lib/i18n.ts`.

## Phase 3: Personalized Dashboard (frontend_engineer)
**Goal**: Make the dashboard dynamic based on user state/behavior.
1. Update `src/pages/Dashboard.tsx`:
   - Add greeting: `Good morning, {storeName}!`.
   - Implement conditional logic for shortcuts:
     - If `user.invoiceCount > threshold`, prioritize 'New Invoice'.
     - If `user.reportViewCount > threshold`, show a mini profit chart (using `src/components/ui/chart.tsx`).
   - Add a "Smart Notification Card" for pending drafts or low stock (mocked data).
2. Mock behavior data in `src/lib/store.ts` or as local state for now.

## Phase 4: Market Intelligence Recommendations (frontend_engineer)
**Goal**: Enhance the Market Intelligence section.
1. Update the 'Market Intelligence' section in `src/pages/Dashboard.tsx` (or a dedicated page if it exists).
2. Add a "Recommended for You" section.
3. Implement logic to suggest products based on "top-selling categories" (mocked sales history).

## Assumptions & Risks
- **Behavior Tracking**: Since there is no real backend/analytics yet, behavior-based personalization will rely on mocked counters in the local store.
- **Payment Redirects**: WaafiPay redirection will be a simulated "Continue" button for now (unless a URL is provided).
- **Responsiveness**: The floating button must not overlap with the bottom navigation items.

## Sequencing
1. **Phase 1** is independent and can be done first.
2. **Phase 2** expands Settings.
3. **Phase 3 & 4** involve modifying the same file (`Dashboard.tsx`) and should be done together or sequentially by the same engineer.
