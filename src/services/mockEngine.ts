import type {
  Activity,
  AssignmentSource,
  Child,
  ChildAnalytics,
  DashboardSummary,
  Exercise,
  Game,
  Level,
  PhonemeStats,
  RegisterGameInput,
  SessionRecord,
  User,
} from "@/types/engine";

function iso(offsetDays = 0, hours = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
}

const users: User[] = [
  { id: "u1", name: "Dr. Amara Singh", email: "amara@phonemica.io", role: "therapist", organization: "Child Speech Clinic", status: "active", createdAt: iso(120), therapistChildrenIds: ["c1", "c2", "c3", "c4", "c5"] },
  { id: "u2", name: "Steve Okafor", email: "steve@phonemica.io", role: "admin", status: "active", createdAt: iso(200), therapistChildrenIds: [] },
  { id: "u3", name: "Layla Haddad", email: "layla@phonemica.io", role: "therapist", organization: "Bright Voices", status: "active", createdAt: iso(90), therapistChildrenIds: ["c6", "c7", "c8"] },
  { id: "u4", name: "Maria Gomez", email: "maria.gomez@gmail.com", role: "parent", status: "active", createdAt: iso(60), parentChildrenIds: ["c1", "c6"] },
  { id: "u5", name: "Rahul Verma", email: "rahul.verma@gmail.com", role: "parent", status: "active", createdAt: iso(45), parentChildrenIds: ["c2"] },
  { id: "u6", name: "Tariq Nasir", email: "tariq@phonemica.io", role: "therapist", organization: "Child Speech Clinic", status: "pending", createdAt: iso(5), therapistChildrenIds: [] },
];

const GAMES: Game[] = [
  {
    id: "g1", name: "Jungle Quest", shortId: "jungle-quest",
    description: "Magical jungle exploration where speech exercises move your explorer through trails.",
    developer: "Phonemica", version: "1.2.0", status: "active", ageRangeMin: 5, ageRangeMax: 8,
    capabilities: { exerciseTypes: ["picture_naming", "word_repetition", "minimal_pair", "sound_identification"], positions: ["initial", "medial", "final"], difficultyMin: 1, difficultyMax: 10 },
    mechanics: ["Movement", "Collection"], theme: "Jungle Adventure", wordStyle: "Animal & Nature",
    preferredContent: "animal words", mediaTypes: ["image", "audio"], levelCount: 9, exerciseCount: 42,
    generatedAt: iso(30), connectedChildren: 42, sessions: 612, apiKey: "pk_jungle_****3f2a",
  },
  {
    id: "g2", name: "Cosmic Rescue", shortId: "cosmic-rescue",
    description: "Space exploration where correct pronunciation powers your ship across the galaxy.",
    developer: "Phonemica", version: "1.0.0", status: "active", ageRangeMin: 5, ageRangeMax: 9,
    capabilities: { exerciseTypes: ["picture_naming", "word_repetition", "sound_identification"], positions: ["initial", "final"], difficultyMin: 1, difficultyMax: 7 },
    mechanics: ["Resource", "Energy"], theme: "Space Exploration", wordStyle: "Objects",
    preferredContent: "space & object words", mediaTypes: ["image", "audio"], levelCount: 7, exerciseCount: 31,
    generatedAt: iso(21), connectedChildren: 31, sessions: 489, apiKey: "pk_cosmic_****8b1c",
  },
  {
    id: "g3", name: "Tracker Park", shortId: "tracker-park",
    description: "A minigame collection for phoneme screening across many ages.",
    developer: "Phonemica Lab", version: "0.8.0", status: "testing", ageRangeMin: 4, ageRangeMax: 10,
    capabilities: { exerciseTypes: ["picture_naming", "sound_identification"], positions: ["initial"], difficultyMin: 1, difficultyMax: 5 },
    mechanics: ["Multiple Choice"], theme: "Park", wordStyle: "Everyday", preferredContent: "early words",
    mediaTypes: ["image"], levelCount: 4, exerciseCount: 18, connectedChildren: 12, sessions: 103,
    apiKey: "pk_tracker_****d09e",
  },
];

