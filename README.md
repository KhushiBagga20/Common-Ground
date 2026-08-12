# 🌻 CommonGround

> **Find your people, not just hobbies.**

CommonGround is a hobby discovery and community platform built for college students and young adults. It is not a social network. It's not an infinite content feed. It's the digital room you walk into when you think *"I want to try something new"* — and end up meeting people who share the exact same spark.

---

## 🗺️ Visual User Journey

```mermaid
flowchart TD
    A["👋 Land on CommonGround"] --> B["🎲 Discover Hobbies\n(Surprise Me / Cloud)"]
    B --> C["🃏 Swipe Deck Onboarding\n(Swipe Right / Left)"]
    C --> D["📌 Build Interest Portfolio\n(Stored in Local State)"]
    D --> E["🌍 Personalised Ground Feed\n(Selected Topics & Discussions)"]
    E --> F["🧑‍🤝‍🧑 Community Hubs\n(Shared Projects & Threads)"]
    F --> G["🤝 Meaningful Connection\n(Participation over Vanity)"]

    style A fill:#F7F6F2,stroke:#191919,stroke-width:2px
    style C fill:#FFD43B,stroke:#191919,stroke-width:2px,color:#111
    style E fill:#4D7CFE,stroke:#191919,stroke-width:2px,color:#fff
    style F fill:#5BCB77,stroke:#191919,stroke-width:2px,color:#111
    style G fill:#FF72B6,stroke:#191919,stroke-width:2px,color:#111
```

---

## 📐 Page Wireframes & Layout Mechanics

### 1. Onboarding — Hobby Swipe Deck (`/onboarding`)

```
+-----------------------------------------------------------------------+
|  [🌻 Logo]           [====== Progress: 3/20 ======]         [☀️ Theme] |
+-----------------------------------------------------------------------+
|                                                                       |
|                     ┌───────────────────────────┐                     |
|                     │  📸 Photography     [Creative]│                 |
|                     │ ------------------------- │                     |
|                     │                           │                     |
|                     │   "Capture moments, play  │                     |
|                     │    with light & shadow"   │   <--- (Drag/Swipe) |
|                     │                           │                     |
|                     │   👥 284 Members          │                     |
|                     └───────────────────────────┘                     |
|                        ┌─────────────────────┐                        |
|                        │ Next Card Behind... │                        |
|                        └─────────────────────┘                        |
|                                                                       |
|              [ ❌ PASS (Left) ]      [ 💚 INTERESTED (Right) ]         |
+-----------------------------------------------------------------------+
```

---

### 2. Personalised Ground (`/ground`)

```
+-----------------------------------------------------------------------+
|  [🌻 CommonGround]        Ground   Explore   Profile         [ + Create ]|
+-----------------------------------------------------------------------+
|                                                                       |
|  MY INTERESTS:  [📸 Photography ✖] [🧗 Bouldering ✖] [🎸 Guitar ✖]      |
|                                                                       |
|  +-------------------------------------+  +-------------------------+ |
|  | 📸 Photography Community             |  | 💡 Related Hobbies       | |
|  | "Anyone doing a street shoot this   |  | ----------------------- | |
|  |  weekend in downtown?"              |  | [🎬 Film]               | |
|  |  💬 18 replies  •  2h ago           |  | [✏️ Drawing]            | |
|  +-------------------------------------+  +-------------------------+ |
|  | 🧗 Bouldering Hub                   |  | 📈 Active Communities   | |
|  | "Best indoor shoes for beginners?"   |  | ----------------------- | |
|  |  💬 34 replies  •  5h ago           |  | 🧗 Bouldering (124)     | |
|  +-------------------------------------+  | 📸 Photography (284)    | |
|                                           +-------------------------+ |
+-----------------------------------------------------------------------+
```

---

### 3. Community Hub (`/community/:id`)

