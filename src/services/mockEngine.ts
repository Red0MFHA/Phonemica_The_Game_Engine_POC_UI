import type {
  Activity,
  AssignmentSource,
  Attempt,
  Child,
  ChildAnalytics,
  DashboardSummary,
  ErrorType,
  Exercise,
  ExerciseType,
  Game,
  Level,
  PhonemeStats,
  RegisterGameInput,
  SessionRecord,
  TherapyPhase,
  User,
} from "@/types/engine";
import type { AuthSession } from "@/lib/auth";
import { loadEngineSettings } from "@/lib/engineSettings";
import { readSharedStore } from "@/lib/sharedStore";

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
    description: "Sound Island therapy loop: Echo Cave isolation, Drum Bridge mass practice, Twin Falls discrimination, Hidden Grove word hunt, Story Fire storytelling.",
    developer: "Phonemica", version: "1.2.0", status: "active", ageRangeMin: 5, ageRangeMax: 8,
    capabilities: { exerciseTypes: ["isolation", "repetition_drill", "discrimination", "word_hunt", "storytelling"], positions: ["initial", "medial", "final"], difficultyMin: 1, difficultyMax: 10 },
    mechanics: ["Mirror", "Mass practice", "Listen-and-act", "Hide-and-seek", "Story choice"], theme: "Jungle Adventure / Sound Island", wordStyle: "Animal & Nature",
    preferredContent: "animal words · isolation to story loop", mediaTypes: ["image", "audio"], levelCount: 5, exerciseCount: 37,
    generatedAt: iso(30), connectedChildren: 6, sessions: 612, apiKey: "pk_jungle_****3f2a",
  },
  {
    id: "g2", name: "Cosmic Rescue", shortId: "cosmic-rescue",
    description: "Space therapy loop: Signal Bay isolation, Asteroid Hop mass practice, Radar Ping discrimination, Debris Field words, Captain's Log storytelling.",
    developer: "Phonemica", version: "1.2.0", status: "active", ageRangeMin: 5, ageRangeMax: 9,
    capabilities: { exerciseTypes: ["isolation", "repetition_drill", "discrimination", "word_hunt", "storytelling"], positions: ["initial", "medial", "final"], difficultyMin: 1, difficultyMax: 7 },
    mechanics: ["Beacon", "Asteroid hop", "Radar tap", "Shield clear", "Captain's log"], theme: "Space Exploration", wordStyle: "Objects & Space",
    preferredContent: "space words · isolation to story loop", mediaTypes: ["image", "audio"], levelCount: 5, exerciseCount: 29,
    generatedAt: iso(21), connectedChildren: 3, sessions: 489, apiKey: "pk_cosmic_****8b1c",
  },
  {
    id: "g3", name: "Tracker Park", shortId: "tracker-park",
    description: "A minigame collection for phoneme screening across many ages.",
    developer: "Phonemica Lab", version: "0.8.0", status: "testing", ageRangeMin: 4, ageRangeMax: 10,
    capabilities: { exerciseTypes: ["picture_naming", "sound_identification"], positions: ["initial"], difficultyMin: 1, difficultyMax: 5 },
    mechanics: ["Multiple Choice"], theme: "Park", wordStyle: "Everyday", preferredContent: "early words",
    mediaTypes: ["image"], levelCount: 4, exerciseCount: 18, connectedChildren: 0, sessions: 103,
    apiKey: "pk_tracker_****d09e",
  },
];