const children: Child[] = [
  { id: "c1", name: "Mina Khan", age: 6, gender: "female", parentUserId: "u4", therapistUserId: "u1", assessmentStatus: "diagnosed", createdAt: iso(40), targets: [{ phoneme: "/r/", source: "diagnosed", note: "substitution /r/ → /w/" }, { phoneme: "/th/", source: "declared" }], assignments: [
    { gameId: "g1", source: "engine", reason: "target /r/ matched · supports picture_naming", assignedAt: iso(20), active: true },
    { gameId: "g2", source: "engine", reason: "target /th/ matched · initial+final supported", assignedAt: iso(20), active: true },
  ] },
  { id: "c2", name: "Leo Martin", age: 7, gender: "male", parentUserId: "u5", therapistUserId: "u1", assessmentStatus: "declared", createdAt: iso(35), targets: [{ phoneme: "/s/", source: "declared" }], assignments: [
    { gameId: "g1", source: "engine", reason: "target /s/ matched", assignedAt: iso(18), active: true },
  ] },
  { id: "c3", name: "Ava Torres", age: 5, gender: "female", therapistUserId: "u1", assessmentStatus: "pending", createdAt: iso(10), targets: [], assignments: [
    { gameId: "g1", source: "engine", reason: "assessment pending · screen on first session", assignedAt: iso(9), active: true },
  ] },
  { id: "c4", name: "Noah Chen", age: 8, gender: "male", therapistUserId: "u1", assessmentStatus: "diagnosed", createdAt: iso(50), targets: [{ phoneme: "/k/", source: "diagnosed" }, { phoneme: "/g/", source: "declared" }], assignments: [
    { gameId: "g2", source: "engine", reason: "target /k/ matched", assignedAt: iso(20), active: true },
  ] },
  { id: "c5", name: "Zara Ali", age: 6, gender: "female", therapistUserId: "u1", assessmentStatus: "declared", createdAt: iso(28), targets: [{ phoneme: "/ʃ/", source: "declared" }], assignments: [
    { gameId: "g1", source: "admin", reason: "therapist manual override", assignedAt: iso(12), active: true },
  ] },
  { id: "c6", name: "Ezra Bell", age: 5, gender: "male", parentUserId: "u4", therapistUserId: "u3", assessmentStatus: "diagnosed", createdAt: iso(45), targets: [{ phoneme: "/r/", source: "diagnosed" }], assignments: [
    { gameId: "g2", source: "engine", reason: "target /r/ matched", assignedAt: iso(19), active: true },
  ] },
  { id: "c7", name: "Rosa Diaz", age: 7, gender: "female", therapistUserId: "u3", assessmentStatus: "diagnosed", createdAt: iso(32), targets: [{ phoneme: "/θ/", source: "diagnosed" }, { phoneme: "/ð/", source: "diagnosed" }], assignments: [
    { gameId: "g1", source: "engine", reason: "target /θ/ matched", assignedAt: iso(15), active: true },
  ] },
  { id: "c8", name: "Finn O'Brien", age: 6, gender: "male", therapistUserId: "u3", assessmentStatus: "pending", createdAt: iso(6), targets: [], assignments: [
    { gameId: "g1", source: "engine", reason: "assessment pending", assignedAt: iso(5), active: true },
  ] },
];

