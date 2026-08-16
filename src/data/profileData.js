export const profileData = {
  name: "Elizabeth",
  role: "Explorer • Lifelong Learner ✨",
  bio: "I love discovering new things, meeting new people and making everyday a little more meaningful!",
  location: "Chandigarh, India",
  website: "user.dev",
  joined: "Joined May 2025",

  stats: {
    communities: 32,
    hobbies: 18,
    connections: 126,
    events: 47,
    badges: 8
  },

  aboutMe: {
    description: "Hey! I'm Elizabeth. I spend most of my time tinkering with new technologies, taking photos of streets, and learning to play acoustic versions of my favorite songs. I believe the best way to grow is to stay curious and never stop learning.",
    interests: ["Photography", "Guitar", "Pottery", "Cooking", "Astronomy"]
  },

  hobbies: [
    {
      id: "photography",
      name: "Photography",
      description: "Capturing moments, telling stories.",
      emoji: "📸",
      color: "var(--blue)"
    },
    {
      id: "guitar",
      name: "Guitar",
      description: "Strings, melodies & good vibes.",
      emoji: "🎸",
      color: "var(--orange)"
    },
    {
      id: "pottery",
      name: "Pottery",
      description: "Shaping clay, shaping thoughts.",
      emoji: "🏺",
      color: "var(--pink)"
    }
  ],

  activities: [
    {
      id: 1,
      type: "post",
      community: "Street Photography",
      title: "My first time shooting black & white film! Here is what I learned.",
      timestamp: "2 hours ago",
      replies: 12
    },
    {
      id: 2,
      type: "reply",
      community: "Acoustic Sessions",
      title: "Replied to: 'Any tips on mastering F major barre chord?'",
      timestamp: "Yesterday",
      replies: 4
    },
    {
      id: 3,
      type: "post",
      community: "Student Chefs",
      title: "Quick 15-minute healthy meals for busy weekdays",
      timestamp: "3 days ago",
      replies: 28
    }
  ],

  badges: [
    {
      id: "pioneer",
      name: "Pioneer",
      description: "Joined in the first wave of explorers.",
      emoji: "🚀",
      color: "var(--purple)"
    },
    {
      id: "creator",
      name: "Super Creator",
      description: "Published 10 high-quality posts.",
      emoji: "🎨",
      color: "var(--yellow)"
    },
    {
      id: "connector",
      name: "Super Connector",
      description: "Made over 100 mutual connections.",
      emoji: "🤝",
      color: "var(--green)"
    },
    {
      id: "streaker",
      name: "Weekly Streak",
      description: "Active 7 days in a row.",
      emoji: "🔥",
      color: "var(--red)"
    }
  ],

  achievements: [
    {
      id: "1",
      title: "First Wave",
      description: "Early community member status.",
      icon: "Sparkles",
      color: "var(--yellow)"
    },
    {
      id: "2",
      title: "Talk of the Town",
      description: "Got featured on trending discussions.",
      icon: "Flame",
      color: "var(--orange)"
    },
    {
      id: "3",
      title: "Master Chef",
      description: "Won the weekly recipe challenge.",
      icon: "Award",
      color: "var(--pink)"
    }
  ],

  connections: [
    {
      name: "Aarav Sharma",
      role: "Designer & Writer",
      avatarEmoji: "🎨",
      avatarColor: "var(--pink)",
      mutualCount: 12
    },
    {
      name: "Meera Nair",
      role: "Film Lover & Cyclist",
      avatarEmoji: "🚴",
      avatarColor: "var(--blue)",
      mutualCount: 8
    },
    {
      name: "Kabir Verma",
      role: "Tech Enthusiast",
      avatarEmoji: "💻",
      avatarColor: "var(--green)",
      mutualCount: 15
    }
  ],

  completionItems: [
    {
      id: "bio",
      task: "Add a bio",
      completed: true
    },
    {
      id: "hobbies",
      task: "Select your top hobbies",
      completed: true
    },
    {
      id: "avatar",
      task: "Upload a custom avatar",
      completed: false
    },
    {
      id: "connection",
      task: "Make your first connection",
      completed: true
    },
    {
      id: "post",
      task: "Write a post in a community",
      completed: false
    }
  ],

  vibe: {
    badge: "Curious Explorer",
    color: "var(--purple)",
    emoji: "🧭",
    hobbies: ["Aesthetics", "Melodies", "Crafts"]
  }
};