const children: Child[] = [
  { id: "c1", name: "Mina Khan", age: 6, gender: "female", parentUserId: "u4", therapistUserId: "u1", assessmentStatus: "diagnosed", createdAt: iso(40), targets: [{ phoneme: "/r/", source: "diagnosed", note: "substitution /r/ → /w/" }, { phoneme: "/th/", source: "declared" }], assignments: [
    { gameId: "g1", source: "engine", reason: "target /r/ matched · supports isolation + word_hunt", assignedAt: iso(20), active: true },
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

const WORDS_BY_PH: Record<string, string[]> = {
  "/r/": ["rabbit", "robot", "rocket", "river"],
  "/s/": ["sun", "star", "sand", "spoon"],
  "/th/": ["three", "thumb", "think"],
  "/k/": ["cat", "cake", "kite"],
  "/ʃ/": ["ship", "shoe", "shark"],
  "/θ/": ["thumb", "theater"],
  "/ð/": ["this", "that"],
  "/l/": ["lion", "leaf", "lamp"],
  "/g/": ["goat", "gate"],
};

/** Seeded attempt history — display KPIs derive from these rows, not live RNG. */
const attempts: Attempt[] = [];

function seedAttempts() {
  if (attempts.length) return;
  children.forEach((child, ci) => {
    const phonemes = child.targets.length ? child.targets.map((t) => t.phoneme) : ["/r/", "/s/"];
    const rand = rng(ci * 41 + 11);
    const gameIds = child.assignments.filter((a) => a.active).map((a) => a.gameId);
    const games = gameIds.length ? gameIds : ["g1"];
    for (let i = 0; i < 28 + Math.floor(rand() * 20); i++) {
      const phoneme = phonemes[i % phonemes.length];
      const pool = WORDS_BY_PH[phoneme] ?? ["sound"];
      const word = pool[i % pool.length];
      // Bias /r/ weaker for demo narrative
      let accuracy = 0.45 + rand() * 0.5;
      if (phoneme === "/r/") accuracy -= 0.15;
      if (phoneme === "/s/") accuracy += 0.1;
      accuracy = Math.max(0.18, Math.min(0.97, accuracy));
      const correct = accuracy >= 0.62;
      const errors: ErrorType[] = ["substitution", "omission", "distortion", "addition", "none"];
      attempts.push({
        id: `att-${child.id}-${i}`,
        childId: child.id,
        gameId: games[i % games.length],
        exerciseId: `ex-${child.id}-${i}`,
        phoneme,
        word,
        difficulty: Math.round((0.2 + (i % 7) * 0.1) * 100) / 100,
        position: (["initial", "medial", "final"] as const)[i % 3],
        accuracy: Math.round(accuracy * 100) / 100,
        correct,
        errorType: correct ? "none" : errors[i % 4],
        confidence: 0.55 + accuracy * 0.4,
        date: iso(i % 14, 8 + Math.floor(rand() * 10)),
      });
    }
  });
}

seedAttempts();

function sharedAttemptsForChild(child: Child): Attempt[] {
  const shared = readSharedStore().attempts.filter(
    (a) => a.childId === child.id || (!!a.childName && a.childName === child.name),
  );
  return shared.map((a, i) => ({
    id: a.id || `shared-${child.id}-${i}`,
    childId: child.id,
    gameId: a.gameId || "skin",
    exerciseId: `shared-ex-${i}`,
    phoneme: a.phoneme,
    word: a.word,
    difficulty: 0.4,
    position: "initial" as const,
    accuracy: a.accuracy,
    correct: a.correct,
    errorType: (a.errorType as ErrorType) || (a.correct ? "none" : "substitution"),
    confidence: a.accuracy,
    date: a.date,
  }));
}

function buildAnalytics(childId: string): ChildAnalytics {
  const child = children.find((c) => c.id === childId);
  if (!child) {
    return {
      childId,
      totals: { attempts: 0, correct: 0, sessions: 0, exercises: 0 },
      perPhoneme: [],
      errorDistribution: [],
      positionBreakdown: [],
      sessionHistory: [],
      recommendation: {
        phoneme: "/r/",
        recommendedDifficulty: 0.3,
        recommendedExercise: "isolation",
        reason: "Child not found in Engine roster.",
        source: "adaptive-engine",
      },
    };
  }
  const seeded = attempts.filter((a) => a.childId === childId);
  const live = sharedAttemptsForChild(child);
  const seen = new Set(seeded.map((a) => a.id));
  const rows = [...seeded, ...live.filter((a) => !seen.has(a.id))];
  const phonemeSet = new Set<string>([
    ...child.targets.map((t) => t.phoneme),
    ...rows.map((r) => r.phoneme),
  ]);
  if (!phonemeSet.size) ["/r/", "/s/"].forEach((p) => phonemeSet.add(p));

  const perPhoneme: PhonemeStats[] = Array.from(phonemeSet).map((p) => {
    const subset = rows.filter((r) => r.phoneme === p);
    const n = subset.length || 1;
    const correct = subset.filter((r) => r.correct).length;
    const accuracy = Math.round((correct / n) * 100);
    const mid = Math.floor(subset.length / 2) || 1;
    const first = subset.slice(0, mid);
    const second = subset.slice(mid);
    const a1 = first.length ? first.filter((r) => r.correct).length / first.length : 0.5;
    const a2 = second.length ? second.filter((r) => r.correct).length / second.length : a1;
    const trend = a2 - a1 > 0.08 ? "improving" : a1 - a2 > 0.08 ? "declining" : "stable";
    const mastery = accuracy >= 85 ? "mastered" : accuracy >= 60 ? "developing" : "needs_practice";
    return { phoneme: p, accuracy, attempts: subset.length, correct, errorRate: 100 - accuracy, trend, mastery };
  });

  const errorTypes: ErrorType[] = ["substitution", "omission", "distortion", "addition", "none"];
  const errorDistribution = errorTypes.map((et) => ({
    errorType: et,
    count: rows.filter((r) => r.errorType === et).length,
  }));

  const positionBreakdown = (["initial", "medial", "final"] as const).map((pos) => {
    const subset = rows.filter((r) => r.position === pos);
    const n = subset.length || 1;
    return {
      position: pos,
      accuracy: Math.round((subset.filter((r) => r.correct).length / n) * 100),
      attempts: subset.length,
    };
  });

  // Group attempts into pseudo-sessions by day+game
  const sessionMap = new Map<string, Attempt[]>();
  rows.forEach((a) => {
    const day = a.date.slice(0, 10);
    const key = `${day}:${a.gameId}`;
    const list = sessionMap.get(key) ?? [];
    list.push(a);
    sessionMap.set(key, list);
  });
  const sessions: SessionRecord[] = Array.from(sessionMap.entries())
    .slice(0, 12)
    .map(([key, list], i) => {
      const [date, gameId] = key.split(":");
      const acc = list.reduce((s, a) => s + a.accuracy, 0) / (list.length || 1);
      return {
        id: `s-${childId}-${i}`,
        childId,
        gameId,
        date: list[0]?.date ?? date,
        accuracy: Math.round(acc * 100),
        exercises: list.length,
        isDiagnostic: i === 0 && child.assessmentStatus !== "pending",
      };
    });

  const weakest = [...perPhoneme].sort((a, b) => a.accuracy - b.accuracy)[0] ?? {
    phoneme: "/r/",
    accuracy: 50,
  };
  const stepBack = weakest.accuracy < 55;
  const recommendation = {
    phoneme: weakest.phoneme,
    recommendedDifficulty: Math.round(weakest.accuracy / 25) / 10 + 0.1,
    recommendedExercise: (stepBack ? "isolation" : weakest.accuracy < 70 ? "word_hunt" : "storytelling") as ExerciseType,
    reason: stepBack
      ? `${weakest.phoneme} is weakest in attempt history. Step back to isolation before words.`
      : `${weakest.phoneme} is developing from ${rows.length} recorded attempts. Continue word practice, then storytelling.`,
    source: "adaptive-engine" as const,
  };

  const totals = {
    attempts: rows.length,
    correct: rows.filter((r) => r.correct).length,
    sessions: sessions.length,
    exercises: rows.length,
  };

  const therapyLoop = child.assignments.some((a) => a.gameId === "g1")
    ? {
        phase: (stepBack ? "isolation" : "words") as TherapyPhase,
        campId: stepBack ? "echo-cave" : "hidden-grove",
        campTitle: stepBack ? "Echo Cave" : "Hidden Grove",
      }
    : undefined;

  return { childId, totals, perPhoneme, errorDistribution, positionBreakdown, sessionHistory: sessions, recommendation, therapyLoop };
}

function invalidateAnalytics(childId?: string) {
  if (childId) analyticsCache.delete(childId);
  else analyticsCache.clear();
}

const activity: Activity[] = [
  { id: "a1", type: "session", text: "Mina completed Hidden Grove in Jungle Quest", timestamp: iso(0, 11) },
  { id: "a2", type: "diagnostic", text: "Ava finished diagnostic screen — targets diagnosed", timestamp: iso(0, 9) },
  { id: "a3", type: "game_registered", text: "Game 'Tracker Park' registered (testing)", timestamp: iso(2) },
  { id: "a4", type: "child_registered", text: "New child Finn O'Brien onboarded", timestamp: iso(3) },
  { id: "a5", type: "assignment", text: "Engine auto-assigned Cosmic Rescue (Asteroid Field) to Noah", timestamp: iso(1) },
  { id: "a6", type: "user_added", text: "Therapist Tariq Nasir invited", timestamp: iso(5) },
  { id: "a7", type: "session", text: "Leo cleared Orbit Dock in Cosmic Rescue", timestamp: iso(1, 15) },
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
  { phoneme: "/r/", words: ["rrr"], position: "initial", difficulty: 0.1, type: "isolation" as const },
  { phoneme: "/r/", words: ["rrr"], position: "initial", difficulty: 0.25, type: "repetition_drill" as const },
  { phoneme: "/r/", words: ["rah", "wah"], position: "initial", difficulty: 0.4, type: "discrimination" as const },
  { phoneme: "/r/", words: ["rabbit", "robot", "rainbow", "rocket", "ring", "river"], position: "initial", difficulty: 0.55, type: "word_hunt" as const },
  { phoneme: "/r/", words: ["carrot", "parrot", "berry"], position: "medial", difficulty: 0.62, type: "word_hunt" as const },
  { phoneme: "/r/", words: ["car", "star", "bear"], position: "final", difficulty: 0.7, type: "word_hunt" as const },
  { phoneme: "/r/", words: ["rabbit", "river", "robot", "rocket", "ring", "rainbow", "raccoon", "treasure"], position: "initial", difficulty: 0.8, type: "storytelling" as const },
  { phoneme: "/s/", words: ["sun", "sand", "seven", "spoon", "star", "seat"], position: "initial", difficulty: 0.3, type: "word_hunt" as const },
  { phoneme: "/s/", words: ["bus", "house", "mouse", "dress"], position: "final", difficulty: 0.5, type: "word_hunt" as const },
  { phoneme: "/th/", words: ["three", "thumb", "thorn", "think", "thirsty"], position: "initial", difficulty: 0.4, type: "word_hunt" as const },
  { phoneme: "/k/", words: ["cat", "cake", "kite", "car", "key", "cup"], position: "initial", difficulty: 0.3, type: "word_hunt" as const },
  { phoneme: "/g/", words: ["goat", "gate", "gift", "goose", "garden"], position: "initial", difficulty: 0.4, type: "picture_naming" as const },
  { phoneme: "/ʃ/", words: ["ship", "shoe", "shark", "sheep", "shell"], position: "initial", difficulty: 0.5, type: "picture_naming" as const },
  { phoneme: "/θ/", words: ["thumb", "theater", "thousand", "throne"], position: "initial", difficulty: 0.6, type: "picture_naming" as const },
  { phoneme: "/ð/", words: ["this", "that", "mother", "father", "feather"], position: "medial", difficulty: 0.6, type: "picture_naming" as const },
  { phoneme: "/l/", words: ["lion", "leaf", "lamp", "ladder", "lock", "lunch"], position: "initial", difficulty: 0.3, type: "word_hunt" as const },
] as const;

const EXERCISE_TEMPLATES: Record<string, { prompt: (w: string) => string }> = {
  picture_naming: { prompt: (w) => `Look at the picture and say “${w}”.` },
  word_repetition: { prompt: (w) => `Listen and repeat “${w}”.` },
  minimal_pair: { prompt: (w) => `Say “${w}” — which word is different?` },
  sound_identification: { prompt: (w) => `Find the sound in “${w}”.` },
  isolation: { prompt: () => `Copy the parrot.` },
  repetition_drill: { prompt: () => `Hop the stones — same sound, new pace.` },
  discrimination: { prompt: () => `Wake the rabbit only on the target sound.` },
  word_hunt: { prompt: (w) => `Find and say “${w}”.` },
  storytelling: { prompt: (w) => `Help the story — say “${w}”.` },
};

const JUNGLE_CAMPS: { id: string; title: string; phase: TherapyPhase; type: ExerciseType }[] = [
  { id: "echo-cave", title: "Echo Cave", phase: "isolation", type: "isolation" },
  { id: "drum-bridge", title: "Drum Bridge", phase: "repetition", type: "repetition_drill" },
  { id: "twin-falls", title: "Twin Falls", phase: "discrimination", type: "discrimination" },
  { id: "hidden-grove", title: "Hidden Grove", phase: "words", type: "word_hunt" },
  { id: "story-fire", title: "Story Fire", phase: "story", type: "storytelling" },
];

const COSMIC_SECTORS = [
  { id: "signal-bay", title: "Signal Bay", zone: "📡 Signal Bay" },
  { id: "asteroid-hop", title: "Asteroid Hop", zone: "🪨 Asteroid Hop" },
  { id: "radar-ping", title: "Radar Ping", zone: "🛰️ Radar Ping" },
  { id: "debris-field", title: "Debris Field", zone: "🛡️ Debris Field" },
  { id: "captains-log", title: "Captain's Log", zone: "📒 Captain's Log" },
];

GAMES.forEach((game) => {
  const list: Level[] = [];
  if (game.shortId === "jungle-quest") {
    JUNGLE_CAMPS.forEach((camp, i) => {
      const eCount = camp.type === "repetition_drill" ? 12 : camp.type === "discrimination" ? 10 : camp.type === "word_hunt" ? 6 : camp.type === "isolation" ? 3 : 6;
      list.push({
        id: camp.id,
        gameId: game.id,
        index: i + 1,
        title: camp.title,
        difficulty: Math.round((0.15 + i * 0.15) * 100) / 100,
        phase: camp.phase,
        exerciseIds: Array.from({ length: eCount }, (_, k) => `${camp.id}-ex-${k}`),
      });
    });
  } else if (game.shortId === "cosmic-rescue") {
    COSMIC_SECTORS.forEach((sector, i) => {
      const phaseMap: TherapyPhase[] = ["isolation", "repetition", "discrimination", "words", "story"];
      const eCount = [3, 6, 8, 6, 6][i] ?? 5;
      list.push({
        id: sector.id,
        gameId: game.id,
        index: i + 1,
        title: sector.title,
        difficulty: Math.round((0.15 + i * 0.15) * 100) / 100,
        phase: phaseMap[i],
        exerciseIds: Array.from({ length: eCount }, (_, k) => `${sector.id}-ex-${k}`),
      });
    });
  } else {
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
  }
  levels[game.id] = list;
});

const analyticsCache = new Map<string, ChildAnalytics>();

const exerciseStore: Record<string, Exercise> = {};

const TYPE_POOL: ExerciseType[] = ["picture_naming", "word_repetition", "minimal_pair", "sound_identification", "isolation", "repetition_drill", "discrimination", "word_hunt", "storytelling"];

function buildExerciseForLevel(id: string, level: Level): Exercise {
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const camp = JUNGLE_CAMPS.find((c) => c.id === level.id);
  const cosmic = COSMIC_SECTORS.find((s) => s.id === level.id);
  const cosmicPhaseTypes: Record<string, ExerciseType> = {
    "signal-bay": "isolation",
    "asteroid-hop": "repetition_drill",
    "radar-ping": "discrimination",
    "debris-field": "word_hunt",
    "captains-log": "storytelling",
  };
  const type = camp?.type ?? (cosmic ? cosmicPhaseTypes[cosmic.id] ?? "word_hunt" : TYPE_POOL[seed % 4]);
  const bank =
    CONTENT_BANK.find((c) => c.type === type && c.phoneme === "/r/") ??
    CONTENT_BANK.find((c) => c.phoneme === "/r/") ??
    CONTENT_BANK[seed % CONTENT_BANK.length];
  const word = bank.words[Math.floor(seed / 3) % bank.words.length];
  const cosmicIdx = COSMIC_SECTORS.findIndex((s) => s.id === level.id);
  const diff = Math.round((cosmic ? 0.15 + Math.max(0, cosmicIdx) * 0.15 : bank.difficulty) * 100) / 100;
  const cosmicPrompt =
    type === "isolation"
      ? `Copy the beacon.`
      : type === "repetition_drill"
        ? `Hop the asteroids — same sound.`
        : type === "discrimination"
          ? `Tap radar only on the target sound.`
          : type === "word_hunt"
            ? `Clear debris — say “${word}”.`
            : `Captain’s log — say “${word}”.`;
  const phaseMap: Record<string, TherapyPhase | undefined> = {
    "signal-bay": "isolation",
    "asteroid-hop": "repetition",
    "radar-ping": "discrimination",
    "debris-field": "words",
    "captains-log": "story",
  };
  return {
    id,
    type,
    targetPhoneme: bank.phoneme,
    word,
    difficulty: diff,
    position: bank.position as Exercise["position"],
    prompt: cosmic ? cosmicPrompt : (EXERCISE_TEMPLATES[type]?.prompt(word) ?? `Say “${word}”.`),
    media: {},
    levelId: level.id,
    phase: camp?.phase ?? (cosmic ? phaseMap[cosmic.id] : level.phase),
    viseme: type === "isolation" ? "RR" : undefined,
    tempo: type === "repetition_drill" ? (["slow", "fast", "paused"] as const)[seed % 3] : undefined,
    foils: type === "discrimination" ? ["wah"] : undefined,
    choices: type === "storytelling" ? [
      { word: word, imageKey: word, correct: true },
      { word: bank.words[(seed + 1) % bank.words.length], imageKey: bank.words[(seed + 1) % bank.words.length], correct: false },
      { word: bank.words[(seed + 2) % bank.words.length], imageKey: bank.words[(seed + 2) % bank.words.length], correct: false },
      { word: bank.words[(seed + 3) % bank.words.length], imageKey: bank.words[(seed + 3) % bank.words.length], correct: false },
    ] : undefined,
  };
}

export const mockEngine = {
  getChildrenForUser(session: AuthSession | null | undefined): Child[] {
    if (!session) return [];
    if (session.role === "admin") return [...children];
    if (session.role === "therapist") {
      return children.filter((c) => c.therapistUserId === session.userId);
    }
    return children.filter((c) => c.parentUserId === session.userId);
  },

  canViewChild(session: AuthSession | null | undefined, childId: string): boolean {
    return this.getChildrenForUser(session).some((c) => c.id === childId);
  },

  getDashboard(session?: AuthSession | null): DashboardSummary {
    const scoped = session ? this.getChildrenForUser(session) : children;
    const scopedIds = new Set(scoped.map((c) => c.id));
    const scopedAttempts = attempts.filter((a) => scopedIds.has(a.childId));
    const phonemeMap = new Map<string, { sum: number; n: number }>();
    scopedAttempts.forEach((a) => {
      const rec = phonemeMap.get(a.phoneme) ?? { sum: 0, n: 0 };
      rec.sum += a.accuracy;
      rec.n += 1;
      phonemeMap.set(a.phoneme, rec);
    });
    const phonemePerformance = Array.from(phonemeMap.entries())
      .map(([phoneme, { sum, n }]) => ({ phoneme, accuracy: Math.round((sum / n) * 100) }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 6);

    const sessionDays = new Set(scopedAttempts.map((a) => a.date.slice(0, 10)));
    return {
      totals: {
        children: scoped.length,
        games: GAMES.filter((g) => g.status === "active").length,
        users: users.filter((u) => u.status === "active").length,
        sessions: sessionDays.size,
        exercises: scopedAttempts.length,
      },
      engineHealth: [
        { name: "Speech AI", status: "operational", detail: "mock scorer · POC" },
        { name: "Adaptive Engine", status: "operational", detail: `last attempt ${scopedAttempts[0]?.date.slice(0, 10) ?? "—"}` },
        { name: "Exercise Engine", status: "operational", detail: `${CONTENT_BANK.length} content rows` },
        { name: "Analytics Engine", status: "operational", detail: `${attempts.length} attempts in store` },
        { name: "API", status: "operational", detail: "in-memory mock" },
      ],
      recentActivity: [...activity],
      phonemePerformance: phonemePerformance.length
        ? phonemePerformance
        : [{ phoneme: "/r/", accuracy: 0 }],
      childrenByGame: GAMES.map((g) => ({
        game: g.name,
        value: scoped.filter((c) => c.assignments.some((a) => a.gameId === g.id && a.active)).length,
      })),
    };
  },

  getPlatformAnalytics(session?: AuthSession | null) {
    const scoped = session ? this.getChildrenForUser(session) : children;
    const ids = new Set(scoped.map((c) => c.id));
    const shared = readSharedStore().attempts.filter((a) => {
      // Match by Engine child id OR by name when skin ids differ
      if (ids.has(a.childId)) return true;
      return scoped.some((c) => c.name === a.childName);
    });
    const rows = [
      ...attempts.filter((a) => ids.has(a.childId)),
      ...shared.map((a) => ({
        childId: a.childId,
        correct: a.correct,
        accuracy: a.accuracy,
        date: a.date,
      })),
    ];
    const correct = rows.filter((r) => r.correct).length;
    const correctness = rows.length ? Math.round((correct / rows.length) * 100) : 0;
    const activeChildren = scoped.filter((c) =>
      rows.some((r) => r.childId === c.id || shared.some((s) => s.childName === c.name)),
    ).length;
    const sessionKeys = new Set(rows.map((a) => `${a.childId}:${a.date.slice(0, 10)}`));
    const avgSessionAttempts = sessionKeys.size ? Math.round(rows.length / sessionKeys.size) : 0;

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekly = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const dayRows = rows.filter((r) => r.date.slice(0, 10) === key);
      const acc = dayRows.length
        ? Math.round((dayRows.filter((r) => r.correct).length / dayRows.length) * 100)
        : 0;
      return { day: days[d.getDay()], sessions: new Set(dayRows.map((r) => r.childId)).size, accuracy: acc };
    });

    return {
      activeChildren,
      correctness,
      avgSessionAttempts,
      wordsPractised: rows.length,
      weekly,
      children: scoped,
      seeded: true as const,
      liveSharedAttempts: shared.length,
    };
  },

  recordAttempt(partial: Omit<Attempt, "id" | "date"> & { date?: string }): Attempt {
    const row: Attempt = {
      ...partial,
      id: `att-live-${attempts.length + 1}`,
      date: partial.date ?? iso(0),
    };
    attempts.unshift(row);
    invalidateAnalytics(row.childId);
    activity.unshift({
      id: `a${activity.length + 1}`,
      type: "session",
      text: `Attempt on ${row.phoneme} (${row.word}) · ${row.correct ? "hit" : "miss"}`,
      timestamp: iso(0),
    });
    return row;
  },

  getAttempts(childId?: string): Attempt[] {
    return childId ? attempts.filter((a) => a.childId === childId) : [...attempts];
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
    // Link reverse indexes for caseload lists
    if (c.therapistUserId) {
      const t = users.find((u) => u.id === c.therapistUserId);
      if (t) {
        t.therapistChildrenIds = Array.from(new Set([...(t.therapistChildrenIds ?? []), c.id]));
      }
    }
    if (c.parentUserId) {
      const p = users.find((u) => u.id === c.parentUserId);
      if (p) {
        p.parentChildrenIds = Array.from(new Set([...(p.parentChildrenIds ?? []), c.id]));
      }
    }
    const settings = loadEngineSettings();
    if (settings.autoAssignGames) {
      c.assignments = this.matchGamesForChild(c);
    } else if (c.assessmentStatus === "pending") {
      c.assignments = [{ gameId: "g1", source: "engine", reason: "assessment pending · screen on first session", assignedAt: iso(0), active: true }];
    }
    activity.unshift({ id: `a${activity.length + 1}`, type: "child_registered", text: `New child ${c.name} onboarded`, timestamp: iso(0) });
    return c;
  },

  /** Auto-assign active games whose capabilities cover child targets (or Jungle for pending). */
  matchGamesForChild(c: Child): Child["assignments"] {
    const active = GAMES.filter((g) => g.status === "active");
    if (!c.targets.length) {
      return [{ gameId: "g1", source: "engine", reason: "assessment pending · screen on first session", assignedAt: iso(0), active: true }];
    }
    const matched = active.filter((g) =>
      c.targets.some((t) =>
        // Prefer games that support therapy types when targets exist
        g.capabilities.exerciseTypes.some((et) =>
          ["isolation", "word_hunt", "picture_naming", "word_repetition"].includes(et),
        ),
      ),
    );
    const pool = matched.length ? matched : active.slice(0, 1);
    return pool.map((g, i) => ({
      gameId: g.id,
      source: "engine" as const,
      reason: `auto-assign · target match #${i + 1}${loadEngineSettings().adaptiveEngine ? " · adaptive on" : ""}`,
      assignedAt: iso(0),
      active: true,
    }));
  },

  updateChildLinks(childId: string, patch: { parentUserId?: string; therapistUserId?: string; name?: string; age?: number; gender?: string }): Child {
    const c = this.getChild(childId)!;
    if (patch.name !== undefined) c.name = patch.name;
    if (patch.age !== undefined) c.age = patch.age;
    if (patch.gender !== undefined) c.gender = patch.gender;
    if (patch.parentUserId !== undefined) c.parentUserId = patch.parentUserId || undefined;
    if (patch.therapistUserId !== undefined) c.therapistUserId = patch.therapistUserId || undefined;
    return c;
  },

  setAssessmentDiagnosed(childId: string, phonemes: string[]): Child {
    const c = this.getChild(childId)!;
    c.assessmentStatus = "diagnosed";
    c.targets = phonemes.map((p) => ({ phoneme: p, source: "diagnosed" }));
    const settings = loadEngineSettings();
    if (settings.autoAssignGames) {
      const next = this.matchGamesForChild(c);
      next.forEach((a) => {
        if (!c.assignments.some((x) => x.gameId === a.gameId)) c.assignments.push(a);
      });
    } else {
      const g = GAMES.find((x) => x.status === "active");
      if (g && !c.assignments.some((a) => a.gameId === g.id)) {
        c.assignments.push({ gameId: g.id, source: "engine", reason: `diagnosed targets matched`, assignedAt: iso(0), active: true });
      }
    }
    invalidateAnalytics(childId);
    activity.unshift({ id: `a${activity.length + 1}`, type: "diagnostic", text: `${c.name} diagnosed · ${phonemes.join(", ")}`, timestamp: iso(0) });
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
    const settings = loadEngineSettings();
    if (settings.autoAssignGames) {
      c.assignments = this.matchGamesForChild(c);
    } else {
      const active = GAMES.filter((g) => g.status === "active");
      c.assignments = active.map((g, i) => ({
        gameId: g.id,
        source: "engine" as const,
        reason: `manual regenerate #${i + 1}`,
        assignedAt: iso(0),
        active: true,
      }));
    }
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
    if (g.shortId === "jungle-quest") {
      g.levelCount = 5;
      g.exerciseCount = 33;
      g.generatedAt = iso(0);
      levels[gameId] = JUNGLE_CAMPS.map((camp, i) => ({
        id: camp.id,
        gameId,
        index: i + 1,
        title: camp.title,
        difficulty: Math.round((0.15 + i * 0.15) * 100) / 100,
        phase: camp.phase,
        exerciseIds: Array.from({ length: camp.type === "repetition_drill" ? 12 : 6 }, (_, k) => `${camp.id}-ex-${k}`),
      }));
      return { levels: 5, exercises: 33, generatedAt: iso(0) };
    }
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
    // Rebuild each read so skin localStorage pushes appear without stale cache.
    const next = buildAnalytics(childId);
    analyticsCache.set(childId, next);
    return next;
  },

  getUserName(id?: string): string {
    if (!id) return "—";
    return users.find((u) => u.id === id)?.name ?? "—";
  },
  getGameName(id: string): string {
    return GAMES.find((g) => g.id === id)?.name ?? id;
  },

  getContentBank(): { phoneme: string; words: readonly string[]; position: string; difficulty: number; type?: string }[] {
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
            prompt: EXERCISE_TEMPLATES[type]?.prompt(word) ?? `Say “${word}”.`,
            media: { imageUrl: undefined, audioUrl: undefined },
            levelId: game.shortId === "jungle-quest" ? (JUNGLE_CAMPS.find((x) => x.type === type)?.id ?? game.id) : game.id,
            phase: JUNGLE_CAMPS.find((x) => x.type === type)?.phase,
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

  getLevel(levelId: string): Level | undefined {
    for (const key of Object.keys(levels)) {
      const lv = levels[key].find((l) => l.id === levelId);
      if (lv) return lv;
    }
    return undefined;
  },

  getLevelExercises(levelId: string): Exercise[] {
    const level = this.getLevel(levelId);
    if (!level) return [];
    return level.exerciseIds.map((id) => exerciseStore[id] ?? (exerciseStore[id] = buildExerciseForLevel(id, level)));
  },

  updateExercise(id: string, patch: Partial<Exercise>): Exercise | undefined {
    const ex = exerciseStore[id];
    if (!ex) return undefined;
    const next = { ...ex, ...patch };
    if (patch.word) next.prompt = EXERCISE_TEMPLATES[ex.type]?.prompt(patch.word) ?? next.prompt;
    exerciseStore[id] = next;
    return next;
  },

  addExercise(levelId: string, input: Omit<Exercise, "id" | "levelId" | "prompt" | "media">): Exercise | undefined {
    const level = this.getLevel(levelId);
    if (!level) return undefined;
    const id = `${levelId}-manual-${level.exerciseIds.length + 1}-${Date.now()}`;
    const ex: Exercise = {
      ...input,
      id,
      levelId,
      media: {},
      prompt: EXERCISE_TEMPLATES[input.type]?.prompt(input.word) ?? `Say “${input.word}”.`,
    };
    exerciseStore[id] = ex;
    level.exerciseIds.push(id);
    return ex;
  },

  removeExercise(id: string): void {
    const ex = exerciseStore[id];
    if (!ex) return;
    delete exerciseStore[id];
    if (ex.levelId) {
      const lv = this.getLevel(ex.levelId);
      if (lv) lv.exerciseIds = lv.exerciseIds.filter((x) => x !== id);
    }
  },
};