function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildAnalytics(childId: string): ChildAnalytics {
  const child = children.find((c) => c.id === childId)!;
  const phonemes = child.targets.length ? child.targets.map((t) => t.phoneme) : ["/r/", "/s/", "/th/", "/k/"];
  const rand = rng(childId.length * 7 + 3);

  const perPhoneme: PhonemeStats[] = phonemes.map((p) => {
    const base = 0.35 + rand() * 0.6;
    const attempts = 8 + Math.floor(rand() * 40);
    const correct = Math.round(attempts * base);
    const accuracy = Math.round((correct / attempts) * 100);
    const trendVal = rand();
    const trend = trendVal > 0.66 ? "improving" : trendVal > 0.33 ? "stable" : "declining";
    const mastery = accuracy >= 85 ? "mastered" : accuracy >= 60 ? "developing" : "needs_practice";
    return { phoneme: p, accuracy, attempts, correct, errorRate: 100 - accuracy, trend, mastery };
  });

  const errorTypes = ["substitution", "omission", "distortion", "none"] as const;
  const errorDistribution = errorTypes.map((et) => {
    let count: number;
    if (et === "substitution") count = Math.floor(rand() * 60) + 20;
    else if (et === "omission") count = Math.floor(rand() * 25);
    else if (et === "distortion") count = Math.floor(rand() * 20);
    else count = Math.floor(rand() * 15);
    return { errorType: et as typeof et, count };
  });

  const positionBreakdown = (["initial", "medial", "final"] as const).map((pos) => ({
    position: pos,
    accuracy: Math.round(30 + rand() * 65),
    attempts: 10 + Math.floor(rand() * 30),
  }));

  const sessions: SessionRecord[] = [];
  for (let i = 0; i < 12; i++) {
    sessions.push({
      id: `s${i}`,
      childId,
      gameId: i % 2 === 0 ? "g1" : "g2",
      date: iso(i, 9 + Math.floor(rand() * 8)),
      accuracy: Math.round(45 + rand() * 55),
      exercises: 8 + Math.floor(rand() * 8),
      isDiagnostic: i === sessions.length - 1,
    });
  }

  const weakest = [...perPhoneme].sort((a, b) => a.accuracy - b.accuracy)[0];
  const recommendation = {
    phoneme: weakest.phoneme,
    recommendedDifficulty: Math.round(weakest.accuracy / 25) / 10 + 0.1,
    recommendedExercise: (weakest.accuracy < 45 ? "picture_naming" : "word_repetition") as "picture_naming" | "word_repetition",
    reason: `${weakest.phoneme} demonstrates persistent ${
      weakest.accuracy < 50 ? "substitution errors" : "inconsistent production"
    } (accuracy ${weakest.accuracy}%). Adaptive engine suggests a controlled target.`,
    source: "adaptive-engine" as const,
  };

  const totals = {
    attempts: perPhoneme.reduce((a, p) => a + p.attempts, 0),
    correct: perPhoneme.reduce((a, p) => a + p.correct, 0),
    sessions: sessions.length,
    exercises: sessions.length * 10,
  };

  return { childId, totals, perPhoneme, errorDistribution, positionBreakdown, sessionHistory: sessions, recommendation };
}

const activity: Activity[] = [
  { id: "a1", type: "session", text: "Mina completed Level 4 in Jungle Quest", timestamp: iso(0, 11) },
  { id: "a2", type: "diagnostic", text: "Ava finished diagnostic screen — targets diagnosed", timestamp: iso(0, 9) },
  { id: "a3", type: "game_registered", text: "Game 'Tracker Park' registered (testing)", timestamp: iso(2) },
  { id: "a4", type: "child_registered", text: "New child Finn O'Brien onboarded", timestamp: iso(3) },
  { id: "a5", type: "assignment", text: "Engine auto-assigned Cosmic Rescue to Noah", timestamp: iso(1) },
  { id: "a6", type: "user_added", text: "Therapist Tariq Nasir invited", timestamp: iso(5) },
  { id: "a7", type: "session", text: "Leo completed Level 2 in Jungle Quest", timestamp: iso(1, 15) },
];

const levels: Record<string, Level[]> = {};

const PHONEME_NAMES: Record<string, string> = {
  "/r/": "Labio-alveolar approximant",
  "/s/": "Voiceless alveolar fricative",
  "/th/": "Voiceless dental fricative",
  "/k/": "Voiceless velar plosive",
  "/g/": "Voiced velar plosive",
  "/ʃ/": "Voiceless postalveolar fricative",
  "/θ/": "Voiceless dental fricative",
  "/ð/": "Voiced dental fricative",
  "/l/": "Alveolar lateral approximant",
};