```
+-----------------------------------------------------------------------+
|  ← Back to Ground                                                     |
|                                                                       |
|  📸 PHOTOGRAPHY COMMUNITY                           [ + Join Hub ]     |
|  "From street photography to film, capture what others walk past."     |
|  👥 284 Members  •  🏷️ Creative Category                              |
|  -------------------------------------------------------------------- |
|                                                                       |
|  [ Discussions ]    [ Questions ]    [ Projects ]    [ Members ]      |
|                                                                       |
|  +------------------------------------------------------------------+ |
|  | 👤 Alex Chen  •  2 hours ago                      [📸 Photography] |
|  | 💬 "Should I finally switch from phone to a digital camera?"     |
|  | "I've been shooting on mobile for 6 months..."                    |
|  | 💬 14 Comments  •  🤝 8 Interested                             |
|  +------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

---

## 🎨 Design System Architecture

```mermaid
graph TB
    subgraph DesignSystem["🎨 CommonGround Design Token System"]
        Tokens["index.css\nCustom CSS Properties"]
        Neutral["Monochrome Core\n88% Neutral Canvas"]
        Accents["Vivid Accents\n12% Hand-Drawn Highlights"]
        Typography["Typography\nInter (Grid) + Caveat (Hand)"]
    end

    subgraph VisualMotifs["✏️ Hand-Drawn Motifs"]
        Chess["♟️ Chessboard Pattern\n(Common Ground)"]
        Sunflower["🌻 Sunflower Bloom\n(Discovery & Growth)"]
        Stairs["🪜 Stairs\n(Progression Steps)"]
        Smiley["😊 Smiley Faces\n(Human Warmth)"]
    end

    Tokens --> Neutral
    Tokens --> Accents
    Tokens --> Typography
    Neutral --> VisualMotifs
    Accents --> VisualMotifs

    style Tokens fill:#FFD43B,stroke:#191919,stroke-width:2px,color:#111
    style Neutral fill:#F7F6F2,stroke:#191919,stroke-width:2px
    style Accents fill:#FF72B6,stroke:#191919,stroke-width:2px,color:#111
```

### 📊 Color Balance Visualizer

```
CANVAS NEUTRAL (88%):  [██████████████████████████████████████████] #F7F6F2 / #0D0D0D
ACCENT MARKERS (12%):  [█████] #FFD43B | #4D7CFE | #FF72B6 | #5BCB77 | #FF914D
```

---

## 📊 Category & Hobby Breakdown

```
Creative     [████████████████████] 7 Hobbies  (Photography, Pottery, Film, Drawing, Writing, Fashion, Calligraphy)
Fitness      [█████████] 3 Hobbies             (Running, Bouldering, Cycling)
Lifestyle    [██████] 2 Hobbies                (Cooking, Gardening)
Music        [███] 1 Hobby                     (Guitar)
Tech         [███] 1 Hobby                     (AI & Machine Learning)
Performance  [███] 1 Hobby                     (Dance)
Strategy     [███] 1 Hobby                     (Chess)
Entertainment[███] 1 Hobby                     (Gaming)
Making       [███] 1 Hobby                     (Woodworking)
Science      [███] 1 Hobby                     (Astronomy)
Sports       [███] 1 Hobby                     (Skateboarding)
```

---

## ⚙️ System Architecture

```mermaid
graph LR
    subgraph UI["🖥️ UI Layer (React 19)"]
        Pages["Pages\n(Landing, Onboarding, Ground, Explore, Community, Profile)"]
        Components["Components\n(HobbyDeck, DepthCarousel, ChessPattern, Sunflower)"]
        Layout["Layout Shell\n(Navbar, BottomNav, PageCanvas)"]
    end

    subgraph Motion["✨ Motion & Animation Engine"]
        FM["Framer Motion 13\n(Gesture physics, LayoutId)"]
        GSAP["GSAP 3\n(Complex animations)"]
        Lenis["Lenis\n(Smooth Scrolling)"]
    end

    subgraph State["💾 State & Data"]
        MockData["Mock Data Engine\n(Hobbies, Communities, Posts, Users)"]
        ThemeHook["useTheme\n(Data-Theme Switcher)"]
        LocalStore["LocalStorage\n(Saved Interests & Preferences)"]
    end

    UI <--> Motion
    UI <--> State

    style UI fill:#4D7CFE,stroke:#191919,stroke-width:2px,color:#fff
    style Motion fill:#9B72FF,stroke:#191919,stroke-width:2px,color:#fff
    style State fill:#5BCB77,stroke:#191919,stroke-width:2px,color:#111
```

---

## 🔄 Card Swipe State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Deck Loaded
    Idle --> Dragging: Pointer/Touch Down
    Dragging --> Idle: Released below threshold
    Dragging --> SwipedRight: Dragged Right (> 120px)
    Dragging --> SwipedLeft: Dragged Left (< -120px)
    SwipedRight --> AddInterest: Save to Local State
    SwipedLeft --> NextCard: Advance Index
    AddInterest --> NextCard: Advance Index
    NextCard --> Idle: Cards Remaining
    NextCard --> SunflowerBloom: Deck Complete
    SunflowerBloom --> GroundRedirect: Navigate to /ground
```

