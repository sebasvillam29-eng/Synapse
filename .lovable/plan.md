

# Plan: Build Synapse Landing Page (with honest social proof)

## Key Change from Original Plan
**Remove all fake social proof.** No fake star ratings, no fake student counts, no fake testimonials. Instead, replace with professional, honest alternatives:

- **Hero**: Replace "12,400+ students" avatar row with a clean tagline like "Built for students who want to study smarter" or a simple "Join the waitlist" counter
- **Remove Testimonials section entirely.** Replace with a **"Built With" / "Designed For"** section showing use cases (Med students, Law students, Engineering, etc.) with abstract illustrations — no fake quotes
- **Remove Stats Bar** (fake numbers). Replace with a **"Why Synapse?"** value proposition strip with honest benefit statements: "Save hours of study time", "Retain more from every session", "Study anywhere, anytime"

## What Gets Built

### File Structure
- `src/pages/Index.tsx` — main landing page composing all sections
- `src/components/Navbar.tsx`
- `src/components/Hero.tsx` — headline, CTA buttons, dashboard mockup, no fake stats
- `src/components/ValueStrip.tsx` — honest benefit statements (replaces stats bar)
- `src/components/InteractiveDemo.tsx` — tabbed demo (Summaries/Flashcards/Quiz)
- `src/components/HowItWorks.tsx` — 3-step process
- `src/components/FeaturesGrid.tsx` — 6 feature cards
- `src/components/UseCases.tsx` — replaces testimonials, shows student types/use cases
- `src/components/PricingSection.tsx` — Free vs Pro
- `src/components/FinalCTA.tsx`
- `src/components/Footer.tsx`
- Update `src/index.css` with dark theme design tokens and animations

### Design System
- Dark theme: navy/near-black background, purple accent (#7C5FFF), teal secondary (#2ECBCB)
- Clean sans-serif typography, gradient text for headlines
- Rounded cards with subtle borders, hover glow effects
- CSS animations: flashcard 3D flip, AI loading dots, scroll-reveal

### Social Proof Replacement: "Use Cases" Section
Instead of fake reviews, show a grid of cards like:
- "Pre-Med Students" — Turn dense biology notes into bite-sized flashcards
- "Law Students" — Summarize case briefs in seconds
- "Engineering Students" — Generate practice quizzes from lecture notes
- "Language Learners" — Create vocabulary flashcards automatically

Each card gets an icon and a short, honest description of the use case. No fake names, no fake quotes, no stars.

### Interactive Demo
All three tabs (Summaries, Flashcards, Quiz) work via frontend state simulation with loading animations — unchanged from original plan.