const CONTENT_BANK = [
  { phoneme: "/r/", words: ["rabbit", "robot", "rainbow", "rocket", "ring", "river"], position: "initial", difficulty: 0.2 },
  { phoneme: "/r/", words: ["car", "star", "bear", "pear"], position: "final", difficulty: 0.4 },
  { phoneme: "/s/", words: ["sun", "sand", "seven", "spoon", "star", "seat"], position: "initial", difficulty: 0.3 },
  { phoneme: "/s/", words: ["bus", "house", "mouse", "dress"], position: "final", difficulty: 0.5 },
  { phoneme: "/th/", words: ["three", "thumb", "thorn", "think", "thirsty"], position: "initial", difficulty: 0.4 },
  { phoneme: "/k/", words: ["cat", "cake", "kite", "car", "key", "cup"], position: "initial", difficulty: 0.3 },
  { phoneme: "/g/", words: ["goat", "gate", "gift", "goose", "garden"], position: "initial", difficulty: 0.4 },
  { phoneme: "/ʃ/", words: ["ship", "shoe", "shark", "sheep", "shell"], position: "initial", difficulty: 0.5 },
  { phoneme: "/θ/", words: ["thumb", "theater", "thousand", "throne"], position: "initial", difficulty: 0.6 },
  { phoneme: "/ð/", words: ["this", "that", "mother", "father", "feather"], position: "medial", difficulty: 0.6 },
  { phoneme: "/l/", words: ["lion", "leaf", "lamp", "ladder", "lock", "lunch"], position: "initial", difficulty: 0.3 },
] as const;

const EXERCISE_TEMPLATES: Record<string, { prompt: (w: string) => string }> = {
  picture_naming: { prompt: (w) => `Look at the picture and say “${w}”.` },
  word_repetition: { prompt: (w) => `Listen and repeat “${w}”.` },
  minimal_pair: { prompt: (w) => `Say “${w}” — which word is different?` },
  sound_identification: { prompt: (w) => `Find the sound in “${w}”.` },
};

GAMES.forEach((game) => {
  const list: Level[] = [];
  const count = Math.min(game.levelCount, 9);
  for (let i = 0; i < count; i++) {
    const diff = game.capabilities.difficultyMin + (i / Math.max(count - 1, 1)) * (game.capabilities.difficultyMax - game.capabilities.difficultyMin);
    const eCount = 5 + (i % 3);
    list.push({
      id: `${game.id}-lv${i + 1}`,
      gameId: game.id,
      index: i + 1,
      title: `Level ${i + 1}`,
      difficulty: Math.round(diff * 100) / 100,
      exerciseIds: Array.from({ length: eCount }, (_, k) => `${game.id}-ex-${i}-${k}`),
    });
  }
  levels[game.id] = list;
});

const attemptsCache = new Map<string, ChildAnalytics>();