---

## ⚖️ CommonGround vs Traditional Platforms

```mermaid
quadrantChart
    title Platform Comparison Matrix
    x-axis Low Community Intent --> High Community Intent
    y-axis Vanity & Metrics --> Shared Interests & Doing
    quadrant-1 CommonGround Target Zone
    quadrant-2 Content Consumption
    quadrant-3 Broadcast Noise
    quadrant-4 Discussion Boards
    "Instagram": [0.2, 0.85]
    "TikTok": [0.15, 0.95]
    "Reddit": [0.65, 0.35]
    "Meetup": [0.75, 0.6]
    "CommonGround": [0.9, 0.9]
```

---

## 📁 Detailed Codebase Architecture

```
src/
├── animations/
│   └── variants.js          # Centralized spring & fade animation presets
├── components/
│   ├── CardSwap/            # Interactive card swap primitives
│   ├── common/              # System-wide atomic components
│   │   ├── Button            # Primary, Secondary & Ghost buttons
│   │   ├── ChessPattern      # ♟️ Chessboard grid background
│   │   ├── DepthCarousel     # 3D depth carousel
│   │   ├── FlowingMenu       # Dynamic interactive menu
│   │   ├── InteractiveCheckerboard  # Playful hover grid
│   │   ├── InterestTag       # Colored hobby pill tags
│   │   ├── ScrollStack       # Scroll-driven stack effect
│   │   ├── SketchArrow       # SVG hand-drawn arrows
│   │   ├── Smiley            # 😊 Hand-drawn smileys
│   │   ├── Stepper           # Interactive step indicators
│   │   ├── Sunflower         # 🌻 Blooming sunflower illustration
│   │   ├── SunflowerGroup    # Multi-flower illustration scene
│   │   ├── SunflowerMascot   # Interactive sunflower mascot
│   │   └── TextLoop          # Smooth marquee text loops
│   ├── hobby/               # Onboarding deck components
│   │   ├── HobbyCard         # Gesture-enabled card UI
│   │   ├── HobbyDeck         # Stack physics & gesture handler
│   │   └── SwipeControls     # Pass / Interested button row
│   ├── landing/             # Landing page sections
│   │   ├── CommonGroundMerge # Visual merging interest graphic
│   │   ├── CommunityFloat    # Floating community cards showcase
│   │   ├── FinalCTA          # Call-to-action banner
│   │   ├── HobbyCardStack    # Landing card stack preview
│   │   ├── HobbyCloud        # Floating hobby pill cloud
│   │   ├── HobbyPath         # Illustrated journey path
│   │   ├── LandingJourney    # Visual step progression
│   │   ├── RabbitHole        # Deep-dive discovery section
│   │   └── SurpriseMe        # Random hobby generator
│   └── layout/              # App framework
│       ├── BottomNav         # Floating dock for mobile/desktop
│       ├── Footer            # Project footer
│       ├── Navbar            # Top navigation & theme toggle
│       └── PageCanvas        # Responsive canvas wrapper
├── data/                    # Local mock database
│   ├── communities.js       # Community hubs & posts
│   ├── hobbies.js           # 20 curated hobbies across 11 categories
│   ├── posts.js             # Discussion threads & showcases
│   └── users.js             # Mock student profiles
├── hooks/
│   └── useTheme.js          # Persistent dark/light theme switcher
├── pages/                   # Top-level view routes
│   ├── Landing.jsx          # Front door landing page
│   ├── Onboarding.jsx       # Swipe deck hobby selection
│   ├── Ground.jsx           # Personalized feed & interest hub
│   ├── Explore.jsx          # Category directory & discovery
│   ├── Community.jsx        # Dedicated community page
│   ├── CreatePost.jsx       # Thread/post creation tool
│   └── Profile.jsx          # User interest profile
├── App.jsx                  # React Router + AnimatePresence shell
├── index.css                # Global design system & tokens
└── main.jsx                 # Application entry point
```

---

## ⚡ Quick Start

```bash
# 1. Clone repo
git clone https://github.com/your-username/common-ground.git
cd common-ground

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Lint codebase
npm run lint

# 5. Build for production
npm run build
```

---

<div align="center">

**CommonGround** — *Find your people, not just hobbies.*

🌻 ♟️ 😊

</div>