export const mockEngine = {
  getDashboard(): DashboardSummary {
    return {
      totals: {
        children: children.length,
        games: GAMES.filter((g) => g.status === "active").length,
        users: users.filter((u) => u.status === "active").length,
        sessions: GAMES.reduce((a, g) => a + g.sessions, 0),
        exercises: GAMES.reduce((a, g) => a + g.exerciseCount, 0),
      },
      engineHealth: [
        { name: "Speech AI", status: "operational", detail: "Wav2Vec2 2.0 · online" },
        { name: "Adaptive Engine", status: "operational", detail: "last decision 4s ago" },
        { name: "Exercise Engine", status: "operational", detail: "pool generated" },
        { name: "Analytics Engine", status: "degraded", detail: "~2m backlog" },
        { name: "API", status: "operational", detail: "99.9% uptime" },
      ],
      recentActivity: [...activity],
      phonemePerformance: [
        { phoneme: "/r/", accuracy: 46 },
        { phoneme: "/s/", accuracy: 82 },
        { phoneme: "/th/", accuracy: 61 },
        { phoneme: "/k/", accuracy: 74 },
        { phoneme: "/ʃ/", accuracy: 58 },
      ],
      childrenByGame: [
        { game: "Jungle Quest", value: 42 },
        { game: "Cosmic Rescue", value: 31 },
        { game: "Tracker Park", value: 12 },
      ],
    };
  },

  getUsers(): User[] {
    return users;
  },
  getUser(id: string): User | undefined {
    return users.find((u) => u.id === id);
  },
  createUser(input: Omit<User, "id" | "createdAt">): User {
    const u: User = { ...input, id: `u${users.length + 1}`, createdAt: iso(0) };
    users.push(u);
    activity.unshift({ id: `a${activity.length + 1}`, type: "user_added", text: `${u.role} ${u.name} added`, timestamp: iso(0) });
    return u;
  },
  updateUser(id: string, patch: Partial<User>): User {
    const i = users.findIndex((u) => u.id === id);
    users[i] = { ...users[i], ...patch };
    return users[i];
  },

  getChildren(): Child[] {
    return children;
  },
  getChild(id: string): Child | undefined {
    return children.find((c) => c.id === id);
  },
  createChild(input: Omit<Child, "id" | "createdAt">): Child {
    const c: Child = { ...input, id: `c${children.length + 1}`, createdAt: iso(0) };
    children.push(c);
    if (c.assessmentStatus === "pending") {
      c.assignments = [{ gameId: "g1", source: "engine", reason: "assessment pending · screen on first session", assignedAt: iso(0), active: true }];
    } else if (c.targets.length) {
      const g = GAMES.find((x) => x.status === "active");
      if (g) c.assignments = [{ gameId: g.id, source: "engine", reason: `target matched · auto-assigned`, assignedAt: iso(0), active: true }];
    }
    activity.unshift({ id: `a${activity.length + 1}`, type: "child_registered", text: `New child ${c.name} onboarded`, timestamp: iso(0) });
    return c;
  },
  setAssessmentDiagnosed(childId: string, phonemes: string[]): Child {
    const c = this.getChild(childId)!;
    c.assessmentStatus = "diagnosed";
    c.targets = phonemes.map((p) => ({ phoneme: p, source: "diagnosed" }));
    const g = GAMES.find((x) => x.status === "active");
    if (g && !c.assignments.some((a) => a.gameId === g.id)) {
      c.assignments.push({ gameId: g.id, source: "engine", reason: `diagnosed targets matched`, assignedAt: iso(0), active: true });
    }
    return c;
  },
  assignGame(childId: string, gameId: string, source: AssignmentSource, reason?: string): Child {
    const c = this.getChild(childId)!;
    if (!c.assignments.some((a) => a.gameId === gameId)) {
      c.assignments.push({ gameId, source, reason: reason ?? (source === "engine" ? "matched target · auto-assigned" : "manual override"), assignedAt: iso(0), active: true });
    }
    return c;
  },
  removeGameAssignment(childId: string, gameId: string): Child {
    const c = this.getChild(childId)!;
    c.assignments = c.assignments.filter((a) => a.gameId !== gameId);
    return c;
  },
  setGameAssignmentActive(childId: string, gameId: string, active: boolean): Child {
    const c = this.getChild(childId)!;
    const a = c.assignments.find((x) => x.gameId === gameId);
    if (a) a.active = active;
    return c;
  },
  regenerateAssignment(childId: string): Child {
    const c = this.getChild(childId)!;
    const active = GAMES.filter((g) => g.status === "active");
    c.assignments = active.map((g, i) => ({ gameId: g.id, source: "engine", reason: `regenerated · target-matched #${i + 1}`, assignedAt: iso(0), active: true }));
    return c;
  },

  getGames(): Game[] {
    return GAMES;
  },
  getGame(id: string): Game | undefined {
    return GAMES.find((g) => g.id === id);
  },
  getLevels(gameId: string): Level[] {
    return levels[gameId] ?? [];
  },
  registerGame(input: RegisterGameInput): Game {
    const id = `g${GAMES.length + 1}`;
    const short = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const g: Game = {
      id,
      name: input.name,
      shortId: short,
      description: input.description,
      developer: input.developer,
      version: input.version,
      status: "testing",
      ageRangeMin: input.ageRangeMin,
      ageRangeMax: input.ageRangeMax,
      capabilities: {
        exerciseTypes: input.exerciseTypes,
        positions: input.positions,
        difficultyMin: input.difficultyMin,
        difficultyMax: input.difficultyMax,
      },
      mechanics: input.mechanics,
      theme: input.theme,
      wordStyle: input.wordStyle,
      preferredContent: input.preferredContent,
      mediaTypes: input.mediaTypes,
      levelCount: 0,
      exerciseCount: 0,
      connectedChildren: 0,
      sessions: 0,
      apiKey: `pk_${short}_****${Math.random().toString(16).slice(2, 6)}`,
    };
    GAMES.push(g);
    return g;
  },
  generateContent(gameId: string): { levels: number; exercises: number; generatedAt: string } {
    const g = this.getGame(gameId)!;
    const levelsCount = Math.max(5, Math.min(10, Math.round((g.capabilities.difficultyMax - g.capabilities.difficultyMin) * 1.5)));
    const typesCount = Math.max(1, g.capabilities.exerciseTypes.length);
    const positionsCount = Math.max(1, g.capabilities.positions.length);
    const exercises = levelsCount * 5 * Math.max(2, typesCount * positionsCount);
    g.levelCount = levelsCount;
    g.exerciseCount = exercises;
    g.generatedAt = iso(0);
    const list: Level[] = [];
    for (let i = 0; i < levelsCount; i++) {
      list.push({ id: `${gameId}-lv${i + 1}`, gameId, index: i + 1, title: `Level ${i + 1}`, difficulty: Math.round((g.capabilities.difficultyMin + (i / Math.max(levelsCount - 1, 1)) * (g.capabilities.difficultyMax - g.capabilities.difficultyMin)) * 100) / 100, exerciseIds: [] });
    }
    levels[gameId] = list;
    return { levels: levelsCount, exercises, generatedAt: iso(0) };
  },
  updateGame(id: string, patch: Partial<Game>): Game {
    const i = GAMES.findIndex((g) => g.id === id);
    GAMES[i] = { ...GAMES[i], ...patch };
    return GAMES[i];
  },

  getAnalytics(childId: string): ChildAnalytics {
    if (!attemptsCache.has(childId)) attemptsCache.set(childId, buildAnalytics(childId));
    return attemptsCache.get(childId)!;
  },

  getUserName(id?: string): string {
    if (!id) return "—";
    return users.find((u) => u.id === id)?.name ?? "—";
  },
  getGameName(id: string): string {
    return GAMES.find((g) => g.id === id)?.name ?? id;
  },

  getContentBank(): { phoneme: string; words: readonly string[]; position: string; difficulty: number }[] {
    return [...CONTENT_BANK].map((c) => ({ ...c }));
  },
  getPhonemeInfo(): { phoneme: string; name: string; occurrences: number }[] {
    return Object.keys(PHONEME_NAMES).map((p) => ({
      phoneme: p,
      name: PHONEME_NAMES[p],
      occurrences: CONTENT_BANK.filter((c) => c.phoneme === p).reduce((a, c) => a + c.words.length, 0),
    }));
  },
  getExercises(limit = 24): Exercise[] {
    const pool: Exercise[] = [];
    GAMES.forEach((game) => {
      game.capabilities.exerciseTypes.forEach((type, ti) => {
        CONTENT_BANK.slice(0, 12).forEach((c, ci) => {
          if (!game.capabilities.positions.includes(c.position as never)) return;
          const word = c.words[(ti + ci) % c.words.length];
          const diff = Math.min(game.capabilities.difficultyMax, Math.max(game.capabilities.difficultyMin, c.difficulty * 10));
          pool.push({
            id: `${game.id}-ex-${ti}-${ci}`,
            type,
            targetPhoneme: c.phoneme,
            word,
            difficulty: Math.round(diff * 100) / 100,
            position: c.position as Exercise["position"],
            prompt: EXERCISE_TEMPLATES[type].prompt(word),
            media: { imageUrl: undefined, audioUrl: undefined },
            levelId: game.id,
          });
        });
      });
    });
    return pool.slice(0, limit);
  },
  getExerciseCount(): number {
    return CONTENT_BANK.reduce((a, c) => a + c.words.length, 0) * GAMES.length;
  },
  getGameCopy(gameId: string): { about: string; how: string; forWho: string } {
    const g = this.getGame(gameId);
    return {
      about: g?.description ?? "A Phonemica Engine game.",
      how: `Children practise target sounds through ${(g?.capabilities.exerciseTypes ?? []).map((t) => t.replace("_", " ")).join(", ")} while playing ${g?.mechanics.join(" and ") ?? "a game"}. The engine adapts difficulty live to keep it challenging yet winnable for ages ${g?.ageRangeMin}–${g?.ageRangeMax}.`,
      forWho: `Best for early learners (${g?.ageRangeMin}–${g?.ageRangeMax}) targeting ${g?.wordStyle.toLowerCase()} vocabulary. Perfect for ${g?.ageRangeMin === 5 ? "kindergarten " : ""}speech therapy practice.`,
    };
  },
};
