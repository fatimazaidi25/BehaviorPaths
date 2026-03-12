import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sprout, Camera, Leaf, BarChart2, Search, Home, Brain, ArrowRightCircle, CheckCircle, BookOpen, Users, Star, Shield, Target, FileText, LogOut, Eye, Crosshair, Sparkles, VolumeX, AlertTriangle } from "lucide-react";

// ────────────────────────────────────────────────────────────
// ── theme
// ────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────
// theme.js — BASIL Behavior Lab color palette
// ─────────────────────────────────────────────

const B = {
  forest:    "#003B01",
  teal:      "#0B4238",
  sage:      "#84B59F",
  mint:      "#C8DDD3",
  peach:     "#F5C4A1",
  orange:    "#E8834A",
  warmWhite: "#FDFAF5",
  cream:     "#F5EFE6",
  bark:      "#1C1C1A",
  muted:     "#6B7B72",
  border:    "#D6E4DC",
  white:     "#FFFFFF",
};


// ────────────────────────────────────────────────────────────
// ── constants
// ────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
// constants.js — All BIP content data
// Sections correspond to SIRAS IEP 6G
// ─────────────────────────────────────────────────────────────────


// ── Navigation stops (screen order) ──────────────────────────────

const STOPS = [
  { id: "welcome",    label: "Welcome",             ic: Sparkles },
  { id: "student",    label: "Student Info",         ic: Sprout,         section: "Student Information" },
  { id: "behavior",   label: "1. The Behavior",      ic: Camera,         section: "1. The behavior impeding learning is…" },
  { id: "impedes",    label: "2. Impedes Because",   ic: Leaf,           section: "2. It impedes learning because…" },
  { id: "baseline",   label: "4. Freq / Intensity",  ic: BarChart2,      section: "4. Frequency or intensity or duration of behavior" },
  { id: "antecedents",label: "5. Predictors",        ic: Search,         section: "5. What are the predictors for the behavior?" },
  { id: "environment",label: "6–7. Environment",     ic: Home,           section: "6–7. Environmental factors and necessary changes" },
  { id: "function",   label: "8. Function",          ic: Brain,          section: "8. Function of behavior" },
  { id: "ferb",       label: "9. Replacement",       ic: ArrowRightCircle, section: "9. What should the student do INSTEAD?" },
  { id: "teaching",   label: "10. Teaching",         ic: BookOpen,       section: "10. What teaching strategies / materials are needed?" },
  { id: "reinforce",  label: "11. Reinforcement",    ic: Star,           section: "11. What are reinforcement procedures?" },
  { id: "training",   label: "11. Who Will Establish", ic: Users,        section: "11. Who will establish, train, and monitor?" },
  { id: "ferb_check", label: "11. FERB Goal",        ic: CheckCircle,    section: "11. Replacement behavior goal" },
  { id: "reactive",   label: "12. Reactive",         ic: Shield,         section: "12. What strategies if the problem behavior occurs again?" },
  { id: "goals",      label: "13. Reduction Goals",  ic: Target,         section: "13. Behavior reduction goal(s)" },
  { id: "comms",      label: "14. Family Comms",     ic: Users,          section: "14. Home–school communication plan" },
  { id: "output",     label: "Your Plan",            ic: FileText },
];

// ── Section 1 — Behavior ─────────────────────────────────────────

const BEHAVIOR_TYPES = [
  "Aggression toward others",
  "Self-injury / SIB",
  "Property destruction",
  "Verbal / vocal disruption",
  "Elopement / running",
  "Non-academic electronic use",
  "Inappropriate physical contact",
  "Object appropriation",
  "Other (describe)",
];

// ── Section 2 — Impedes learning ─────────────────────────────────

const IMPEDES = [
  "disrupts the learning of peers",
  "prevents the student from accessing instruction",
  "requires significant adult attention that reduces instructional time",
  "creates safety concerns for the student and/or others",
  "results in the student being removed from the learning environment",
  "prevents the student from building peer relationships",
  "interferes with the student's ability to complete academic tasks",
];

// ── Section 4 — Baseline (frequency / intensity / duration) ──────

const FREQ_RATES = [
  "rate of 1–2 times per day",
  "rate of 3–5 times per day",
  "rate of more than 5 times per day",
  "rate of 1–2 times per week",
  "rate of 3–5 times per week",
  "rate of multiple times per hour",
];

const INTENSITY = {
  "Aggression toward others": [
    "No visible marks on others",
    "Visible redness on others (no bruising)",
    "Bruising on others (no broken skin)",
    "Broken skin or requires first aid",
    "Requires physical intervention by staff",
    "Results in medical attention for others",
  ],
  "Self-injury / SIB": [
    "No visible marks on self",
    "Visible redness on self (no bruising)",
    "Bruising on self (no broken skin)",
    "Broken skin or requires first aid on self",
    "Requires medical attention for self",
  ],
  "Property destruction": [
    "Minor — item is displaced but undamaged",
    "Moderate — item requires repair",
    "Significant — item requires replacement",
    "Severe — structural or safety damage to environment",
  ],
  "Verbal / vocal disruption": [
    "Mild — audible to nearby peers only",
    "Moderate — disrupts the entire classroom",
    "Severe — disrupts adjacent classrooms or hallway",
    "Extreme — requires removal of student or class",
  ],
  "Elopement / running": [
    "Moves to another part of the room",
    "Exits the classroom but stays on campus",
    "Exits the building",
    "Leaves campus grounds",
  ],
  default: [
    "Minimal impact on environment or others",
    "Moderate impact — requires staff redirection",
    "Significant impact — requires active staff intervention",
    "Severe — requires removal or emergency response",
  ],
};

// ── Section 5 — Antecedents ───────────────────────────────────────

const ANTECEDENTS = [
  // Escape / Avoidance
  "A non-preferred or unwanted demand is presented",
  "A preferred activity is interrupted, ended, or denied",
  "The student must transition between activities or settings",
  "A schedule change occurs without warning",
  "Multi-step or repetitive directions are given",
  "The task is perceived as too difficult, too long, or repetitive",
  // Attention
  "Adult or peer attention is diverted from the student",
  "The student is working independently without support",
  "The student is in an unstructured setting (recess, lunch, hallway)",
  // Sensory / Environment
  "The environment is loud, crowded, or overstimulating",
  "Sensory triggers are present (noise, touch, smell, texture)",
  "A substitute or unfamiliar adult is present",
  "Peer conflict or unwanted peer proximity is occurring",
];

// ── Sections 6–7 — Environmental Analysis (EA) items ─────────────
// Feature numbers align with BASIL EA Data Sheet

const EA_ITEMS = [
  {
    num: "1", label: "Safety",
    sub: [
      "1a. Student is seated strategically for safety",
      "1b. Access to dangerous materials is limited",
      "1c. Staff use safety habits & keep safe distance",
    ],
    s6: "Safety features are missing or not working — the environment is not set up to support safe behavior.",
    s7: [
      "Seat student strategically — away from high-traffic areas, unsafe materials, and peers who trigger escalation",
      "Conduct a brief safety audit of the environment and remove/secure any dangerous materials",
      "Ensure all staff maintain safe distance and use de-escalation body language during high-risk moments",
      "Case manager to review seating arrangement with classroom teacher within 1 week",
    ],
  },
  {
    num: "2", label: "Easy access to expectation reminders",
    sub: [],
    s6: "Expectation reminders are missing or not accessible — the student does not have clear, visible cues for what is expected.",
    s7: [
      "Case manager will print individualized visual expectation card and laminate for student's desk",
      "Teacher will review expectations 1:1 with student after whole-group direction each morning",
      "Post visual classroom rules at student eye level near their work area",
      "Pre-correct verbally before high-risk transitions: 'Remember, when we get to math, we…'",
      "PBS coach to model pre-correction routine with classroom teacher during next coaching visit",
    ],
  },
  {
    num: "3", label: "Evidence of establishing routines",
    sub: [],
    s6: "Routines are not established or are inconsistent — the student cannot predict what comes next, increasing anxiety and behavior.",
    s7: [
      "Create and post a visual daily schedule at student eye level; review each morning",
      "Teacher will give 5-minute and 2-minute transition warnings before all activity changes",
      "Establish and practice a consistent morning arrival routine with student",
      "Case manager will create a personalized schedule card student carries throughout the day",
      "All staff to use the same transition language — team to agree on wording at next meeting",
    ],
  },
  {
    num: "4", label: "Clearly indicated break times based on endurance",
    sub: [],
    s6: "Structured breaks are absent or not matched to student endurance — the student has no sanctioned way to regulate.",
    s7: [
      "Schedule predictable breaks based on student's current endurance (e.g., every 20 min of instruction)",
      "Provide a visual break schedule showing when breaks occur throughout the day",
      "Implement a break card system — student has 2 break cards per period to use independently",
      "Teacher will build in a movement break after non-preferred tasks",
      "Case manager to determine endurance baseline with teacher and set initial break schedule",
    ],
  },
  {
    num: "5", label: "Curriculum matches ability or scaffolding offered",
    sub: [],
    s6: "Curriculum demands exceed the student's current ability level without adequate scaffolding — tasks are too hard or too long.",
    s7: [
      "Apply all IEP accommodations consistently across all settings and subjects",
      "Modify task length to match student's current endurance and accuracy level",
      "Pre-teach key vocabulary before introducing new content",
      "Use behavioral momentum: begin with 2–3 mastered tasks before presenting challenging material",
      "Provide graphic organizers and visual task supports for all written work",
      "Case manager to audit IEP accommodations with classroom teacher — confirm all are in place",
    ],
  },
  {
    num: "6", label: "Opportunities for active participation",
    sub: [],
    s6: "Student has limited opportunities to actively respond — passive instruction increases disengagement and behavior.",
    s7: [
      "Increase active response opportunities: choral response, whiteboards, response cards, gestures",
      "Reduce whole-class lecture time; use partner or small group formats during peak-challenge times",
      "Assign student an active role in group activities (materials manager, timekeeper, reporter)",
      "Build in frequent check-ins during independent work — every 5–10 minutes",
      "Teacher to use least-to-most prompting to support participation without learned helplessness",
    ],
  },
  {
    num: "7", label: "Choices offered at reasonable times",
    sub: [],
    s6: "Choice-making opportunities are absent or poorly timed — student has no sense of control, increasing resistance.",
    s7: [
      "Offer 2-choice prompt before any new demand: 'Would you like to start with A or B?'",
      "Provide choice of task order, materials, or work location at the start of each work period",
      "Use a when-then frame before transitions: 'When you finish X, then you get to choose Y'",
      "Allow student to select reinforcer from an approved menu at start of day",
      "Case manager to create a choice board with teacher-approved options for student to use",
    ],
  },
  {
    num: "8", label: "Evidence of individualized supports",
    sub: ["Visuals, directions, reinforcement, communication"],
    s6: "Individualized supports (visuals, AAC, token systems) are missing or inconsistently used across staff.",
    s7: [
      "Ensure AAC device or communication system is available and charged at all times",
      "Implement token economy directly tied to FERB use — all staff to use same system",
      "Provide a first-then visual board at student's workspace",
      "Create and post a power card using student's preferred character or interest",
      "Case manager to audit individualized supports at next observation and provide staff training",
      "All staff to be trained on individualized support tools within 2 weeks",
    ],
  },
  {
    num: "9", label: "Sensory environment appropriate",
    sub: [],
    s6: "The sensory environment is overwhelming or understimulating — noise, lighting, crowding, or proximity trigger the behavior.",
    s7: [
      "Seat student away from high-traffic, noisy, or visually distracting areas",
      "Reduce visual clutter in student's immediate work area",
      "Provide noise-canceling headphones or ear defenders during noisy whole-class activities",
      "Create or designate a calm/break space the student can access during sensory overload",
      "Evaluate lighting — reduce fluorescent glare; allow natural light when possible",
      "OT to consult on sensory diet and environmental modifications within 2 weeks",
    ],
  },
  {
    num: "10", label: "Positive adult relationship & reinforcement",
    sub: [],
    s6: "Positive adult interactions are insufficient — the student's primary adult contact involves correction, not connection.",
    s7: [
      "All staff to maintain a 4:1 ratio of positive interactions to corrections throughout the day",
      "Identify student's preferred adults and ensure contact with them daily",
      "Greet student by name every morning with a genuine, positive interaction",
      "Behavior specialist to track adult interaction ratios during next observation",
      "Case manager to share 4:1 strategy with all staff at next team meeting",
    ],
  },
  {
    num: "11", label: "Providing opportunities for socialization",
    sub: [],
    s6: "Socialization opportunities are limited or unstructured — the student lacks supported contexts to practice social skills.",
    s7: [
      "Structure peer interactions with clear roles and expectations during group work",
      "Pre-teach social scripts for common scenarios (joining a group, asking for help, disagreeing)",
      "Seat student next to prosocial peer models during instructional time",
      "Facilitate a supported social opportunity during unstructured time (lunch, recess) 3x/week",
      "Case manager to coordinate with counselor on social skills support group if appropriate",
    ],
  },
  {
    num: "12", label: "Transitions clear & efficient",
    sub: [],
    s6: "Transitions are abrupt, unclear, or lack support — the student struggles to shift between activities or locations.",
    s7: [
      "Give transition warnings at 5 minutes and 2 minutes before all activity changes",
      "Use a visual transition card or countdown timer to signal upcoming transitions",
      "Establish a consistent transition routine: pack up → line up → move — practice explicitly",
      "Identify high-risk transitions and assign a designated support person during those times",
      "Case manager to map highest-risk transitions with classroom teacher and create a support plan",
    ],
  },
];

// ── Section 8 — Function ──────────────────────────────────────────

const FUNCTIONS = [
  {
    id: "escape", label: "Escape / Avoid", color: "#0B4238", ic: LogOut,
    desc: "Student avoids or escapes something unpleasant",
    frames: [
      "to escape academic demands perceived as too difficult",
      "to escape tasks that are too lengthy or repetitive",
      "to escape transitions to non-preferred activities",
      "to escape working with specific peers",
      "to avoid a specific setting or location",
      "to avoid sensory aspects of a task",
    ],
  },
  {
    id: "attention", label: "Attention", color: "#6B5B9E", ic: Eye,
    desc: "Student gets a reaction from adults or peers",
    frames: [
      "to gain adult attention when it is not currently available",
      "to gain peer attention (positive or negative)",
      "to maintain adult proximity and interaction",
      "to access one-on-one attention from a preferred adult",
    ],
  },
  {
    id: "tangible", label: "Tangible / Access", color: "#003B01", ic: Crosshair,
    desc: "Student accesses a preferred item or activity",
    frames: [
      "to gain access to a preferred item that was denied",
      "to gain access to a preferred activity that was interrupted",
      "to gain access to food or preferred consumables",
      "to access preferred technology (iPad, computer, phone)",
    ],
  },
  {
    id: "sensory_on", label: "Sensory (Access)", color: "#B06A2A", ic: Sparkles,
    desc: "Behavior provides pleasurable sensory input",
    frames: [
      "to access sensory input that feels good or calming",
      "to access movement or proprioceptive input",
      "to access visual or auditory stimulation",
      "to self-regulate through repetitive sensory input",
    ],
  },
  {
    id: "sensory_off", label: "Sensory (Avoidance)", color: "#7A2A2A", ic: VolumeX,
    desc: "Student avoids overwhelming sensory experience",
    frames: [
      "to avoid auditory overstimulation (noise, voices)",
      "to avoid tactile input (unexpected touch, textures)",
      "to avoid visual overstimulation (bright lights, crowds)",
      "to reduce crowding or close physical proximity",
    ],
  },
];

// ── Section 9 — FERB options by function ─────────────────────────

const FERBS = {
  escape: [
    { l: "Request a break verbally ('I need a break')",           m: "None" },
    { l: "Use a Break Card — held up to signal need for break",   m: "Break card (laminated)" },
    { l: "Use a Help Card — signals the task is too hard",        m: "Help card (laminated)" },
    { l: "Use a Skip Card — request to skip one item",            m: "Skip card (laminated)" },
    { l: "Point to 'I need help' on AAC device",                  m: "AAC device" },
    { l: "Request a reduced task ('Can I do fewer problems?')",   m: "None" },
    { l: "Go to calm corner when overwhelmed",                    m: "Calm corner setup" },
    { l: "Thumbs-down signal — task is too hard",                 m: "None (gestural)" },
  ],
  attention: [
    { l: "Raise hand and wait up to 30 seconds",                  m: "None" },
    { l: "Tap teacher's arm gently and wait",                     m: "None" },
    { l: "Use 'I need help' desk flag",                           m: "Desk flag / card" },
    { l: "Use AAC to request interaction",                        m: "AAC device" },
    { l: "Use a 'Talk to me' card for peer interaction",          m: "Talk card" },
    { l: "Use social script card to start conversation",          m: "Social script card" },
  ],
  tangible: [
    { l: "Ask for item using words ('Can I have ___?')",          m: "None" },
    { l: "Point to item on picture request board",                m: "Picture request board" },
    { l: "Use AAC to request preferred item",                     m: "AAC device" },
    { l: "Use token economy to earn preferred item",              m: "Token board" },
    { l: "Wait using visual timer",                               m: "Visual timer" },
    { l: "Use first-then board to negotiate access",              m: "First-then board" },
  ],
  sensory_on: [
    { l: "Request movement break (errand, jumping jacks)",        m: "Break pass" },
    { l: "Use fidget tool at desk during instruction",            m: "Fidget tool" },
    { l: "Request wobble chair or alternative seating",           m: "Alternative seating" },
    { l: "Resistance band on chair legs for input",               m: "Resistance band" },
    { l: "Request sensory diet activity",                         m: "Sensory menu card" },
    { l: "Request noise-canceling headphones",                    m: "Headphones" },
    { l: "Request weighted lap pad",                              m: "Weighted item" },
  ],
  sensory_off: [
    { l: "Use 'too loud / too much' signal card",                 m: "Sensory signal card" },
    { l: "Put on ear defenders independently",                    m: "Ear defenders" },
    { l: "Request to move to quieter workspace",                  m: "Break pass" },
    { l: "Use AAC: 'Too loud' / 'Hurts'",                        m: "AAC device" },
    { l: "Use desk divider to reduce visual input",               m: "Desk divider" },
    { l: "Use 'give me space' card",                              m: "Space card" },
  ],
};

// ── Section 10 — Teaching strategies ─────────────────────────────

const TEACH_STRATEGIES = [
  { id: "roleplay",   l: "Direct Instruction / Role Play",   sub: "Model the FERB, practice together, then student performs independently during calm time (3–5 min daily)" },
  { id: "video",      l: "Video Modeling",                   sub: "Show student a video of the FERB being used correctly; review and discuss" },
  { id: "visual",     l: "Visual Anchor Card",               sub: "Post a visual cue card at student's workspace showing FERB steps (words + pictures)" },
  { id: "graduated",  l: "Graduated Guidance",               sub: "Prompt hierarchy: physical model → verbal → gestural → independent" },
  { id: "story",      l: "Social Story",                     sub: "Read a brief, personalized story explaining when and why to use the FERB" },
  { id: "natural",    l: "Embedded Practice",                sub: "Practice FERB within natural daily routines (e.g., during morning meeting, transitions)" },
  { id: "rehearsal",  l: "Behavioral Rehearsal",             sub: "Brief practice session immediately before identified high-risk times" },
  { id: "error",      l: "Error Correction",                 sub: "When problem behavior occurs: pause → prompt FERB → practice → reinforce" },
  { id: "selfmon",    l: "Self-Monitoring Checklist",        sub: "Student tracks their own FERB use with a simple tally or checkmark system" },
];

const DATA_METHODS = [
  "with 80% accuracy across 3 consecutive sessions",
  "with 90% accuracy across 3 consecutive sessions",
  "independently in 4 out of 5 opportunities across 3 consecutive sessions",
  "with 80% accuracy and independence across 3 consecutive sessions",
];

const WHEN_TO_REINFORCE = [
  "Every correct use of the FERB (continuous schedule — acquisition phase)",
  "Every 2–3 correct uses (thinning to fixed ratio)",
  "Randomly after correct uses (variable ratio — maintenance)",
  "At end of activity block for meeting FERB goal",
  "At end of day if FERB goal met all day",
  "Immediately upon use — within 3 seconds",
];

// ── Section 11 — Reinforcement ───────────────────────────────────

const REINF_BY_FUNCTION = {
  escape: [
    "Immediate brief break (1–3 min) upon correct FERB use",
    "Reduce task length briefly when FERB is used",
    "Honor the request — stop demand, wait, then re-present",
    "Escape earned only via FERB — never via problem behavior",
    "First-Then board: 'First [task], then [break]'",
  ],
  attention: [
    "Immediate specific praise: name + action + why ('You asked for help — that was great!')",
    "Brief 1:1 check-in time earned per FERB use",
    "Scheduled attention moments to reduce deprivation",
    "Ignore problem behavior; attend only to FERB",
    "Peer recognition / class acknowledgment for FERB use",
  ],
  tangible: [
    "Access to preferred item immediately after FERB",
    "Token board: tokens earned for FERB use, exchanged for preferred item",
    "First-Then: 'First [task / wait], then [item]'",
    "Choice board: earn access to one choice per FERB",
    "Communicate wait time clearly — visual timer",
  ],
  sensory_on: [
    "Scheduled sensory diet activities tied to FERB use",
    "Preferred sensory item/activity earned per FERB",
    "Break pass: allows student to access sensory corner",
    "Token board tied to sensory reward",
    "Sensory menu posted — student selects earned activity",
  ],
  sensory_off: [
    "Immediate escape from sensory input upon FERB use",
    "Sensory toolkit accessible at desk (no FERB required — prevention)",
    "Fidget tool or ear defenders as proactive support",
    "Quiet corner access earned via FERB (break card / signal card)",
    "Reduce sensory demand proactively before threshold",
  ],
};

const REINF_SCHEDULES = [
  { id: "cont",      l: "Continuous — every single FERB use",   sub: "Best for acquisition; student is just learning the FERB" },
  { id: "firstthen", l: "First-Then Board",                     sub: "Visual: 'First [work/task], Then [preferred item/break]'" },
  { id: "token",     l: "Token Board",                          sub: "Student earns tokens for FERB use; exchanges for backup reinforcer" },
  { id: "cico",      l: "Check-In Check-Out (CICO)",            sub: "Daily point card tied to FERB goals; student checks in with adult AM/PM" },
  { id: "selfmon",   l: "Self-Monitoring Chart",                sub: "Student records own FERB use; earns reward at end of day/week" },
  { id: "specific",  l: "Specific schedule — describe below",   sub: "Use for fixed/variable ratio or interval schedules" },
];

const REINFORCERS = {
  social: {
    label: "Social", color: "#0B4238",
    elementary: ["Verbal praise (specific)", "High five / fist bump", "Sticker", "Stamp on hand", "Special helper role", "Sit with a friend", "Show work to principal", "Call home (positive)", "Read with the teacher"],
    secondary:  ["Verbal acknowledgment (low-key)", "Bump / handshake", "Written note from teacher", "Positive call/text home", "Shout-out on class board", "Lunch with a preferred adult", "Help a younger student"],
  },
  activity: {
    label: "Activity", color: "#6B5B9E",
    elementary: ["Free choice time", "Extra recess", "Computer/tablet time", "Class game", "Drawing or coloring", "Play with Legos or blocks", "Watch a short video", "Read a preferred book", "Help set up classroom"],
    secondary:  ["Free time / study hall", "Listen to music (earbuds)", "Phone/device time", "Pass to walk the hallway", "Watch a video clip", "Work on a personal project", "Early release from class", "Sit where you want"],
  },
  tangible: {
    label: "Tangible", color: "#5C3317",
    elementary: ["Small toy or fidget", "Sticker book page", "Pencil or eraser", "Snack of choice", "Prize box item", "Homework pass", "Bookmark"],
    secondary:  ["Snack of choice", "Homework pass", "Extra credit", "Gift card (small)", "School supplies", "Coupon book", "Free dress day"],
  },
  sensory: {
    label: "Sensory", color: "#C0392B",
    elementary: ["Fidget tool", "Playdough", "Kinetic sand", "Bubble wrap", "Noise-canceling headphones", "Wobble seat time", "Movement break", "Trampoline time", "Sensory bin"],
    secondary:  ["Fidget tool", "Stress ball", "Noise-canceling headphones", "Movement break", "Standing desk time", "Quiet corner access", "Weighted blanket"],
  },
  privilege: {
    label: "Privilege", color: "#003B01",
    elementary: ["Line leader", "Teacher's helper", "Choose the class game", "Feed class pet", "Sit at teacher's desk", "Extra computer time", "Wear a special hat", "Choose the read-aloud book"],
    secondary:  ["Pass to skip one assignment", "Choose seating arrangement", "Leave class 2 min early", "No-homework night", "Lunch off-campus pass", "Free period activity choice", "Mentor a younger student"],
  },
};

const SERVICE_PROVIDERS = [
  "Special Education Teacher / Case Manager",
  "Behavior Specialist / BCBA",
  "Speech-Language Pathologist",
  "Occupational Therapist",
  "General Education Teacher",
  "Instructional Assistant / Paraeducator",
  "School Psychologist",
  "Counselor",
  "Administrator",
];

// ── Section 12 — Reactive strategies ───────────────────────────────

// REACTIVE constants removed — now inline in renderReactive


// ────────────────────────────────────────────────────────────
// ── components
// ────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
// components.jsx — Shared UI primitives
//
// All components are defined at module scope (not inside other
// components) to prevent React from unmounting/remounting them
// on every parent render — which causes scroll jumps in textareas.
// ─────────────────────────────────────────────────────────────────


// ── Icon wrapper ──────────────────────────────────────────────────

const Icon = ({ ic: Ic, size = 13, color = "currentColor" }) => (
  <Ic size={size} color={color} strokeWidth={2} style={{ flexShrink: 0 }} />
);

// ── Typography ────────────────────────────────────────────────────

/** Section label — small uppercase caps */
const SL = ({ c, children }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, color: c || B.sage,
    letterSpacing: 1.2, textTransform: "uppercase",
    marginBottom: 7, fontFamily: "'DM Sans',sans-serif",
  }}>
    {children}
  </div>
);

/** Screen heading */
const H = ({ children }) => (
  <h2 style={{
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: 28, fontWeight: 600, color: B.forest,
    marginBottom: 6, lineHeight: 1.25,
  }}>
    {children}
  </h2>
);

/** Body paragraph */
const P = ({ children }) => (
  <p style={{
    fontSize: 13.5, color: B.muted, lineHeight: 1.75,
    marginBottom: 20, fontFamily: "'DM Sans',sans-serif",
  }}>
    {children}
  </p>
);

/** Section badge (SIRAS label) */
const Badge = ({ children }) => (
  <div style={{
    display: "inline-flex", background: B.mint + "99", color: B.teal,
    borderRadius: 20, padding: "3px 11px", fontSize: 10.5,
    fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
    marginBottom: 18, fontFamily: "'DM Sans',sans-serif",
  }}>
    {children}
  </div>
);

// ── Callout box ───────────────────────────────────────────────────

const BOX_STYLES = {
  info:   { bg: "#EAF3EE", bc: B.sage  + "55", tc: B.teal },
  warn:   { bg: "#FEF4EC", bc: B.orange + "55", tc: "#7A3A10" },
  danger: { bg: "#FDECEA", bc: "#D9534F55",     tc: "#7A1A1A" },
  peach:  { bg: "#FEF0E8", bc: B.peach  + "99", tc: "#7A3A10" },
};

const Box = ({ type = "info", children }) => {
  const s = BOX_STYLES[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.bc}`, borderRadius: 9,
      padding: "11px 15px", fontSize: 12.5, color: s.tc,
      marginBottom: 16, lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif",
    }}>
      {children}
    </div>
  );
};

// ── Form controls ─────────────────────────────────────────────────

const Chk = ({ label, checked, onChange, sub, style: extStyle }) => (
  <label style={{
    display: "flex", alignItems: "flex-start", gap: 11,
    padding: "10px 13px", borderRadius: 9,
    border: `1.5px solid ${checked ? B.sage : B.border}`,
    background: checked ? "#EAF3EE" : B.white,
    cursor: "pointer", marginBottom: 7, transition: "all 0.13s",
    ...extStyle,
  }}>
    <input
      type="checkbox" checked={checked} onChange={onChange}
      style={{ accentColor: B.forest, width: 15, height: 15, flexShrink: 0, marginTop: 2 }}
    />
    <span style={{ fontSize: 13, color: B.bark, lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>
      {label}
      {sub && <span style={{ display: "block", fontSize: 11, color: B.muted, marginTop: 2 }}>{sub}</span>}
    </span>
  </label>
);

const Pill = ({ label, sel, onClick, color }) => (
  <button onClick={onClick} style={{
    padding: "7px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 500,
    fontFamily: "'DM Sans',sans-serif",
    border: `1.5px solid ${sel ? (color || B.forest) : B.border}`,
    background: sel ? (color || B.forest) : B.white,
    color: sel ? B.white : B.bark,
    cursor: "pointer", margin: "0 5px 7px 0", transition: "all 0.13s",
  }}>
    {label}
  </button>
);

/** Textarea — used everywhere for multiline input */
const TA = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: "100%", boxSizing: "border-box",
      padding: "10px 14px", border: `1.5px solid ${B.border}`,
      borderRadius: 9, fontSize: 13, color: B.bark,
      fontFamily: "'DM Sans',sans-serif", background: B.warmWhite,
      outline: "none", resize: "vertical", lineHeight: 1.6,
    }}
  />
);

/** Text input — used for single-line fields */
const TI = ({ value, onChange, placeholder }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%", boxSizing: "border-box",
      padding: "10px 14px", border: `1.5px solid ${B.border}`,
      borderRadius: 9, fontSize: 13, color: B.bark,
      fontFamily: "'DM Sans',sans-serif", background: B.warmWhite,
      outline: "none",
    }}
  />
);

// ── Per-behavior layout helpers ───────────────────────────────────

/** Colored header strip for b1 / b2 blocks */
const BehHeader = ({ bkey, btype, color = "#0B4238" }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 13px", background: color,
    borderRadius: 8, marginBottom: 12,
  }}>
    <span style={{
      fontSize: 10, fontWeight: 700, color: "#fff",
      letterSpacing: 1, textTransform: "uppercase",
      fontFamily: "'DM Sans',sans-serif",
    }}>
      {bkey === "b1" ? "Behavior 1" : "Behavior 2"} — {btype}
    </span>
  </div>
);

/** "Same for both behaviors" toggle banner */
const SameBanner = ({ secKey, same, setSame, beh2type }) =>
  beh2type ? (
    <label style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px",
      background: same ? "#E6F2EE" : "#F5F5EF",
      border: `1.5px solid ${same ? "#0B4238" : "#D8D0C4"}`,
      borderRadius: 10, cursor: "pointer", marginBottom: 16,
      fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
    }}>
      <input
        type="checkbox" checked={same}
        onChange={e => setSame(secKey, e.target.checked)}
        style={{ accentColor: "#0B4238", width: 16, height: 16, flexShrink: 0 }}
      />
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: same ? "#0B4238" : "#666", lineHeight: 1.3 }}>
          Same for both behaviors
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
          {same
            ? "Behavior 2 will mirror Behavior 1 — uncheck to edit separately"
            : "Check if this section applies identically to both behaviors"}
        </div>
      </div>
      {same && (
        <span style={{
          marginLeft: "auto", fontSize: 10, fontWeight: 700,
          background: "#0B4238", color: "#fff",
          borderRadius: 6, padding: "2px 8px",
        }}>
          ✓ mirrored
        </span>
      )}
    </label>
  ) : null;


// ────────────────────────────────────────────────────────────
// ── buildOutput
// ────────────────────────────────────────────────────────────
// Plain text output — question label followed by answer below it
// so it can be pasted directly into SIRAS or any IEP system.

function getBehaviors(d) {
  return [
    d.beh1type ? { key: "b1", type: d.beh1type, def: d.beh1 } : null,
    d.beh2type ? { key: "b2", type: d.beh2type, def: d.beh2 } : null,
  ].filter(Boolean);
}

function buildOutput(d) {
  const name  = d.name || "The student";
  const behs  = getBehaviors(d);
  const multi = behs.length > 1;
  const div   = "═".repeat(60);
  const line  = "─".repeat(60);
  const q     = (label) => `\n${label}`;
  const a     = (text)  => text || "[Not completed]";
  const bLabel = (bk)   => multi ? (bk==="b1" ? "  [Behavior 1]" : "  [Behavior 2]") : "";
  const bullets = (arr) => (arr||[]).length ? (arr).map(x => `  • ${x}`).join("\n") : "  [Not completed]";
  const FN_LABELS = { escape:"Escape / Avoidance", attention:"Attention (adult or peer)",
    tangible:"Access to tangible / preferred item", sensory:"Automatic / Sensory", unknown:"Unknown" };

  const lines = [];

  lines.push(div);
  lines.push("IEP 6G-1 — BEHAVIOR INTERVENTION PLAN");
  lines.push(`Generated by BehaviorPath · BASIL Behavior Lab`);
  lines.push(div);
  lines.push(`Student: ${d.name || "[Name]"}   Date: ${new Date().toLocaleDateString()}`);
  lines.push("");

  // ── SECTION 1 ────────────────────────────────────────────
  lines.push(div);
  lines.push("SECTION 1 — The behavior impeding learning is...");
  lines.push(line);
  behs.forEach(({key, type, def}) => {
    if (multi) lines.push(bLabel(key));
    lines.push(q("Behavior name:"));
    lines.push(`  ${a(type)}`);
    lines.push(q("Definition (what it looks like):"));
    lines.push(`  ${a(def)}`);
    if (multi) lines.push("");
  });

  // ── SECTION 2 ────────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 2 — It impedes learning because...");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    if (multi) lines.push(bLabel(key));
    lines.push(q("Reasons selected:"));
    lines.push(bullets(b.impedes));
    if (multi) lines.push("");
  });

  // ── SECTION 3 ────────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 3 — Environmental Analysis");
  lines.push(line);
  lines.push(q("Note:"));
  lines.push("  Refer to the Environmental Analysis Data Sheet completed separately.");
  lines.push("  Results inform Sections 6 & 7 of this BIP.");

  // ── SECTION 4 ────────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 4 — Frequency, intensity, or duration of behavior");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    if (multi) lines.push(bLabel(key));
    lines.push(q("Frequency (baseline):"));
    lines.push(`  ${b.freqMax ? `${b.freqMin?b.freqMin+"–":""}${b.freqMax} times per ${b.freqUnit||"day"}${b.freqCtx?" ("+b.freqCtx+")":""}` : "[Not recorded]"}`);
    lines.push(q("Intensity:"));
    lines.push(`  ${a(b.intensity)}`);
    lines.push(q("Duration:"));
    lines.push(`  ${b.durMax ? `${b.durMin?b.durMin+"–":""}${b.durMax} ${b.durUnit||"seconds"}` : "[Not recorded]"}`);
    if (multi) lines.push("");
  });

  // ── SECTION 5 ────────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 5 — What are the predictors for the behavior?");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    if (multi) lines.push(bLabel(key));
    lines.push(q("Antecedents / predictors:"));
    lines.push(bullets(b.ants));
    if (b.antNote) { lines.push(q("Additional context:")); lines.push(`  ${b.antNote}`); }
    if (multi) lines.push("");
  });

  // ── SECTIONS 6–7 ─────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTIONS 6–7 — Environmental factors and necessary modifications");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    if (multi) lines.push(bLabel(key));
    lines.push(q("Environmental modifications needed:"));
    if ((b.envSel||[]).length) {
      b.envSel.forEach(item => {
        lines.push(`  • ${item}`);
        const note = (b.envS7||{})[item];
        if (note) lines.push(`    → ${note}`);
      });
    } else { lines.push("  [Not completed]"); }
    if (b.envWho) { lines.push(q("Responsible party:")); lines.push(`  ${b.envWho}`); }
    if (multi) lines.push("");
  });

  // ── SECTION 8 ────────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 8 — Function of behavior");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    if (multi) lines.push(bLabel(key));
    lines.push(q("Function(s):"));
    const fns = (b.fns||[]).map(f => FN_LABELS[f]||f);
    lines.push(fns.length ? fns.map(f=>`  • ${f}`).join("\n") : "  [Not completed]");
    if ((b.fnFrames||[]).length) {
      lines.push(q("Evidence / how we know:"));
      lines.push(b.fnFrames.map(f=>`  • ${f}`).join("\n"));
    }
    if (multi) lines.push("");
  });

  // ── SECTION 9 ────────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 9 — Replacement behavior (FERB)");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    if (multi) lines.push(bLabel(key));
    lines.push(q("What the student will do instead:"));
    lines.push(bullets(b.ferbs));
    if (b.ferbQ1) { lines.push(q("Why this FERB:")); lines.push(`  ${b.ferbQ1}`); }
    if (b.ferbQ2) { lines.push(q("How it meets the function:")); lines.push(`  ${b.ferbQ2}`); }
    if (multi) lines.push("");
  });

  // ── SECTION 10 ───────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 10 — Teaching strategies and materials");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    if (multi) lines.push(bLabel(key));
    lines.push(q("Teaching strategies:"));
    lines.push(bullets(b.teach));
    if (b.teachSetting)    { lines.push(q("Setting:")); lines.push(`  ${b.teachSetting}`); }
    if (b.teachMaterials)  { lines.push(q("Materials:")); lines.push(`  ${b.teachMaterials}`); }
    if (b.teachStart)      { lines.push(q("When to begin:")); lines.push(`  ${b.teachStart}`); }
    if (b.teachLooksLike)  { lines.push(q("What mastery looks like:")); lines.push(`  ${b.teachLooksLike}`); }
    lines.push(q("FERB goal:"));
    const ferb0 = (b.ferbs||[])[0]||"[FERB]";
    const ant = b.ferbGoalAnt ? `, when ${b.ferbGoalAnt},` : "";
    if (b.goalType==="pt") {
      lines.push(`  By ${b.ferbGoalDate||"[date]"}${ant} ${name} will ${ferb0} at ${b.ptRate||"[#]"} correct responses per minute with ${b.ptAccuracy||"[%]"}% accuracy across ${b.ptTimings||"[#]"} consecutive 1-minute timing periods.`);
    } else {
      lines.push(`  By ${b.ferbGoalDate||"[date]"}${ant} ${name} will ${ferb0} ${b.ferbGoalData||"[data method]"}.`);
    }
    if (multi) lines.push("");
  });

  // ── SECTION 11 ───────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 11 — Reinforcement, establishment, generalization, maintenance & training");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    if (multi) lines.push(bLabel(key));

    lines.push(q("Reinforcers:"));
    const reinf = [...(b.reinf||[]),...(b.reinfItems||[])];
    lines.push(reinf.length ? reinf.map(r=>`  • ${r}`).join("\n") : "  [Not completed]");
    if ((b.reinfCustom||"").trim()) { lines.push(q("Additional reinforcers:")); lines.push(`  ${b.reinfCustom}`); }
    if ((b.reinfSchedule||[]).length) { lines.push(q("Delivery schedule:")); lines.push(bullets(b.reinfSchedule)); }
    if (b.reinfBasis) { lines.push(q("How reinforcer was identified:")); lines.push(`  ${b.reinfBasis}`); }

    lines.push(q("Who will establish the FERB:"));
    lines.push(`  ${[...(b.establishWho||[]),b.establishOther].filter(Boolean).join(", ")||"[Not completed]"}`);

    lines.push(q("Generalization plan:"));
    lines.push(bullets(b.genStrategies));
    if (b.genNote) lines.push(`  ${b.genNote}`);

    lines.push(q("Maintenance plan:"));
    lines.push(bullets(b.maintStrategies));
    if (b.maintNote) lines.push(`  ${b.maintNote}`);

    lines.push(q("Who will be trained on this BIP:"));
    lines.push(`  ${[...(b.trainWho||[]),b.trainOther].filter(Boolean).join(", ")||"[Not completed]"}`);
    lines.push(q("Training methods:"));
    lines.push(bullets(b.trainMethods));
    if (b.trainWhen) { lines.push(q("When training will happen:")); lines.push(`  ${b.trainWhen}`); }

    if (multi) lines.push("");
  });

  // ── SECTION 12 ───────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 12 — Reactive strategies if the problem behavior occurs again");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    const rx = b.reactive||{};
    if (multi) lines.push(bLabel(key));

    lines.push(q("Who will respond:"));
    lines.push(`  ${(rx.reactiveWho||[]).join(", ")||"[Not completed]"}`);

    const phases = [
      {k:"p1",      label:"Phase 1 — Make the environment safer"},
      {k:"p2",      label:"Phase 2 — Prompt the FERB"},
      {k:"p3help",  label:"Phase 3a — Help: communicate needs"},
      {k:"p3prompt",label:"Phase 3b — Prompt: suggest calming"},
      {k:"p3wait",  label:"Phase 3c — Wait: withhold attention"},
      {k:"p4",      label:"Phase 4 — Re-entry task"},
      {k:"p5signals",label:"Phase 5 — Signs student has recovered"},
    ];
    phases.forEach(ph => {
      const items = rx[ph.k]||[];
      if (!items.length) return;
      lines.push(q(ph.label+":"));
      lines.push(items.map(i=>`  • ${i}`).join("\n"));
    });
    if (rx.roomEvac) {
      lines.push(q("Room evacuation:"));
      lines.push(`  May be needed.${rx.roomEvacNote?" "+rx.roomEvacNote:""}`);
    }
    if (rx.p5RecoveryTime) { lines.push(q("Typical recovery time:")); lines.push(`  ${rx.p5RecoveryTime}`); }
    if (rx.p5Debrief)      { lines.push(q("Debrief procedure:")); lines.push(`  ${rx.p5Debrief}`); }
    const post = [rx.p5Document&&"Document using ABC Data Sheet", rx.p5Admin&&"Notify administrator", rx.p5Family&&"Contact family", rx.p5TeamDebrief&&"Team debrief"].filter(Boolean);
    if (post.length) { lines.push(q("Post-incident procedures:")); lines.push(post.map(p=>`  • ${p}`).join("\n")); }

    if (multi) lines.push("");
  });

  // ── SECTION 13 ───────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 13 — Behavior reduction goal(s)");
  lines.push(line);
  behs.forEach(({key, type}) => {
    const b = d[key]||{};
    if (multi) lines.push(bLabel(key));
    lines.push(q("Reduction goal:"));
    if (b.redGoalDate && b.redGoalTarget && b.redGoalData) {
      const base = b.freqMax ? `${b.freqMin?b.freqMin+"–":""}${b.freqMax} times per ${b.freqUnit||"day"}` : "[baseline]";
      lines.push(`  By ${b.redGoalDate}, ${name} will reduce ${type||"the target behavior"} from a baseline of ${base} to ${b.redGoalTarget} ${b.redGoalUnit||"times per day"} as measured by ${b.redGoalData} across ${b.redGoalConsec||"[#]"} consecutive ${b.freqUnit==="week"?"weeks":"school days"}.`);
    } else { lines.push("  [Not completed]"); }
    if (multi) lines.push("");
  });

  // ── SECTION 14 ───────────────────────────────────────────
  lines.push("");
  lines.push(div);
  lines.push("SECTION 14 — Home–school communication plan");
  lines.push(line);
  const c = d.comms||{};
  lines.push(q("Primary contact:"));
  lines.push(`  ${[c.contactName, c.contactMethod].filter(Boolean).join("  ·  ")||"[Not completed]"}`);
  lines.push(q("Routine progress communication methods:"));
  lines.push(bullets(c.commsMethod));
  if (c.commsFreq) { lines.push(q("Frequency / details:")); lines.push(`  ${c.commsFreq}`); }
  lines.push(q("Incident notification procedure:"));
  lines.push(bullets(c.commsIncident));
  lines.push(q("How family input will be gathered:"));
  lines.push(`  ${a(c.familyInput)}`);
  if ((c.lang||[]).length) { lines.push(q("Language access:")); lines.push(`  ${c.lang.join(", ")}${c.langNote?" — "+c.langNote:""}`); }

  lines.push("");
  lines.push(div);
  lines.push("Generated by BehaviorPath · BASIL Behavior Lab · basilbehaviorlab.org");
  lines.push(div);

  return lines.join("\n");
}


// ────────────────────────────────────────────────────────────
// ── screens/Welcome
// ────────────────────────────────────────────────────────────

function WelcomeScreen({ go, mode, setMode }) {
  return (
    <div>
      <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
        <div style={{ fontSize: 50, marginBottom: 14 }}>🪷</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: B.forest, marginBottom: 2 }}>
          BehaviorPath
        </h1>
        <div style={{ fontSize: 17, color: B.teal, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", marginBottom: 8, letterSpacing: 0.3 }}>
          Where Behavior Plans Begin
        </div>
        <div style={{ fontSize: 10, color: B.muted, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginBottom: 20, fontFamily: "'DM Sans',sans-serif" }}>
          by BASIL Behavior Lab
        </div>
        <blockquote style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: "italic", color: B.teal, lineHeight: 1.9, maxWidth: 420, margin: "0 auto 8px", padding: "0 12px" }}>
          "When a flower doesn't bloom, you fix the environment in which it grows, not the flower."
        </blockquote>
        <div style={{ fontSize: 11.5, color: B.muted, fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>
          — Alexander Den Heijer
        </div>
      </div>

      <div style={{ background: B.mint + "66", borderRadius: 12, padding: "16px 20px", marginBottom: 20, textAlign: "center" }}>
        <p style={{ fontSize: 14, color: B.teal, lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
          A guided, step-by-step path to building individualized, evidence-based Behavior Intervention Plans — one question at a time.
        </p>
      </div>

      <Box type="info">This plan follows the structure of the <strong>SIRAS IEP Form 6G</strong> — Behavior Intervention Plan. Your answers are saved as you walk the path.</Box>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => go(1)}
          style={{ padding: "13px 36px", borderRadius: 11, border: "none", cursor: "pointer", background: B.forest, color: B.white, fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.3 }}
        >
          Begin the Path →
        </button>
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Student
// ────────────────────────────────────────────────────────────

function renderStudent({ d, upd, Nav }) {
  return (
    <div>
      <div style={{marginBottom:14,color:B.forest}}><Sprout size={38} strokeWidth={1.5}/></div>
      <H>Student information</H>
      <P>A few basics to anchor the plan. Use initials only to protect student privacy.</P>
      <div style={{display:"flex",gap:12,marginBottom:14}}>
        <div style={{flex:2}}>
          <SL>Student Initials</SL>
          <input
            value={d.name}
            onChange={e => {
              const v = e.target.value.replace(/[^a-zA-Z.]/g,"").slice(0,4).toUpperCase();
              upd("name", v);
            }}
            placeholder="e.g., M.L."
            maxLength={4}
            style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",border:`1.5px solid ${B.border}`,borderRadius:9,fontSize:13,color:B.bark,fontFamily:"'DM Sans',sans-serif",background:B.warmWhite,outline:"none",letterSpacing:1.5}}
          />
          <div style={{fontSize:10.5,color:B.muted,marginTop:4,fontFamily:"'DM Sans',sans-serif"}}>Initials only — up to 4 characters</div>
        </div>
      </div>
      <SL>BIP Level</SL>
      <select value={d.level} onChange={e=>upd("level",e.target.value)} style={{width:"100%",padding:"10px 14px",border:`1.5px solid ${B.border}`,borderRadius:9,fontSize:13,background:B.warmWhite,outline:"none",fontFamily:"'DM Sans',sans-serif",color:B.bark,cursor:"pointer"}}>
        <option value="early stage">Early Stage Intervention</option>
        <option value="moderate">Moderate</option>
        <option value="serious">Serious</option>
        <option value="extreme">Extreme</option>
      </select>
      <Nav ok={d.name.trim().length > 0}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Behavior
// ────────────────────────────────────────────────────────────

function getBehTemplate(typeKey, nm) {
  const templates = {
    "Aggression toward others": `Aggression toward others: Any instance of ${nm} striking, kicking, or hitting another person with their hands or feet, resulting in observable physical contact and potential harm to the recipient.`,
    "Self-injury / SIB": `Self-injury / SIB: Any instance of ${nm} engaging in repetitive self-directed physical harm, including hitting, banging, or scratching their own body, resulting in observable and intentional physical contact to self.`,
    "Property destruction": `Property destruction: Any instance of ${nm} forcefully displacing, throwing, or damaging objects or materials in the environment, resulting in the displacement or destruction of those items.`,
    "Verbal / vocal disruption": `Verbal / vocal disruption: Any instance of ${nm} engaging in loud or disruptive vocalizations, including yelling, screaming, or other vocal expressions that disrupt the learning environment.`,
    "Elopement / running": `Elopement / running: Any instance of ${nm} leaving their designated area, seat, or environment without permission or without following established routines or guidelines.`,
    "Non-academic electronic use": `Non-academic electronic use: Any instance of ${nm} accessing or using electronic devices (phone, tablet, computer) for non-instructional purposes during scheduled instructional time without permission.`,
    "Inappropriate physical contact": `Inappropriate physical contact: Any instance of ${nm} making physical contact with another person without consent, including touching, grabbing, or proximity violations that are unwanted by the recipient.`,
    "Object appropriation": `Object appropriation: Any instance of ${nm} taking, removing, or possessing items belonging to others or to the environment without permission, regardless of intent to return.`,
    "Other (describe)": `Any instance of ${nm} engaging in [describe the behavior in observable, measurable terms], resulting in [observable impact on environment, others, or learning].`,
  };
  return templates[typeKey] || "";
}

function renderBehavior({ d, upd, sec, Nav }) {
  const nm = d.name || "Student";
  const applyTemplate = (typeKey, field) => upd(field, getBehTemplate(typeKey, nm));

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Camera size={38} strokeWidth={1.5}/></div>
      <H>The behavior impeding learning is…</H>
      <P>Select the behavior type — it becomes the name and pre-fills a definition template. Edit to match exactly what this student does.</P>
      <Box type="peach"><strong>Dignity reminder:</strong> Use observable, measurable language only. Words like "manipulative," "defiant," or "attention-seeking" assign intent rather than describing behavior.</Box>

      {/* Behavior 1 */}
      <div style={{background:B.cream,borderRadius:12,padding:"16px 18px",marginBottom:16,border:`1.5px solid ${B.border}`}}>
        <SL>Behavior 1 — Select Type</SL>
        <div style={{display:"flex",flexWrap:"wrap",marginBottom:d.beh1type?12:0}}>
          {BEHAVIOR_TYPES.map(t=>(
            <Pill key={t} label={t} sel={d.beh1type===t} color={B.teal} onClick={()=>{
              const newType = d.beh1type===t ? "" : t;
              upd("beh1type", newType);
              if(newType) applyTemplate(newType, "beh1");
              else upd("beh1","");
            }}/>
          ))}
        </div>
        {d.beh1type && <>
          <SL>Behavior 1 — Operational Definition</SL>
          <div style={{fontSize:11,color:B.muted,fontFamily:"'DM Sans',sans-serif",marginBottom:6}}>
            Template pre-filled — edit to describe exactly what <strong>{nm}</strong> does.
          </div>
          <TA value={d.beh1} onChange={v=>upd("beh1",v)} rows={4}/>
          <div style={{fontSize:10.5,color:B.muted,marginTop:5,fontFamily:"'DM Sans',sans-serif"}}>
            Include: specific action · body part or object · observable result · what it does NOT include
          </div>
        </>}
      </div>

      {/* Behavior 2 — only after B1 defined */}
      {d.beh1.trim().length > 20 && (
        <div style={{background:B.cream,borderRadius:12,padding:"16px 18px",marginBottom:16,border:`1.5px solid ${B.border}`}}>
          <SL>Behavior 2 <span style={{color:B.muted,fontWeight:400,textTransform:"none",fontSize:11}}>— optional</span></SL>
          <div style={{display:"flex",flexWrap:"wrap",marginBottom:d.beh2type?12:0}}>
            {BEHAVIOR_TYPES.map(t=>(
              <Pill key={t} label={t} sel={d.beh2type===t} color={B.teal} onClick={()=>{
                const newType = d.beh2type===t ? "" : t;
                upd("beh2type", newType);
                if(newType) applyTemplate(newType, "beh2");
                else upd("beh2","");
              }}/>
            ))}
          </div>
          {d.beh2type && <>
            <SL>Behavior 2 — Operational Definition</SL>
            <div style={{fontSize:11,color:B.muted,fontFamily:"'DM Sans',sans-serif",marginBottom:6}}>
              Template pre-filled — edit to describe exactly what <strong>{nm}</strong> does.
            </div>
            <TA value={d.beh2} onChange={v=>upd("beh2",v)} rows={4}/>
          </>}
        </div>
      )}

      <Nav ok={d.beh1.trim().length > 20}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Impedes
// ────────────────────────────────────────────────────────────

function renderImpedes({ d, togB, setSame, sec, hasTwoBehaviors, activeBkeys, Nav }) {
  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const isSame = d.same.impedes && bk==="b2";
    return (
      <div key={bk} style={{marginBottom:16}}>
        {hasTwoBehaviors && <>
          <BehHeader bkey={bk} btype={btype} color={bk==="b1"?B.teal:B.forest}/>
          <SameBanner secKey="impedes" same={d.same.impedes} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
        </>}
        {isSame
          ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
          : <>
            <div style={{fontSize:11.5,color:B.teal,fontFamily:"'DM Sans',sans-serif",marginBottom:10,padding:"7px 11px",background:B.mint+"44",borderRadius:8}}>
              Select up to <strong>2 most impactful</strong> — {2-(b.impedes||[]).length} remaining
            </div>
            <div style={{display:"flex",flexWrap:"wrap"}}>
              {IMPEDES.map(o=>{
                const sel=(b.impedes||[]).includes(o);
                const maxed=(b.impedes||[]).length>=2&&!sel;
                return <Pill key={o} label={o} sel={sel} onClick={()=>!maxed&&togB(bk,"impedes",o)} color={maxed?B.border:bk==="b1"?B.teal:B.forest}/>;
              })}
            </div>
          </>
        }
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Leaf size={38} strokeWidth={1.5}/></div>
      <H>It impedes learning because…</H>
      <P>Select up to 2 most impactful reasons per behavior. This is the documented justification for the BIP.</P>
      <p style={{fontSize:15,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif",color:B.teal,marginBottom:16}}>The behavior…</p>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>(d[bk].impedes||[]).length>0)}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Baseline
// ────────────────────────────────────────────────────────────

function renderBaseline({ d, updB, setSame, sec, hasTwoBehaviors, activeBkeys, Nav }) {
  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const isSame = d.same.baseline && bk==="b2";
    const intensityType = bk==="b1" ? d.beh1type : d.beh2type;
    return (
      <div key={bk} style={{marginBottom:20}}>
        {hasTwoBehaviors && <>
          <BehHeader bkey={bk} btype={btype} color={bk==="b1"?B.teal:B.forest}/>
          <SameBanner secKey="baseline" same={d.same.baseline} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
        </>}
        {isSame
          ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
          : <>
            <div style={{marginBottom:16}}>
              <SL>Frequency</SL>
              <div style={{fontSize:13,color:B.bark,fontFamily:"'DM Sans',sans-serif",marginBottom:8}}>{d.name||"The student"} engages in this behavior</div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:8}}>
                <input type="number" min="0" value={b.freqMin||""} onChange={e=>updB(bk,"freqMin",e.target.value)}
                  placeholder="min" style={{width:72,padding:"9px 10px",border:`1.5px solid ${(b.freqMin||b.freqMax)?B.sage:B.border}`,borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:(b.freqMin||b.freqMax)?"#EAF3EE":B.warmWhite,outline:"none"}}/>
                <span style={{fontSize:13,color:B.muted,fontFamily:"'DM Sans',sans-serif"}}>to</span>
                <input type="number" min="0" value={b.freqMax||""} onChange={e=>updB(bk,"freqMax",e.target.value)}
                  placeholder="max" style={{width:72,padding:"9px 10px",border:`1.5px solid ${(b.freqMin||b.freqMax)?B.sage:B.border}`,borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:(b.freqMin||b.freqMax)?"#EAF3EE":B.warmWhite,outline:"none"}}/>
                <span style={{fontSize:13,color:B.bark,fontFamily:"'DM Sans',sans-serif"}}>times per</span>
                <select value={b.freqUnit||"day"} onChange={e=>updB(bk,"freqUnit",e.target.value)}
                  style={{padding:"9px 12px",border:`1.5px solid ${B.border}`,borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:B.warmWhite,outline:"none",cursor:"pointer",color:B.bark}}>
                  {["minute","hour","period","day","week","month"].map(u=><option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              {(b.freqMin||b.freqMax)&&<div style={{fontSize:11.5,color:B.teal,fontStyle:"italic",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>"{d.name||"Student"} engages in this behavior {b.freqMin||"?"} to {b.freqMax||"?"} times per {b.freqUnit||"day"}"</div>}
              <TI value={b.freqCtx||""} onChange={v=>updB(bk,"freqCtx",v)} placeholder="Context: observed over a 5-day baseline period..."/>
            </div>
            <div style={{marginBottom:16}}>
              <SL>Intensity — Each episode…</SL>
              {(INTENSITY[intensityType]||INTENSITY["default"]).map(o=><Chk key={o} label={o} checked={b.intensity===o} onChange={()=>updB(bk,"intensity",b.intensity===o?"":o)}/>)}
            </div>
            <div>
              <SL>Duration — Episodes typically last</SL>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:6}}>
                <input type="number" min="0" value={b.durMin||""} onChange={e=>updB(bk,"durMin",e.target.value)}
                  placeholder="min" style={{width:72,padding:"9px 10px",border:`1.5px solid ${B.border}`,borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:B.warmWhite,outline:"none"}}/>
                <span style={{fontSize:13,color:B.muted}}>to</span>
                <input type="number" min="0" value={b.durMax||""} onChange={e=>updB(bk,"durMax",e.target.value)}
                  placeholder="max" style={{width:72,padding:"9px 10px",border:`1.5px solid ${B.border}`,borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:B.warmWhite,outline:"none"}}/>
                <select value={b.durUnit||"seconds"} onChange={e=>updB(bk,"durUnit",e.target.value)}
                  style={{padding:"9px 12px",border:`1.5px solid ${B.border}`,borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:B.warmWhite,outline:"none",cursor:"pointer"}}>
                  {["seconds","minutes","hours"].map(u=><option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div style={{fontSize:11,color:B.muted,fontFamily:"'DM Sans',sans-serif"}}>Must be a measurable range to track progress</div>
            </div>
          </>
        }
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><BarChart2 size={38} strokeWidth={1.5}/></div>
      <H>Frequency or intensity or duration of behavior</H>
      <P>Your baseline "before" snapshot. Use specific numbers — avoid "often" or "throughout the day."</P>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>[(d[bk].freqMin||d[bk].freqMax),d[bk].intensity,(d[bk].durMin||d[bk].durMax)].filter(Boolean).length>=2)}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Antecedents
// ────────────────────────────────────────────────────────────

function renderAntecedents({ d, updB, togB, setSame, sec, hasTwoBehaviors, activeBkeys, Nav }) {
  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const isSame = d.same.ants && bk==="b2";
    return (
      <div key={bk} style={{marginBottom:16}}>
        {hasTwoBehaviors && <>
          <BehHeader bkey={bk} btype={btype} color={bk==="b1"?B.teal:B.forest}/>
          <SameBanner secKey="ants" same={d.same.ants} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
        </>}
        {isSame
          ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
          : <>
            {ANTECEDENTS.map((o,i)=><Chk key={o} label={`${i+1}.  ${o}`} checked={(b.ants||[]).includes(o)} onChange={()=>togB(bk,"ants",o)}/>)}
            <div style={{marginTop:10}}>
              <SL>Additional context <span style={{color:B.muted,fontWeight:400,textTransform:"none"}}>— optional</span></SL>
              <TA value={b.antNote||""} onChange={v=>updB(bk,"antNote",v)} placeholder="Specific times, subjects, people, or settings..." rows={2}/>
            </div>
          </>
        }
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Search size={38} strokeWidth={1.5}/></div>
      <H>What are the predictors for the behavior?</H>
      <P>Situations in which the behavior is likely to occur: people, time, place, subject, activity.</P>
      <Box type="info">📋 <strong>Reference your ABC Data Sheet</strong> — antecedent numbers on the sheet correspond to the predictors below.</Box>
      <p style={{fontSize:15,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif",color:B.teal,marginBottom:14}}>The behavior is most likely to occur when…</p>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>(d[bk].ants||[]).length>=1)}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Environment
// ────────────────────────────────────────────────────────────

function renderEnvironment({ d, updB, setSame, setD, sec, hasTwoBehaviors, activeBkeys, Nav }) {
  const togSel = (bk, num) => setD(p => {
    const cur = p[bk].envSel||[];
    const already = cur.includes(num);
    const newSel = already ? cur.filter(x=>x!==num) : [...cur, num];
    const newS7 = already ? Object.fromEntries(Object.entries(p[bk].envS7||{}).filter(([k])=>k!==num)) : (p[bk].envS7||{});
    return {...p, [bk]:{...p[bk], envSel:newSel, envS7:newS7}};
  });

  const togS7 = (bk, num, remedy) => setD(p => {
    const cur = ((p[bk].envS7||{})[num])||[];
    return {...p, [bk]:{...p[bk], envS7:{...(p[bk].envS7||{}), [num]: cur.includes(remedy)?cur.filter(x=>x!==remedy):[...cur,remedy]}}};
  });

  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const bSel = b.envSel||[];
    const atMax = bSel.length >= 2;
    const bColor = bk==="b1" ? B.teal : B.forest;
    const isSame = d.same.env && bk==="b2";
    return (
      <div key={bk} style={{marginBottom:20}}>
        {hasTwoBehaviors && <>
          <BehHeader bkey={bk} btype={btype} color={bColor}/>
          <SameBanner secKey="env" same={d.same.env} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
        </>}
        {isSame
          ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
          : <>
            <div style={{fontSize:11.5,color:bColor,fontFamily:"'DM Sans',sans-serif",marginBottom:12,padding:"8px 12px",background:bColor+"22",borderRadius:8}}>
              Select up to <strong>2 areas</strong> — <strong>{2-bSel.length}</strong> remaining
            </div>
            <div style={{fontWeight:700,fontSize:11.5,color:bColor,fontFamily:"'DM Sans',sans-serif",marginBottom:8,letterSpacing:0.5}}>SECTION 6 — What supports this behavior?</div>
            {EA_ITEMS.map(ea => {
              const sel = bSel.includes(ea.num);
              const disabled = atMax && !sel;
              return (
                <button key={ea.num} onClick={()=>!disabled&&togSel(bk,ea.num)}
                  style={{width:"100%",textAlign:"left",padding:"10px 13px",marginBottom:7,borderRadius:10,
                    border:`2px solid ${sel?bColor:B.border}`,background:sel?bColor+"15":B.white,
                    cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.4:1,
                    fontFamily:"'DM Sans',sans-serif",transition:"all 0.13s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <span style={{fontSize:12,fontWeight:800,color:sel?bColor:B.muted,minWidth:24}}>#{ea.num}</span>
                    <span style={{fontSize:13,fontWeight:sel?600:400,color:sel?bColor:B.bark}}>{ea.label}</span>
                    {sel&&<span style={{marginLeft:"auto",fontSize:10,fontWeight:700,background:bColor,color:"#fff",borderRadius:6,padding:"2px 7px"}}>✓ flagged</span>}
                  </div>
                  {ea.sub.length>0&&<div style={{fontSize:10.5,color:B.muted,marginTop:2,marginLeft:33}}>{ea.sub.join(" · ")}</div>}
                  {sel&&<div style={{fontSize:11.5,color:bColor,fontStyle:"italic",marginTop:5,marginLeft:33,lineHeight:1.4}}>{ea.s6}</div>}
                </button>
              );
            })}
            {bSel.length>0 && <>
              <div style={{fontWeight:700,fontSize:11.5,color:bColor,fontFamily:"'DM Sans',sans-serif",margin:"16px 0 8px",letterSpacing:0.5}}>SECTION 7 — What changes are needed?</div>
              {EA_ITEMS.filter(ea=>bSel.includes(ea.num)).map(ea => {
                const s7sel = (b.envS7||{})[ea.num]||[];
                return (
                  <div key={ea.num} style={{marginBottom:14}}>
                    <div style={{fontSize:12,fontWeight:700,color:bColor,fontFamily:"'DM Sans',sans-serif",marginBottom:7,padding:"6px 11px",background:bColor+"18",borderRadius:7,borderLeft:`3px solid ${bColor}`}}>#{ea.num} — {ea.label}</div>
                    {ea.s7.map(remedy=><Chk key={remedy} label={remedy} checked={s7sel.includes(remedy)} onChange={()=>togS7(bk,ea.num,remedy)}/>)}
                  </div>
                );
              })}
              <SL c={bColor}>Who will establish and monitor?</SL>
              <TA value={b.envWho||""} onChange={v=>updB(bk,"envWho",v)} placeholder="e.g., Case manager prints schedule card by Friday. Teacher reviews 1:1 daily." rows={2}/>
            </>}
          </>
        }
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Home size={38} strokeWidth={1.5}/></div>
      <H>What supports the student using the problem behavior?</H>
      <P>Use your EA Data Sheet — select items marked Δ or − for each behavior. Max 2 per behavior.</P>
      <Box type="info">📋 <strong>Reference your EA Data Sheet</strong> — items marked Δ (needs change) or − (missing) are your targets.</Box>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>(d[bk].envSel||[]).length>=1)}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Function
// ────────────────────────────────────────────────────────────

// Function calculator — antecedent + consequence → function scores
const FN_MAP = {
  escape:     { ants: [0,1,2,3,4,5,6,12], cons: ["E"] },
  attention:  { ants: [6,7,8,12],         cons: ["A","P"] },
  tangible:   { ants: [1],                cons: ["T"] },
  sensory_on: { ants: [9,10,11],          cons: ["S"] },
  sensory_off:{ ants: [9,10,11,12],       cons: ["S","E"] },
};

// Antecedent short labels (index matches ANTECEDENTS array)
const ANT_SHORT_LABELS = [
  "Non-preferred demand",
  "Preferred activity interrupted/denied",
  "Transition between activities",
  "Schedule change",
  "Multi-step directions",
  "Task too difficult/long",
  "Attention diverted",
  "Working independently",
  "Unstructured setting",
  "Loud/overstimulating environment",
  "Sensory triggers",
  "Unfamiliar adult",
  "Peer conflict/proximity",
];

const C_CODES = [
  { code:"A", label:"Adult attention given" },
  { code:"P", label:"Peer attention given" },
  { code:"E", label:"Escape / task removed" },
  { code:"T", label:"Tangible item given" },
  { code:"S", label:"Sensory relief" },
  { code:"N", label:"No clear consequence" },
  { code:"R", label:"Redirection given" },
  { code:"I", label:"Ignored / no response" },
];

const FN_HOW = {
  escape:     "Behavior occurs after a demand, transition, or non-preferred activity is presented and stops when the task or demand is removed.",
  attention:  "Behavior occurs when attention is diverted or unavailable, and increases when staff or peers respond — even with redirection or reprimands.",
  tangible:   "Behavior occurs when a preferred item or activity is denied and stops once the student gets access to it.",
  sensory_on: "Behavior appears self-reinforcing — it occurs regardless of social context and seems to provide pleasurable or calming sensory input.",
  sensory_off:"Behavior occurs in overwhelming or overstimulating environments and stops when the student is removed or the trigger is eliminated.",
};

function FnCalculator({ antecedents, onResult, bk }) {
  // Pre-populate from Section 5 — convert selected strings to indices
  const initAnts = (antecedents||[]).map(a => ANTECEDENTS.indexOf(a)).filter(i => i !== -1);
  const [selAnts, setSelAnts] = useState(initAnts);
  const [selCons, setSelCons] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const togAnt = i => setSelAnts(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]);
  const togCon = c => setSelCons(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c]);

  // Score each function
  const scores = FUNCTIONS.map(fn => {
    const map = FN_MAP[fn.id] || { ants:[], cons:[] };
    const antScore = selAnts.filter(i => map.ants.includes(i)).length;
    const conScore = selCons.filter(c => map.cons.includes(c)).length;
    return { fn, score: antScore * 2 + conScore * 3, antScore, conScore };
  }).sort((a,b) => b.score - a.score);

  const topScore = scores[0]?.score || 0;
  const topFns = scores.filter(s => s.score > 0 && s.score >= topScore * 0.6);
  const hasData = selAnts.length > 0 || selCons.length > 0;

  return (
    <div style={{background:"#F7FAF8",borderRadius:12,padding:"14px 16px",marginBottom:16,border:`1.5px solid ${B.sage}`}}>
      <div style={{fontSize:10,fontWeight:700,color:B.sage,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4,fontFamily:"'DM Sans',sans-serif"}}>
        📋 Function Calculator — from your ABC Data Sheet
      </div>
      <div style={{fontSize:11.5,color:B.bark,fontFamily:"'DM Sans',sans-serif",marginBottom:10,lineHeight:1.5}}>
        Your Section 5 predictors are pre-loaded below. Add or remove any, then select the most common consequence codes from your ABC sheet.
      </div>

      {/* Antecedents */}
      <div style={{fontSize:11,fontWeight:600,color:B.teal,marginBottom:6,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:0.8}}>Antecedents (A) — pre-loaded from Section 5</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {ANT_SHORT_LABELS.map((label,i) => {
          const sel = selAnts.includes(i);
          return (
            <button key={i} onClick={()=>togAnt(i)}
              style={{padding:"4px 9px",borderRadius:8,fontSize:11.5,fontFamily:"'DM Sans',sans-serif",fontWeight:sel?600:400,
                border:`1.5px solid ${sel?B.teal:B.border}`,background:sel?B.teal:B.white,
                color:sel?B.white:B.bark,cursor:"pointer",transition:"all 0.12s"}}>
              {i+1}. {label}
            </button>
          );
        })}
      </div>

      {/* Consequences */}
      <div style={{fontSize:11,fontWeight:600,color:"#5C3317",marginBottom:6,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:0.8}}>Most common consequences (C column)</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
        {C_CODES.map(({code,label}) => {
          const sel = selCons.includes(code);
          return (
            <button key={code} onClick={()=>togCon(code)}
              style={{padding:"4px 9px",borderRadius:8,fontSize:11.5,fontFamily:"'DM Sans',sans-serif",fontWeight:sel?600:400,
                border:`1.5px solid ${sel?"#5C3317":B.border}`,background:sel?"#5C3317":B.white,
                color:sel?B.white:B.bark,cursor:"pointer",transition:"all 0.12s"}}>
              <strong>{code}</strong> — {label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {hasData && (
        <div>
          <div style={{fontSize:10,fontWeight:700,color:B.sage,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>Likely function(s)</div>
          {scores.filter(s=>s.score>0).map(({fn,score,antScore,conScore}) => {
            const pct = topScore > 0 ? Math.round((score/topScore)*100) : 0;
            const isTop = topFns.some(t=>t.fn.id===fn.id);
            return (
              <div key={fn.id} style={{marginBottom:10,padding:"10px 12px",borderRadius:10,
                background:isTop?fn.color+"18":B.white,border:`1.5px solid ${isTop?fn.color:B.border}`,
                opacity: isTop ? 1 : 0.6}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <Icon ic={fn.ic} size={16} strokeWidth={2} color={fn.color}/>
                    <span style={{fontWeight:700,fontSize:13,color:fn.color,fontFamily:"'DM Sans',sans-serif"}}>{fn.label}</span>
                    {isTop && <span style={{fontSize:10,background:fn.color,color:"#fff",borderRadius:5,padding:"1px 6px",fontFamily:"'DM Sans',sans-serif"}}>top match</span>}
                  </div>
                  <span style={{fontSize:11,color:B.muted,fontFamily:"'DM Sans',sans-serif"}}>{antScore} ant · {conScore} con</span>
                </div>
                {/* Score bar */}
                <div style={{height:5,borderRadius:3,background:B.border,marginBottom:8}}>
                  <div style={{height:5,borderRadius:3,background:fn.color,width:`${pct}%`,transition:"width 0.3s"}}/>
                </div>
                {isTop && (
                  <div style={{fontSize:11.5,color:B.bark,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5,fontStyle:"italic"}}>
                    {FN_HOW[fn.id]}
                  </div>
                )}
              </div>
            );
          })}

          {/* Carry forward button */}
          {topFns.length > 0 && !confirmed && (
            <button onClick={()=>{ onResult(topFns.map(s=>s.fn.id)); setConfirmed(true); }}
              style={{marginTop:4,padding:"9px 16px",borderRadius:9,background:B.forest,color:B.white,
                border:"none",cursor:"pointer",fontSize:12.5,fontWeight:600,fontFamily:"'DM Sans',sans-serif",width:"100%"}}>
              ✓ Use {topFns.map(s=>s.fn.label).join(" + ")} as function — carry forward
            </button>
          )}
          {confirmed && (
            <div style={{marginTop:4,padding:"9px 14px",borderRadius:9,background:"#E6F2EE",fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>
              ✓ Function carried forward — confirm or adjust below
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function renderFunction({ d, togB, updB, setSame, sec, hasTwoBehaviors, activeBkeys, availFrames, Nav }) {
  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const bColor = bk==="b1" ? B.teal : B.forest;
    const af = availFrames(bk);

    const handleCalcResult = (fnIds) => {
      fnIds.forEach(id => {
        if (!(b.fns||[]).includes(id)) togB(bk,"fns",id);
      });
    };

    return (
      <div key={bk} style={{marginBottom:16}}>
        {hasTwoBehaviors && <BehHeader bkey={bk} btype={btype} color={bColor}/>}
        <>
            <FnCalculator key={bk} bk={bk} antecedents={b.ants||[]} onResult={handleCalcResult}/>
            <div style={{fontSize:10,fontWeight:700,color:B.sage,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>Confirm or adjust function</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {FUNCTIONS.map(fn => {
                const sel=(b.fns||[]).includes(fn.id);
                return (
                  <button key={fn.id} onClick={()=>togB(bk,"fns",fn.id)}
                    style={{padding:"9px 14px",borderRadius:11,fontSize:12.5,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                      border:`2px solid ${sel?fn.color:B.border}`,background:sel?fn.color:B.white,
                      color:sel?B.white:B.bark,cursor:"pointer",transition:"all 0.13s",textAlign:"left",minWidth:140}}>
                    <div style={{marginBottom:4,color:sel?B.white:fn.color}}><Icon ic={fn.ic} size={18} strokeWidth={1.8}/></div>
                    <div>{fn.label}</div>
                    <div style={{fontSize:10.5,opacity:0.8,fontWeight:400,marginTop:2,lineHeight:1.4}}>{fn.desc}</div>
                  </button>
                );
              })}
            </div>
            {(b.fns||[]).length>0 && <>
              <div style={{fontSize:10,fontWeight:700,color:B.sage,letterSpacing:1.2,textTransform:"uppercase",marginBottom:7,fontFamily:"'DM Sans',sans-serif"}}>Team believes the behavior occurs…</div>
              {af.map(f=><Chk key={f} label={`…${f}`} checked={(b.fnFrames||[]).includes(f)} onChange={()=>togB(bk,"fnFrames",f)}/>)}
            </>}
        </>
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Brain size={38} strokeWidth={1.5}/></div>
      <H>Function of behavior</H>
      <P>The function is what the student gets or avoids. Use your ABC data to identify the most likely function below.</P>
      <Box type="info">📋 <strong>Reference your ABC Data Sheet</strong> — use your most common A numbers and C codes in the calculator below.</Box>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>(d[bk].fns||[]).length>0&&(d[bk].fnFrames||[]).length>0)}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Ferb
// ────────────────────────────────────────────────────────────

function renderFerb({ d, togB, setSame, sec, hasTwoBehaviors, activeBkeys, availFerbs, Nav }) {
  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const isSame = d.same.ferb && bk==="b2";
    const bColor = bk==="b1" ? B.teal : B.forest;
    const af = availFerbs(bk);
    return (
      <div key={bk} style={{marginBottom:16}}>
        {hasTwoBehaviors && <>
          <BehHeader bkey={bk} btype={btype} color={bColor}/>
          <SameBanner secKey="ferb" same={d.same.ferb} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
        </>}
        {isSame
          ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
          : <>
            <Box type="info">Matched to: <strong>{(b.fns||[]).map(fid=>FUNCTIONS.find(f=>f.id===fid)?.label).join(", ")||"[No function selected]"}</strong></Box>
            {af.map(f=><Chk key={f.l} label={f.l} sub={`Materials: ${f.m}`} checked={(b.ferbs||[]).includes(f.l)} onChange={()=>togB(bk,"ferbs",f.l)}/>)}
          </>
        }
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><ArrowRightCircle size={38} strokeWidth={1.5}/></div>
      <H>What should the student do INSTEAD of the problem behavior?</H>
      <P>The FERB must give the student the same outcome as the challenging behavior — just acceptably.</P>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>(d[bk].ferbs||[]).length>0)}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Teaching
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
// ── FerbGoalBuilder — Standard + Precision Teaching goal types
// ────────────────────────────────────────────────────────────

function FerbGoalBuilder({ b, bk, bColor, updB, goalFerb, name }) {
  const goalType = b.goalType || "standard";
  const setType = t => updB(bk, "goalType", t);

  // Standard preview
  const stdPreview = `By ${b.ferbGoalDate||"[date]"}${b.ferbGoalAnt?`, when ${b.ferbGoalAnt},`:""} ${name||"the student"} will ${goalFerb} ${b.ferbGoalData||"[data collection method]"}.`;

  // PT preview
  const ptPreview = `By ${b.ferbGoalDate||"[date]"}${b.ferbGoalAnt?`, when ${b.ferbGoalAnt},`:""} ${name||"the student"} will ${goalFerb} at ${b.ptRate||"[#]"} correct responses per minute with ${b.ptAccuracy||"[%]"}% accuracy across ${b.ptTimings||"[#]"} consecutive 1-minute timing periods.`;

  const isPT = goalType === "pt";
  const hasPreview = isPT
    ? (b.ferbGoalDate || b.ptRate)
    : (b.ferbGoalDate || b.ferbGoalData);

  const inputStyle = {
    padding:"8px 11px", border:`1.5px solid #D0D8D4`, borderRadius:8,
    fontSize:13, fontFamily:"'DM Sans',sans-serif", background:"#FAFBF9", outline:"none",
  };

  return (
    <div style={{padding:"14px 16px",background:"#F5F0E8",borderRadius:12,border:`1.5px solid #D0D8D4`,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,color:bColor,fontSize:16}}>FERB Goal</div>
        {/* Goal type toggle */}
        <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:`1.5px solid ${bColor}44`,fontSize:11.5,fontFamily:"'DM Sans',sans-serif"}}>
          {[["standard","Standard"],["pt","Precision Teaching"]].map(([t,label])=>(
            <button key={t} onClick={()=>setType(t)}
              style={{padding:"5px 11px",border:"none",cursor:"pointer",fontWeight:goalType===t?700:400,
                background:goalType===t?bColor:"transparent",color:goalType===t?"#fff":"#555",transition:"all 0.15s",fontFamily:"'DM Sans',sans-serif",fontSize:11.5}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Shared: date + antecedent */}
      <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
        <span style={{fontSize:12,color:"#555",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>By</span>
        <input value={b.ferbGoalDate||""} onChange={e=>updB(bk,"ferbGoalDate",e.target.value)}
          placeholder="e.g., June 2026" style={{...inputStyle,flex:1,minWidth:120}}/>
      </div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,color:"#555",fontFamily:"'DM Sans',sans-serif",marginBottom:5}}>Antecedent condition <span style={{color:"#999",fontSize:11}}>(optional)</span></div>
        <input value={b.ferbGoalAnt||""} onChange={e=>updB(bk,"ferbGoalAnt",e.target.value)}
          placeholder="e.g., given a demand to complete a non-preferred task"
          style={{...inputStyle,width:"100%",boxSizing:"border-box"}}/>
      </div>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:12,color:"#555",fontFamily:"'DM Sans',sans-serif",marginBottom:5}}>{name||"Student"} will… <span style={{color:"#999",fontSize:11}}>(from Section 9)</span></div>
        <div style={{padding:"9px 12px",background:"#fff",borderRadius:8,border:`1.5px solid #84B59F55`,fontSize:13,color:"#0B4238",fontFamily:"'DM Sans',sans-serif"}}>{goalFerb}</div>
      </div>

      {/* STANDARD fields */}
      {!isPT && (
        <div style={{marginBottom:12}}>
          <div style={{fontSize:12,color:"#555",fontFamily:"'DM Sans',sans-serif",marginBottom:5}}>Mastery criterion</div>
          <div style={{display:"flex",flexWrap:"wrap"}}>
            {DATA_METHODS.map(m=><Pill key={m} label={m} sel={b.ferbGoalData===m} onClick={()=>updB(bk,"ferbGoalData",b.ferbGoalData===m?"":m)} color={bColor}/>)}
          </div>
          <input value={(DATA_METHODS.includes(b.ferbGoalData||"")?"":b.ferbGoalData)||""} onChange={e=>updB(bk,"ferbGoalData",e.target.value)}
            placeholder="or write your own…"
            style={{...inputStyle,width:"100%",boxSizing:"border-box",marginTop:6}}/>
        </div>
      )}

      {/* PRECISION TEACHING fields */}
      {isPT && (
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11.5,color:"#555",fontFamily:"'DM Sans',sans-serif",marginBottom:10,lineHeight:1.5,background:"#EBF3EE",borderRadius:8,padding:"8px 12px"}}>
            📐 <strong>Precision Teaching</strong> — mastery is defined by fluency: correct rate + accuracy + consistency across 1-minute timings.
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:4}}>
            <div>
              <div style={{fontSize:11,color:"#555",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Correct per minute</div>
              <input value={b.ptRate||""} onChange={e=>updB(bk,"ptRate",e.target.value)}
                placeholder="e.g., 10" style={{...inputStyle,width:"100%",boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:11,color:"#555",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Accuracy %</div>
              <input value={b.ptAccuracy||""} onChange={e=>updB(bk,"ptAccuracy",e.target.value)}
                placeholder="e.g., 90" style={{...inputStyle,width:"100%",boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:11,color:"#555",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Consecutive timings</div>
              <input value={b.ptTimings||""} onChange={e=>updB(bk,"ptTimings",e.target.value)}
                placeholder="e.g., 3" style={{...inputStyle,width:"100%",boxSizing:"border-box"}}/>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {hasPreview && (
        <div style={{padding:"11px 14px",background:"#003B0111",borderRadius:8,border:"1px solid #003B0133"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#003B01",fontFamily:"'DM Sans',sans-serif",letterSpacing:0.8,marginBottom:4}}>GOAL PREVIEW</div>
          <div style={{fontSize:13,color:"#1C1C1A",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,fontStyle:"italic"}}>
            {isPT ? ptPreview : stdPreview}
          </div>
        </div>
      )}
    </div>
  );
}

function renderTeaching({ d, updB, togB, setSame, sec, hasTwoBehaviors, activeBkeys, Nav }) {
  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const isSame = d.same.teaching && bk==="b2";
    const bColor = bk==="b1" ? B.teal : B.forest;
    const teach = b.teach || [];
    const goalFerb = b.ferbs&&b.ferbs.length>0 ? b.ferbs[0] : "[FERB]";

    return (
      <div key={bk} style={{marginBottom:16}}>
        {hasTwoBehaviors && <>
          <BehHeader bkey={bk} btype={btype} color={bColor}/>
          <SameBanner secKey="teaching" same={d.same.teaching} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
        </>}
        {isSame
          ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
          : <>
            {/* FERB Goal Builder */}
            <FerbGoalBuilder b={b} bk={bk} bColor={bColor} updB={updB} goalFerb={goalFerb} name={d.name}/>

            {/* Teaching Strategies */}
            <div style={{marginBottom:16}}>
              <SL c={bColor}>Teaching Strategy</SL>
              {TEACH_STRATEGIES.map(s=><Chk key={s.id} label={s.l} sub={s.sub} checked={teach.includes(s.id)} onChange={()=>togB(bk,"teach",s.id)}/>)}
            </div>

            {/* Step-by-step plan */}
            {teach.length>0 && (
              <div style={{padding:"14px 16px",background:"#EAF3EE",borderRadius:12,border:`1.5px solid ${B.sage}55`,marginBottom:16}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,color:bColor,fontSize:16,marginBottom:10}}>Step-by-step teaching plan</div>
                <div style={{marginBottom:10}}>
                  <SL c={bColor}>Setting</SL>
                  <div style={{display:"flex",flexWrap:"wrap"}}>
                    {["Individual (1:1)","Small group","Classroom","Natural routine / embedded","Pull-out session"].map(o=>(
                      <Pill key={o} label={o} sel={(b.teachSetting||"")==o} onClick={()=>updB(bk,"teachSetting",(b.teachSetting||"")==o?"":o)} color={bColor}/>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <SL c={bColor}>Materials needed</SL>
                  <TI value={b.teachMaterials||""} onChange={v=>updB(bk,"teachMaterials",v)} placeholder="e.g., Break card (laminated), visual schedule, AAC device..."/>
                </div>
                <div style={{marginBottom:10}}>
                  <SL c={bColor}>How to get started</SL>
                  <TA value={b.teachStart||""} onChange={v=>updB(bk,"teachStart",v)} placeholder="e.g., During morning check-in, show student the break card..." rows={2}/>
                </div>
                <div style={{marginBottom:10}}>
                  <SL c={bColor}>What the FERB looks like</SL>
                  <TA value={b.teachLooksLike||""} onChange={v=>updB(bk,"teachLooksLike",v)} placeholder="e.g., Student picks up break card and holds it up toward the adult..." rows={2}/>
                </div>
                <div>
                  <SL c={bColor}>When to reinforce</SL>
                  {WHEN_TO_REINFORCE.map(o=><Chk key={o} label={o} checked={(b.teachReinforce||[]).includes(o)} onChange={()=>{
                    const cur=b.teachReinforce||[]; updB(bk,"teachReinforce",cur.includes(o)?cur.filter(x=>x!==o):[...cur,o]);
                  }}/>)}
                </div>
              </div>
            )}
          </>
        }
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><BookOpen size={38} strokeWidth={1.5}/></div>
      <H>Teaching strategies and FERB goal</H>
      <P>Start with the goal, then identify how and where the FERB will be explicitly taught.</P>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>(d[bk].teach||[]).length>=1&&!!(d[bk].ferbGoalDate&&d[bk].ferbGoalData))}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Reinforce
// ────────────────────────────────────────────────────────────

function ReinfBlock({ b, bk, btype, bColor, d, updB, togB, setSame, hasTwoBehaviors }) {
  const [ageGroup, setAgeGroup] = useState("elementary");
  const isSame = d.same.reinforce && bk==="b2";
  const bFns = b.fns || [];
  const matchedReinf = [...new Set(bFns.flatMap(fid => REINF_BY_FUNCTION[fid]||[]))];
  const selReinf = b.reinf || [];
  const selRItems = b.reinfItems || [];

  const togItem = (item) => {
    const cur = b.reinfItems || [];
    updB(bk, "reinfItems", cur.includes(item) ? cur.filter(x=>x!==item) : [...cur, item]);
  };

  return (
    <div style={{marginBottom:16}}>
      {hasTwoBehaviors && <>
        <BehHeader bkey={bk} btype={btype} color={bColor}/>
        <SameBanner secKey="reinforce" same={d.same.reinforce} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
      </>}
      {isSame
        ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
        : <ReinfBlockInner b={b} bk={bk} bColor={bColor} updB={updB} togB={togB}
            matchedReinf={matchedReinf} selReinf={selReinf} selRItems={selRItems}
            togItem={togItem} ageGroup={ageGroup} setAgeGroup={setAgeGroup}/>
      }
    </div>
  );
}

function ReinfBlockInner({ b, bk, bColor, updB, togB, matchedReinf, selReinf, selRItems, togItem, ageGroup, setAgeGroup }) {
  const bFns = b.fns || [];
  return (<>
            {/* Function-matched delivery strategies */}
            {matchedReinf.length>0 && <>
              <SL c={bColor}>Delivery strategy — matched to function</SL>
              <Box type="info">Matched to: <strong>{bFns.map(fid=>FUNCTIONS.find(f=>f.id===fid)?.label).join(", ")}</strong></Box>
              {matchedReinf.map(r=><Chk key={r} label={r} checked={selReinf.includes(r)} onChange={()=>togB(bk,"reinf",r)}/>)}
            </>}

            {/* Common reinforcers by age */}
            <div style={{marginTop:matchedReinf.length>0?20:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div style={{fontSize:10,fontWeight:700,color:B.sage,letterSpacing:1.2,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>Common reinforcers</div>
                <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:`1.5px solid ${bColor}44`,fontSize:11.5,fontFamily:"'DM Sans',sans-serif"}}>
                  {[["elementary","Elementary"],["secondary","Secondary"]].map(([k,l])=>(
                    <button key={k} onClick={()=>setAgeGroup(k)}
                      style={{padding:"4px 10px",border:"none",cursor:"pointer",fontWeight:ageGroup===k?700:400,
                        background:ageGroup===k?bColor:"transparent",color:ageGroup===k?"#fff":"#555",
                        transition:"all 0.15s",fontFamily:"'DM Sans',sans-serif",fontSize:11.5}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {Object.entries(REINFORCERS).map(([catKey, cat]) => (
                <div key={catKey} style={{marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:cat.color,fontFamily:"'DM Sans',sans-serif",
                    textTransform:"uppercase",letterSpacing:0.8,marginBottom:5}}>
                    {cat.label}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {cat[ageGroup].map(item => {
                      const sel = selRItems.includes(item);
                      return (
                        <button key={item} onClick={()=>togItem(item)}
                          style={{padding:"4px 10px",borderRadius:8,fontSize:12,fontFamily:"'DM Sans',sans-serif",
                            fontWeight:sel?600:400,border:`1.5px solid ${sel?cat.color:B.border}`,
                            background:sel?cat.color+"18":B.white,color:sel?cat.color:B.bark,
                            cursor:"pointer",transition:"all 0.12s"}}>
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {selRItems.length>0 && (
                <div style={{padding:"9px 12px",background:"#EBF3EE",borderRadius:8,border:`1px solid ${B.sage}55`,marginBottom:4}}>
                  <div style={{fontSize:10,fontWeight:700,color:B.teal,letterSpacing:0.8,fontFamily:"'DM Sans',sans-serif",marginBottom:3}}>SELECTED REINFORCERS</div>
                  <div style={{fontSize:12.5,color:B.bark,fontFamily:"'DM Sans',sans-serif"}}>{selRItems.join(" · ")}</div>
                </div>
              )}
              <TI value={b.reinfCustom||""} onChange={v=>updB(bk,"reinfCustom",v)} placeholder="Add other reinforcers not listed…"/>
            </div>

            {/* Schedule */}
            <div style={{marginTop:16}}>
              <SL c={bColor}>Delivery schedule</SL>
              {REINF_SCHEDULES.map(s=><Chk key={s.id} label={s.l} sub={s.sub} checked={(b.reinfSchedule||[]).includes(s.id)} onChange={()=>{
                const cur=b.reinfSchedule||[]; updB(bk,"reinfSchedule",cur.includes(s.id)?cur.filter(x=>x!==s.id):[...cur,s.id]);
              }}/>)}
              {(b.reinfSchedule||[]).includes("specific") && (
                <div style={{marginTop:8}}>
                  <TI value={b.reinfScheduleNote||""} onChange={v=>updB(bk,"reinfScheduleNote",v)} placeholder="e.g., FR3 — every 3rd FERB use; thin to VR5 after 2 weeks…"/>
                </div>
              )}
            </div>

            {/* How identified */}
            <div style={{marginTop:16}}>
              <SL c={bColor}>How was the reinforcer identified?</SL>
              <TI value={b.reinfBasis||""} onChange={v=>updB(bk,"reinfBasis",v)} placeholder="e.g., Preference assessment [date], staff observation, student interview…"/>
            </div>
    </>);
}

function renderReinforce({ d, updB, togB, setSame, sec, hasTwoBehaviors, activeBkeys, Nav }) {
  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Star size={38} strokeWidth={1.5}/></div>
      <H>Reinforcement procedures</H>
      <P>Select reinforcers the student actually values, then pair with a clear delivery schedule tied to FERB use.</P>
      <ReinfBlock key="b1" b={d.b1} bk="b1" btype={d.beh1type} bColor={B.teal} d={d} updB={updB} togB={togB} setSame={setSame} hasTwoBehaviors={hasTwoBehaviors}/>
      {hasTwoBehaviors && <ReinfBlock key="b2" b={d.b2} bk="b2" btype={d.beh2type} bColor={B.forest} d={d} updB={updB} togB={togB} setSame={setSame} hasTwoBehaviors={hasTwoBehaviors}/>}
      <Nav ok={activeBkeys.every(bk=>(d[bk].reinf||[]).length>=1||(d[bk].reinfItems||[]).length>=1)}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Training
// ────────────────────────────────────────────────────────────

const TRAIN_METHODS = [
  "Role play — staff practice prompting and responding to FERB",
  "Written BIP summary shared with all team members",
  "1:1 walkthrough with case manager before launch",
  "Team meeting / group training session",
  "Video demonstration of FERB in use",
  "Side-by-side modeling during actual instruction",
  "Written prompt card posted in classroom",
];

const GENERALIZATION_STRATEGIES = [
  "All staff use the same prompt wording and response",
  "Visual cue (card / poster) posted in every setting student accesses",
  "FERB practiced across multiple settings before fading support",
  "Natural routines used as practice opportunities",
  "Peer support or peer modeling included",
  "Parent / caregiver trained to prompt and reinforce at home",
  "Self-monitoring tool introduced to build independence",
  "Gradual fade of adult prompting across settings",
];

const MAINTENANCE_STRATEGIES = [
  "Thin reinforcement schedule from continuous to intermittent",
  "Move toward natural reinforcers (peer praise, task completion)",
  "Monthly data review to monitor for skill decay",
  "Re-teach if data shows 2+ consecutive weeks of decline",
  "Student self-monitors FERB use with check-in / check-out",
  "Booster sessions scheduled at IEP review or as needed",
  "Reinforcement fading plan documented and shared with team",
];

// Reusable definition box
const DefBox = ({title, def, color}) => (
  <div style={{padding:"10px 14px",background:color+"11",borderRadius:9,border:`1px solid ${color}33`,marginBottom:14}}>
    <div style={{fontSize:10,fontWeight:700,color,letterSpacing:1.1,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:3}}>{title}</div>
    <div style={{fontSize:12.5,color:"#1C1C1A",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>{def}</div>
  </div>
);

function renderTraining({ d, updB, togB, setSame, sec, hasTwoBehaviors, activeBkeys, Nav }) {
  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const isSame = d.same.teaching && bk==="b2";
    const bColor = bk==="b1" ? B.teal : B.forest;

    const togList = (field, val) => {
      const cur = b[field]||[];
      updB(bk, field, cur.includes(val) ? cur.filter(x=>x!==val) : [...cur, val]);
    };

    return (
      <div key={bk} style={{marginBottom:20}}>
        {hasTwoBehaviors && <>
          <BehHeader bkey={bk} btype={btype} color={bColor}/>
          <SameBanner secKey="teaching" same={d.same.teaching} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
        </>}
        {isSame
          ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
          : <>

            {/* 1. ESTABLISH */}
            <div style={{padding:"14px 16px",background:"#F7FAF8",borderRadius:12,border:`1.5px solid ${B.sage}`,marginBottom:16}}>
              <DefBox title="Establish" color={bColor}
                def="Teach the replacement behavior in structured, controlled conditions until the student demonstrates it reliably. This is explicit instruction — typically 1:1 — before moving to natural settings."/>
              <SL c={bColor}>Who will establish the FERB?</SL>
              <div style={{display:"flex",flexWrap:"wrap"}}>
                {SERVICE_PROVIDERS.map(sp=>(
                  <Pill key={sp} label={sp} sel={(b.establishWho||[]).includes(sp)}
                    onClick={()=>togList("establishWho",sp)} color={bColor}/>
                ))}
              </div>
              <div style={{marginTop:8}}>
                <TI value={b.establishOther||""} onChange={v=>updB(bk,"establishOther",v)} placeholder="Other role at your organization…"/>
              </div>
            </div>

            {/* 2. GENERALIZATION */}
            <div style={{padding:"14px 16px",background:"#F7FAF8",borderRadius:12,border:`1.5px solid ${B.sage}`,marginBottom:16}}>
              <DefBox title="Generalization" color="#6B5B9E"
                def="The student uses the FERB across different settings, people, and times of day — not just with the person who taught it. Every adult must know how to prompt and respond consistently."/>
              <SL c={bColor}>How will generalization be supported?</SL>
              {GENERALIZATION_STRATEGIES.map(s=>(
                <Chk key={s} label={s} checked={(b.genStrategies||[]).includes(s)} onChange={()=>togList("genStrategies",s)}/>
              ))}
              <div style={{marginTop:8}}>
                <TI value={b.genNote||""} onChange={v=>updB(bk,"genNote",v)} placeholder="Additional generalization plan details…"/>
              </div>
            </div>

            {/* 3. MAINTENANCE */}
            <div style={{padding:"14px 16px",background:"#F7FAF8",borderRadius:12,border:`1.5px solid ${B.sage}`,marginBottom:16}}>
              <DefBox title="Maintenance" color="#5C3317"
                def="The student continues using the FERB over time after formal instruction ends. Requires systematically thinning reinforcement and monitoring for skill decay — the behavior must be sustained without intensive support."/>
              <SL c={bColor}>What happens to reinforcement during maintenance?</SL>
              {MAINTENANCE_STRATEGIES.map(s=>(
                <Chk key={s} label={s} checked={(b.maintStrategies||[]).includes(s)} onChange={()=>togList("maintStrategies",s)}/>
              ))}
              <div style={{marginTop:8}}>
                <TI value={b.maintNote||""} onChange={v=>updB(bk,"maintNote",v)} placeholder="Additional maintenance plan details…"/>
              </div>
            </div>

            {/* 4. WHO WILL TRAIN */}
            <div style={{padding:"14px 16px",background:"#FFF8F2",borderRadius:12,border:"1.5px solid #F5C4A155",marginBottom:16}}>
              <Box type="peach">⚖️ <strong>Required by law —</strong> all staff working with this student must receive training on this BIP before implementation (IDEA, 20 U.S.C. § 1414).</Box>
              <SL c={bColor}>Who will be trained on this BIP?</SL>
              <div style={{display:"flex",flexWrap:"wrap"}}>
                {SERVICE_PROVIDERS.map(sp=>(
                  <Pill key={sp} label={sp} sel={(b.trainWho||[]).includes(sp)}
                    onClick={()=>togList("trainWho",sp)} color={bColor}/>
                ))}
              </div>
              <div style={{marginTop:8,marginBottom:14}}>
                <TI value={b.trainOther||""} onChange={v=>updB(bk,"trainOther",v)} placeholder="Other staff role at your organization…"/>
              </div>
              <SL c={bColor}>Training methods</SL>
              {TRAIN_METHODS.map(m=>(
                <Chk key={m} label={m} checked={(b.trainMethods||[]).includes(m)} onChange={()=>togList("trainMethods",m)}/>
              ))}
              <div style={{marginTop:10}}>
                <SL c={bColor}>When will training happen?</SL>
                <TI value={b.trainWhen||""} onChange={v=>updB(bk,"trainWhen",v)} placeholder="e.g., Before BIP launches; refresher at each IEP meeting…"/>
              </div>
            </div>

          </>
        }
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Users size={38} strokeWidth={1.5}/></div>
      <H>Establish, generalize, maintain, and train</H>
      <P>A BIP only works when the whole team understands their role at each phase of implementation.</P>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>d.same.teaching&&bk==="b2" ? true :
        (d[bk].establishWho||[]).length>=1 && (d[bk].trainWho||[]).length>=1 && (d[bk].trainMethods||[]).length>=1)}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/FerbCheck
// ────────────────────────────────────────────────────────────

function renderFerbCheck({ d, sec, hasTwoBehaviors, activeBkeys, Nav }) {
  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const bColor = bk==="b1" ? B.teal : B.forest;
    const bFns = b.fns||[];
    const bFerbs = b.ferbs||[];
    const bTeach = b.teach||[];
    const bReinf = b.reinf||[];
    const bSchedule = b.reinfSchedule||[];
    const fnLabels = bFns.map(fid=>FUNCTIONS.find(f=>f.id===fid)?.label).filter(Boolean);
    const matchedReinf = [...new Set(bFns.flatMap(fid=>REINF_BY_FUNCTION[fid]||[]))];
    const selectedReinf = bReinf.filter(r=>matchedReinf.includes(r));
    const reinfMatch = bFns.length>0 && selectedReinf.length>0;
    const ferbMatch = bFerbs.length>0 && bFns.length>0;
    const goalFerb = bFerbs.length>0 ? bFerbs[0] : "[not selected]";
    const goalPreview = `By ${b.ferbGoalDate||"[date]"}${b.ferbGoalAnt?`, when ${b.ferbGoalAnt},`:""} ${d.name||"the student"} will ${goalFerb} ${b.ferbGoalData||"[data method]"}.`;

    const SummRow = ({label, val, ok}) => (
      <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:`1px solid ${B.border}`}}>
        <div style={{fontSize:14,flexShrink:0,marginTop:1}}>{ok ? "✅" : "⚠️"}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:700,color:B.muted,fontFamily:"'DM Sans',sans-serif",letterSpacing:0.5,textTransform:"uppercase",marginBottom:2}}>{label}</div>
          <div style={{fontSize:13,color:B.bark,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{val||<span style={{color:B.muted,fontStyle:"italic"}}>Not completed</span>}</div>
        </div>
      </div>
    );

    return (
      <div key={bk} style={{marginBottom:16}}>
        {hasTwoBehaviors && <BehHeader bkey={bk} btype={btype} color={bColor}/>}
        <div style={{padding:"16px",background:B.cream,borderRadius:12,border:`1.5px solid ${B.border}`}}>
          <SummRow label="Function of behavior" val={fnLabels.join(", ")} ok={fnLabels.length>0}/>
          <SummRow label="Replacement behavior (FERB)" val={bFerbs.join(", ")} ok={bFerbs.length>0}/>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:`1px solid ${B.border}`}}>
            <div style={{fontSize:14,flexShrink:0,marginTop:1}}>{ferbMatch ? "✅" : "⚠️"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:700,color:B.muted,fontFamily:"'DM Sans',sans-serif",letterSpacing:0.5,textTransform:"uppercase",marginBottom:2}}>Function ↔ FERB match</div>
              <div style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:ferbMatch?B.teal:B.orange,fontWeight:600}}>
                {ferbMatch ? `✓ FERB addresses the identified function (${fnLabels.join(", ")})` : "⚠ No function selected or no FERB selected — return to Sections 8–9"}
              </div>
            </div>
          </div>
          <SummRow label="Teaching strategies" val={bTeach.map(id=>TEACH_STRATEGIES.find(s=>s.id===id)?.l).filter(Boolean).join(", ")} ok={bTeach.length>0}/>
          <SummRow label="FERB goal" val={(b.ferbGoalDate&&b.ferbGoalData) ? goalPreview : null} ok={!!(b.ferbGoalDate&&b.ferbGoalData)}/>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:`1px solid ${B.border}`}}>
            <div style={{fontSize:14,flexShrink:0,marginTop:1}}>{reinfMatch ? "✅" : "⚠️"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:700,color:B.muted,fontFamily:"'DM Sans',sans-serif",letterSpacing:0.5,textTransform:"uppercase",marginBottom:2}}>Reinforcement ↔ function match</div>
              <div style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:reinfMatch?B.teal:B.orange,fontWeight:reinfMatch?600:400}}>
                {reinfMatch
                  ? `✓ Reinforcement is function-matched (${selectedReinf.length} of ${matchedReinf.length} recommended options selected)`
                  : bReinf.length>0
                    ? "⚠ Selected reinforcers may not match the identified function — review Section 11"
                    : "⚠ No reinforcement selected — complete Section 11"}
              </div>
              {bReinf.length>0&&<div style={{fontSize:12,color:B.muted,fontFamily:"'DM Sans',sans-serif",marginTop:3}}>{bReinf.join(", ")}</div>}
            </div>
          </div>
          <SummRow label="Reinforcement schedule" val={bSchedule.map(id=>REINF_SCHEDULES.find(s=>s.id===id)?.l).filter(Boolean).join(", ")} ok={bSchedule.length>0}/>
        </div>
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><CheckCircle size={38} strokeWidth={1.5}/></div>
      <H>Plan summary — function to reinforcement</H>
      <P>Review the chain from function → FERB → teaching → reinforcement before moving to reactive strategies.</P>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>(d[bk].fns||[]).length>0&&(d[bk].ferbs||[]).length>0&&(d[bk].teach||[]).length>0&&(d[bk].reinf||[]).length>0)}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Reactive
// ────────────────────────────────────────────────────────────

const PHASE1_ENV = [
  "Remove dangerous or throwable items from the area",
  "Put away preferred items that could escalate behavior",
  "Reposition furniture to create a safer space",
  "Move peers to a safer location or evacuate the room",
  "Create a clear exit path for the student",
  "Reduce noise or stimulation in the area",
  "Notify team / call for support so backup is aware and available",
];

const PHASE2_FERB_PROMPTS = [
  "State the FERB clearly by name",
  "Point to the visual FERB cue without speaking",
  "Offer a simple choice (A or B) in a calm neutral tone",
  "Use minimal language — one prompt only, then wait",
  "Give 10 seconds of wait time before re-prompting",
  "Use a calm, flat affect — slow speech, relaxed body",
];

const PHASE3_HELP = [
  "Offer ways for the student to communicate needs (gesture, AAC, card)",
  "Acknowledge all communication attempts — praise any signal",
  "Offer a choice without expectation: 'Do you want water or a walk?'",
];
const PHASE3_PROMPT = [
  "Politely suggest a calming strategy: 'You could squeeze this, if you want'",
  "Use behavior momentum — give 1-2 easy, low-demand requests the student is likely to comply with",
  "Redirect attention to a neutral, preferred, or calming object nearby",
  "Narrate calmly and briefly what you see: 'I can see you need a minute'",
];
const PHASE3_WAIT = [
  "Withhold all attention and reinforcers — do not engage verbally",
  "Keep distance — do not crowd the student's space",
  "Avoid direct eye contact — monitor peripherally for safety",
  "Keep a calm, low-affect posture — slow movement, relaxed stance",
  "Do not lecture, reason, or negotiate during this phase",
  "Call for support — backup is needed now",
];

const PHASE4_REENTRY = [
  "Sort objects (pompoms, blocks, tiles by color or size)",
  "Simple matching board or picture cards",
  "Cardboard puzzle (3–6 pieces)",
  "Simple 1-step gross motor directions (stand up, sit down, touch head)",
  "Simple social questions ('What's your favorite color?')",
  "Brief academic task at very high success rate",
  "Complete 2–3 simple, familiar compliance tasks in a row",
];

const PHASE5_RECOVERY_SIGNALS = [
  "Student's body is visibly calm and regulated",
  "Student initiates conversation or eye contact",
  "Student accepts redirection without protest",
  "Student completes a simple 1-step request",
  "Student's breathing has slowed and face is relaxed",
  "Student requests to return to the environment",
];

const RxTA = ({val, onChange, placeholder, rows=2}) => (
  <textarea value={val||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,
      fontFamily:"'DM Sans',sans-serif",color:B.forest,background:"#fff",resize:"vertical",boxSizing:"border-box"}}/>
);

const PhaseBox = ({color, icon, title, subtitle, children}) => (
  <div style={{marginBottom:14,borderRadius:12,border:`1.5px solid ${color}33`,overflow:"hidden"}}>
    <div style={{background:color,padding:"10px 16px",display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:18}}>{icon}</span>
      <div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,color:"#fff"}}>{title}</div>
        {subtitle && <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:1}}>{subtitle}</div>}
      </div>
    </div>
    <div style={{padding:"14px 16px",background:"#FAFBF9"}}>{children}</div>
  </div>
);

function renderReactive({ d, updB, setSame, sec, hasTwoBehaviors, activeBkeys, Nav }) {

  const renderBlock = (bk, btype) => {
    const b = d[bk];
    const isSame = d.same.reactive && bk==="b2";
    const bColor = bk==="b1" ? B.teal : B.forest;
    const rx = b.reactive || {};
    const ferb = (b.ferbs||[])[0] || "[FERB not yet selected]";

    const togRx = (field, val) => {
      const cur = rx[field]||[];
      updB(bk,"reactive",{...rx, [field]: cur.includes(val)?cur.filter(x=>x!==val):[...cur,val]});
    };
    const setRx = (field, val) => updB(bk,"reactive",{...rx, [field]:val});

    return (
      <div key={bk} style={{marginBottom:16}}>
        {hasTwoBehaviors && <>
          <BehHeader bkey={bk} btype={btype} color={bColor}/>
          <SameBanner secKey="reactive" same={d.same.reactive} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
        </>}
        {isSame
          ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
          : <>
            {/* Who responds */}
            <div style={{marginBottom:14,padding:"12px 16px",background:B.cream,borderRadius:11,border:`1px solid ${B.border}`}}>
              <div style={{fontSize:10,fontWeight:700,color:bColor,letterSpacing:1.2,textTransform:"uppercase",marginBottom:7,fontFamily:"'DM Sans',sans-serif"}}>Who will respond to this behavior?</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {SERVICE_PROVIDERS.map(sp => {
                  const sel=(rx.reactiveWho||[]).includes(sp);
                  return (
                    <button key={sp} onClick={()=>togRx("reactiveWho",sp)}
                      style={{padding:"5px 11px",borderRadius:20,border:`1.5px solid ${sel?bColor:B.border}`,
                        background:sel?bColor:"#fff",color:sel?"#fff":B.muted,fontSize:11.5,
                        fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all .15s"}}>
                      {sp}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PHASE 1 — Safer Environment */}
            <PhaseBox color="#0B4238" icon="🛡️" title="Phase 1 — Make the Environment Safer"
              subtitle="First priority: reduce immediate risk before anything else">
              <div style={{fontSize:11,fontWeight:600,color:"#0B4238",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Select all that apply</div>
              {PHASE1_ENV.map(a=>(
                <Chk key={a} label={a} checked={(rx.p1||[]).includes(a)} onChange={()=>togRx("p1",a)}/>
              ))}
              <div style={{marginTop:8}}>
                <RxTA val={rx.p1Note} onChange={v=>setRx("p1Note",v)} placeholder="Additional site-specific safety steps…"/>
              </div>
            </PhaseBox>

            {/* PHASE 2 — Prompt the FERB */}
            <PhaseBox color="#84B59F" icon="💬" title="Phase 2 — Prompt the FERB"
              subtitle="Give the student the opportunity to use the replacement behavior">
              <div style={{padding:"8px 12px",background:"#EBF3EE",borderRadius:8,border:"1px solid #84B59F55",marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:700,color:B.teal,letterSpacing:.8,fontFamily:"'DM Sans',sans-serif",marginBottom:2}}>FERB FOR THIS BEHAVIOR</div>
                <div style={{fontSize:13,color:B.forest,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>{ferb}</div>
              </div>
              <div style={{fontSize:11,fontWeight:600,color:"#5A8A78",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>How staff will prompt</div>
              {PHASE2_FERB_PROMPTS.map(a=>(
                <Chk key={a} label={a} checked={(rx.p2||[]).includes(a)} onChange={()=>togRx("p2",a)}/>
              ))}
              <div style={{marginTop:8}}>
                <RxTA val={rx.p2Note} onChange={v=>setRx("p2Note",v)} placeholder="Additional prompting notes…" rows={1}/>
              </div>
            </PhaseBox>

            {/* PHASE 3 — Not redirectable */}
            <PhaseBox color="#C0392B" icon="🌿" title="Phase 3 — If Not Redirectable: De-escalation"
              subtitle="Student cannot use the FERB — shift to safety and co-regulation">
              {/* Help */}
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"#C0392B",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>Help — Communicate Needs</div>
                <div style={{fontSize:12,color:B.bark,fontFamily:"'DM Sans',sans-serif",marginBottom:6,fontStyle:"italic"}}>Support the student in expressing what they need. Praise all communication attempts.</div>
                {PHASE3_HELP.map(a=>(
                  <Chk key={a} label={a} checked={(rx.p3help||[]).includes(a)} onChange={()=>togRx("p3help",a)}/>
                ))}
              </div>
              {/* Prompt */}
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:700,color:"#C0392B",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>Prompt — Gently Suggest Calming</div>
                <div style={{fontSize:12,color:B.bark,fontFamily:"'DM Sans',sans-serif",marginBottom:6,fontStyle:"italic"}}>Politely suggest calming strategies, use behavior momentum, or redirect attention.</div>
                {PHASE3_PROMPT.map(a=>(
                  <Chk key={a} label={a} checked={(rx.p3prompt||[]).includes(a)} onChange={()=>togRx("p3prompt",a)}/>
                ))}
              </div>
              {/* Wait */}
              <div style={{marginBottom:8}}>
                <div style={{fontSize:11,fontWeight:700,color:"#C0392B",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>Wait — Create Safety While Withholding Attention</div>
                <div style={{fontSize:12,color:B.bark,fontFamily:"'DM Sans',sans-serif",marginBottom:6,fontStyle:"italic"}}>Maintain a safe environment while removing reinforcement. Do not engage until the student begins to regulate.</div>
                {PHASE3_WAIT.map(a=>(
                  <Chk key={a} label={a} checked={(rx.p3wait||[]).includes(a)} onChange={()=>togRx("p3wait",a)}/>
                ))}
              </div>
              {/* Room evac */}
              <div style={{padding:"10px 12px",background:"#FFF3EE",borderRadius:8,border:"1.5px solid #E8834A44",marginBottom:8}}>
                <Chk label="Room evacuation may be needed — staff will remove peers from the classroom"
                  checked={!!(rx.roomEvac)} onChange={()=>setRx("roomEvac",!rx.roomEvac)}/>
                {rx.roomEvac && (
                  <div style={{marginTop:8}}>
                    <RxTA val={rx.roomEvacNote} onChange={v=>setRx("roomEvacNote",v)}
                      placeholder="Signal, who leads peers out, where student stays, who remains with student…"/>
                  </div>
                )}
              </div>
              <RxTA val={rx.p3Note} onChange={v=>setRx("p3Note",v)} placeholder="Additional de-escalation notes…" rows={1}/>
            </PhaseBox>

            {/* PHASE 4 — Re-entry task */}
            <PhaseBox color="#E8834A" icon="🔁" title="Phase 4 — Re-entry Task"
              subtitle="Before returning to the environment, the student demonstrates readiness">
              <div style={{fontSize:12,color:B.bark,fontFamily:"'DM Sans',sans-serif",marginBottom:10,lineHeight:1.6}}>
                A brief, low-demand task shows the student is regulated and ready. Select options to use at your site:
              </div>
              {PHASE4_REENTRY.map(a=>(
                <Chk key={a} label={a} checked={(rx.p4||[]).includes(a)} onChange={()=>togRx("p4",a)}/>
              ))}
              <div style={{marginTop:8}}>
                <RxTA val={rx.p4Note} onChange={v=>setRx("p4Note",v)} placeholder="Describe the re-entry sequence at your site…"/>
              </div>
            </PhaseBox>

            {/* PHASE 5 — Debrief & Recovery */}
            <PhaseBox color="#003B01" icon="📋" title="Phase 5 — Debrief & Recovery"
              subtitle="Do not rush re-entry — recovery time varies significantly by student">
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:600,color:"#003B01",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Signs the student has recovered</div>
                {PHASE5_RECOVERY_SIGNALS.map(a=>(
                  <Chk key={a} label={a} checked={(rx.p5signals||[]).includes(a)} onChange={()=>togRx("p5signals",a)}/>
                ))}
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:600,color:"#003B01",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Typical recovery time for this student</div>
                <RxTA val={rx.p5RecoveryTime} onChange={v=>setRx("p5RecoveryTime",v)}
                  placeholder="e.g., 10–20 minutes; varies by severity; usually needs a full period…" rows={1}/>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,fontWeight:600,color:"#003B01",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Who conducts the debrief and how?</div>
                <RxTA val={rx.p5Debrief} onChange={v=>setRx("p5Debrief",v)}
                  placeholder="e.g., Case manager conducts brief, calm, solution-focused check-in once student is regulated…"/>
              </div>
              <div>
                <Chk label="Document using ABC Data Sheet after each incident"
                  checked={!!(rx.p5Document)} onChange={()=>setRx("p5Document",!rx.p5Document)}/>
                <Chk label="Notify administrator per site protocol if safety was at risk"
                  checked={!!(rx.p5Admin)} onChange={()=>setRx("p5Admin",!rx.p5Admin)}/>
                <Chk label="Contact family per communication plan"
                  checked={!!(rx.p5Family)} onChange={()=>setRx("p5Family",!rx.p5Family)}/>
                <Chk label="Team debrief: was the BIP followed with fidelity? What needs adjusting?"
                  checked={!!(rx.p5TeamDebrief)} onChange={()=>setRx("p5TeamDebrief",!rx.p5TeamDebrief)}/>
              </div>
            </PhaseBox>


          </>
        }
      </div>
    );
  };

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Shield size={38} strokeWidth={1.5}/></div>
      <H>Reactive strategies</H>
      <P>A clear, tiered response plan so every team member knows exactly what to do — and in what order.</P>
      <Box type="danger">⚠ <strong>Reminder:</strong> Do not include cathartic strategies (e.g., "punch a pillow") — research shows these increase aggression.</Box>
      {renderBlock("b1", d.beh1type)}
      {hasTwoBehaviors && renderBlock("b2", d.beh2type)}
      <Nav ok={activeBkeys.every(bk=>(d[bk].reactive&&(d[bk].reactive.reactiveWho||[]).length>=1))}/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Goals (13 — Reduction Goals)
// ────────────────────────────────────────────────────────────

const REDUCTION_DATA_METHODS = [
  "direct observation frequency count",
  "event recording across the school day",
  "interval recording (partial)",
  "ABC data sheet incident count",
  "daily behavior log",
];

const GoalBlock = ({ d, updB, setSame, hasTwoBehaviors, bk, btype }) => {
    const b = d[bk];
    const isSame = d.same.goals && bk==="b2";
    const bColor = bk==="b1" ? B.teal : B.forest;

    // Pull baseline from Section 4
    const baselineFreq = b.freqMax ? `${b.freqMin ? b.freqMin+"–" : ""}${b.freqMax} times per ${b.freqUnit||"day"}` : null;
    const behaviorLabel = btype || (bk==="b1" ? d.beh1type : d.beh2type) || "this behavior";

    // Live goal preview
    const name = d.name || "the student";
    const goalDate = b.redGoalDate || "[date]";
    const targetVal = b.redGoalTarget || "[target]";
    const targetUnit = b.redGoalUnit || (b.freqUnit ? `times per ${b.freqUnit}` : "instances per day");
    const dataMethod = b.redGoalData || "[data method]";
    const consecutive = b.redGoalConsec || "[#]";
    const preview = `By ${goalDate}, ${name} will reduce ${behaviorLabel} from a baseline of ${baselineFreq||"[baseline]"} to ${targetVal} ${targetUnit} as measured by ${dataMethod} across ${consecutive} consecutive ${b.freqUnit==="week"?"weeks":"school days"}.`;

    return (
      <div style={{marginBottom:20}}>
        {hasTwoBehaviors && <>
          <BehHeader bkey={bk} btype={btype} color={bColor}/>
          <SameBanner secKey="goals" same={d.same.goals} setSame={setSame} beh2type={bk==="b2"?btype:null}/>
        </>}
        {isSame
          ? <div style={{padding:"12px 14px",background:"#E6F2EE",borderRadius:9,fontSize:12.5,color:B.teal,fontFamily:"'DM Sans',sans-serif"}}>✓ Same as Behavior 1</div>
          : <>
            {/* Baseline reminder */}
            {baselineFreq
              ? <div style={{padding:"9px 13px",background:"#EBF3EE",borderRadius:8,border:`1px solid ${B.sage}55`,marginBottom:14,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",color:B.teal}}>
                  📊 <strong>Baseline from Section 4:</strong> {baselineFreq}
                </div>
              : <Box type="info">No baseline recorded in Section 4 — return there to add frequency data before writing this goal.</Box>
            }

            {/* Goal fields */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div>
                <SL c={bColor}>Target date</SL>
                <input value={b.redGoalDate||""} onChange={e=>updB(bk,"redGoalDate",e.target.value)}
                  placeholder="e.g., June 2026"
                  style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
              </div>
              <div>
                <SL c={bColor}>Target frequency</SL>
                <div style={{display:"flex",gap:6}}>
                  <input value={b.redGoalTarget||""} onChange={e=>updB(bk,"redGoalTarget",e.target.value)}
                    placeholder="e.g., 1"
                    style={{width:"60px",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif"}}/>
                  <input value={b.redGoalUnit||""} onChange={e=>updB(bk,"redGoalUnit",e.target.value)}
                    placeholder={`times per ${b.freqUnit||"day"}`}
                    style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif"}}/>
                </div>
              </div>
            </div>

            <div style={{marginBottom:10}}>
              <SL c={bColor}>Consecutive days / weeks</SL>
              <input value={b.redGoalConsec||""} onChange={e=>updB(bk,"redGoalConsec",e.target.value)}
                placeholder="e.g., 3"
                style={{width:"80px",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif"}}/>
            </div>

            <div style={{marginBottom:14}}>
              <SL c={bColor}>Data collection method</SL>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
                {REDUCTION_DATA_METHODS.map(m=>(
                  <Pill key={m} label={m} sel={b.redGoalData===m} onClick={()=>updB(bk,"redGoalData",b.redGoalData===m?"":m)} color={bColor}/>
                ))}
              </div>
              <input value={(REDUCTION_DATA_METHODS.includes(b.redGoalData||"")?"":(b.redGoalData||""))}
                onChange={e=>updB(bk,"redGoalData",e.target.value)}
                placeholder="Or type a custom data method…"
                style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
            </div>

            {/* Live preview */}
            <div style={{padding:"11px 14px",background:`${bColor}0D`,borderRadius:10,border:`1.5px solid ${bColor}33`}}>
              <div style={{fontSize:10,fontWeight:700,color:bColor,letterSpacing:1.1,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:5}}>Goal preview</div>
              <div style={{fontSize:13,color:B.forest,fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,fontStyle:"italic"}}>{preview}</div>
            </div>
          </>
        }
      </div>
    );
};

function renderGoals({ d, updB, setSame, sec, hasTwoBehaviors, activeBkeys, Nav }) {
  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Target size={38} strokeWidth={1.5}/></div>
      <H>Behavior reduction goal{hasTwoBehaviors?"s":""}</H>
      <P>A measurable reduction goal gives the team a clear benchmark and keeps the plan legally defensible.</P>
      <GoalBlock d={d} updB={updB} setSame={setSame} hasTwoBehaviors={hasTwoBehaviors} bk="b1" btype={d.beh1type}/>
      {hasTwoBehaviors && <GoalBlock d={d} updB={updB} setSame={setSame} hasTwoBehaviors={hasTwoBehaviors} bk="b2" btype={d.beh2type}/>}
      <Nav ok={activeBkeys.every(bk=>d.same.goals&&bk==="b2" ? true : !!(d[bk].redGoalDate&&d[bk].redGoalTarget&&d[bk].redGoalData))}/>
    </div>
  );
}


// ── screens/Comms (14 — Home–School Communication)
// ────────────────────────────────────────────────────────────

const COMMS_METHODS = [
  "Daily home–school communication log / behavior sheet",
  "Weekly email update from case manager",
  "Phone call following any significant incident",
  "Monthly progress report shared with family",
  "Parent portal / app (e.g., Remind, ClassDojo, Seesaw)",
  "IEP team meeting — scheduled review of BIP progress",
  "In-person meeting as needed",
];

const COMMS_INCIDENT = [
  "Same-day phone call or voicemail",
  "Written incident report shared within 24 hours",
  "Email notification to parent/guardian",
  "Administrator notified and contacts family directly",
  "IEP team convened if incident is severe or recurring",
];

function renderComms({ d, upd, sec, Nav }) {
  const setC = (field, val) => upd("comms", { ...(d.comms||{}), [field]: val });
  const togC = (field, val) => {
    const cur = (d.comms||{})[field]||[];
    setC(field, cur.includes(val)?cur.filter(x=>x!==val):[...cur,val]);
  };
  const c = d.comms || {};

  return (
    <div>
      {sec && <Badge>{sec}</Badge>}
      <div style={{marginBottom:14,color:B.forest}}><Users size={38} strokeWidth={1.5}/></div>
      <H>Home–school communication plan</H>
      <P>Consistent, two-way communication with families is required under IDEA and builds the trust that makes BIPs work.</P>

      {/* Who is primary contact */}
      <div style={{marginBottom:16,padding:"14px 16px",background:B.cream,borderRadius:11,border:`1px solid ${B.border}`}}>
        <SL c={B.teal}>Primary contact for this student's BIP</SL>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{fontSize:11,color:B.muted,fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Name / role</div>
            <input value={c.contactName||""} onChange={e=>setC("contactName",e.target.value)}
              placeholder="e.g., Ms. Rivera, Case Manager"
              style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:B.muted,fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Contact method</div>
            <input value={c.contactMethod||""} onChange={e=>setC("contactMethod",e.target.value)}
              placeholder="e.g., school email, phone ext. 204"
              style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
          </div>
        </div>
      </div>

      {/* Routine communication */}
      <div style={{marginBottom:16,padding:"14px 16px",background:"#F7FAF8",borderRadius:12,border:`1.5px solid ${B.sage}`}}>
        <SL c={B.teal}>Routine progress communication</SL>
        <div style={{fontSize:12,color:B.bark,fontFamily:"'DM Sans',sans-serif",marginBottom:8,fontStyle:"italic"}}>How will the team keep the family informed of progress on a regular basis?</div>
        {COMMS_METHODS.map(m=>(
          <Chk key={m} label={m} checked={(c.commsMethod||[]).includes(m)} onChange={()=>togC("commsMethod",m)}/>
        ))}
        <div style={{marginTop:8}}>
          <input value={c.commsFreq||""} onChange={e=>setC("commsFreq",e.target.value)}
            placeholder="Frequency / additional details (e.g., every Friday, first Monday of the month)…"
            style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
        </div>
      </div>

      {/* Incident notification */}
      <div style={{marginBottom:16,padding:"14px 16px",background:"#FFF8F2",borderRadius:12,border:"1.5px solid #F5C4A155"}}>
        <SL c={B.forest}>Incident notification procedure</SL>
        <div style={{fontSize:12,color:B.bark,fontFamily:"'DM Sans',sans-serif",marginBottom:8,fontStyle:"italic"}}>How will the family be notified when a significant incident occurs?</div>
        {COMMS_INCIDENT.map(m=>(
          <Chk key={m} label={m} checked={(c.commsIncident||[]).includes(m)} onChange={()=>togC("commsIncident",m)}/>
        ))}
      </div>

      {/* Family input */}
      <div style={{marginBottom:16,padding:"14px 16px",background:"#F7FAF8",borderRadius:12,border:`1.5px solid ${B.sage}`}}>
        <SL c={B.teal}>How will family input be gathered?</SL>
        <textarea value={c.familyInput||""} onChange={e=>setC("familyInput",e.target.value)}
          placeholder="e.g., Parent completes weekly behavior rating scale, calls case manager to share observations, attends monthly check-in…"
          rows={2}
          style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",color:B.forest,background:"#fff",resize:"vertical",boxSizing:"border-box"}}/>
      </div>

      {/* Language access */}
      <div style={{padding:"14px 16px",background:B.cream,borderRadius:11,border:`1px solid ${B.border}`}}>
        <SL c={B.teal}>Language access</SL>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
          {["English","Spanish","Vietnamese","Mandarin","Cantonese","Tagalog","Korean","Arabic","Other"].map(lang=>{
            const sel=(c.lang||[]). includes(lang);
            return (
              <button key={lang} onClick={()=>togC("lang",lang)}
                style={{padding:"4px 11px",borderRadius:20,border:`1.5px solid ${sel?B.teal:B.border}`,
                  background:sel?B.teal:"#fff",color:sel?"#fff":B.muted,fontSize:11.5,
                  fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all .15s"}}>
                {lang}
              </button>
            );
          })}
        </div>
        <input value={c.langNote||""} onChange={e=>setC("langNote",e.target.value)}
          placeholder="Interpreter needed / translation provided for: …"
          style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1px solid ${B.border}`,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}/>
      </div>

      <Nav ok={!!(c.commsMethod&&c.commsMethod.length>=1&&c.contactName)} next="Generate My BIP →"/>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── screens/Output
// ────────────────────────────────────────────────────────────

// ─── BIP docx generator (client-side via docx-js CDN) ───────────
// Called from output screen Download button
async function downloadBIPDocx(d) {
  // Dynamically import docx from CDN
  // We use the pre-built UMD bundle via unpkg
  if (!window.docx) {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/docx@9.5.3/build/index.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
    SimpleField, PageBreak, Header, Footer,
  } = window.docx;

  const C = { forest:"003B01", teal:"0B4238", sage:"84B59F", orange:"E8834A",
    peach:"F5C4A1", cream:"F9F6F0", white:"FFFFFF", black:"1C1C1A",
    gray:"666666", ltgray:"E8E8E4", ltgreen:"E6F2EE" };

  const bNone = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const bAll  = (color="CCCCCC",size=4) => ({ style: BorderStyle.SINGLE, size, color });
  const bBox  = (color="CCCCCC") => ({ top:bAll(color),bottom:bAll(color),left:bAll(color),right:bAll(color) });
  const bNoneAll = { top:bNone,bottom:bNone,left:bNone,right:bNone };
  const sp = (before=0,after=60) => ({ before, after });
  const run = (text, opts={}) => new TextRun({ text:text||"", font:"Arial", size:opts.size||20,
    bold:opts.bold||false, italics:opts.italics||false, color:opts.color||C.black });
  const para = (children, opts={}) => new Paragraph({ children:Array.isArray(children)?children:[children],
    alignment:opts.align||AlignmentType.LEFT, spacing:sp(opts.before||0, opts.after!==undefined?opts.after:60),
    indent: opts.indent ? { left: opts.indent } : undefined,
    border: opts.border ? { bottom: bAll(C.sage,6) } : undefined });
  const blank = (h=160) => new Paragraph({ children:[run("")], spacing:sp(0,h) });
  const join = (arr,sep=", ") => (arr||[]).length ? arr.join(sep) : "—";

  const sectionHeader = (num, title, color=C.forest) => new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
    rows:[new TableRow({ children:[new TableCell({
      borders:bNoneAll, shading:{fill:color,type:ShadingType.CLEAR},
      margins:{top:120,bottom:120,left:160,right:160},
      children:[new Paragraph({ spacing:sp(0,0), children:[
        run(num?`SECTION ${num}  `:"",{bold:true,size:21,color:C.sage}),
        run(title.toUpperCase(),{bold:true,size:21,color:C.white}),
      ]})]
    })]})],
  });

  const subLabel = (text) => new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
    rows:[new TableRow({ children:[new TableCell({
      borders:bNoneAll, shading:{fill:C.ltgreen,type:ShadingType.CLEAR},
      margins:{top:80,bottom:80,left:160,right:160},
      children:[new Paragraph({ spacing:sp(0,0), children:[run(text,{bold:true,size:19,color:C.teal})] })]
    })]})],
  });

  const contentBox = (text) => new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
    rows:[new TableRow({ children:[new TableCell({
      borders:bBox(C.ltgray), shading:{fill:"FAFBF9",type:ShadingType.CLEAR},
      margins:{top:100,bottom:100,left:180,right:180},
      children:[new Paragraph({ spacing:sp(0,0), children:[run(text||"—")] })]
    })]})],
  });

  const twoCol = (label, value, colW=[3000,6360]) => new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:colW,
    rows:[new TableRow({ children:[
      new TableCell({ borders:bBox(C.ltgray), shading:{fill:C.ltgreen,type:ShadingType.CLEAR},
        margins:{top:80,bottom:80,left:160,right:160},
        children:[new Paragraph({ spacing:sp(0,0), children:[run(label,{bold:true,size:19,color:C.teal})] })] }),
      new TableCell({ borders:bBox(C.ltgray), shading:{fill:"FAFBF9",type:ShadingType.CLEAR},
        margins:{top:80,bottom:80,left:160,right:160},
        children:[new Paragraph({ spacing:sp(0,0), children:[run(value||"—")] })] }),
    ]})],
  });

  const checkItem = (text) => para([
    run("☑  ",{size:20,color:C.teal}), run(text,{size:20})
  ], { before:40, after:40, indent:360 });

  const pageBreak = () => new Paragraph({ children:[new PageBreak()], spacing:sp(0,0) });
  const hdr = (num,title,color) => sectionHeader(num,title,color);

  const name = d.name||"[Student]";
  const hasTwoBeh = !!(d.beh1type && d.beh2type);
  const bkeys = hasTwoBeh ? ["b1","b2"] : ["b1"];
  const btype = bk => bk==="b1" ? d.beh1type : d.beh2type;
  const beh   = bk => bk==="b1" ? d.beh1 : d.beh2;
  const bd    = bk => bk==="b1" ? (d.b1||{}) : (d.b2||{});
  const isSame = (bk, sec) => d.same?.[sec] && bk==="b2";

  const FN_LABELS = { escape:"Escape / Avoidance", attention:"Attention (adult or peer)",
    tangible:"Access to tangible / preferred item", sensory:"Automatic / Sensory", unknown:"Unknown" };

  const ch = [];

  // ── Header banner
  ch.push(new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[6400,2960],
    rows:[new TableRow({ children:[
      new TableCell({ borders:bNoneAll, shading:{fill:C.forest,type:ShadingType.CLEAR},
        margins:{top:160,bottom:160,left:200,right:200}, verticalAlign:VerticalAlign.CENTER,
        children:[
          new Paragraph({ spacing:sp(0,40), children:[run("IEP 6G-1",{bold:true,size:24,color:C.sage})] }),
          new Paragraph({ spacing:sp(0,40), children:[run("Behavior Intervention Plan",{bold:true,size:30,color:C.white})] }),
          new Paragraph({ spacing:sp(0,0), children:[run("Generated by BehaviorPath · BASIL Behavior Lab",{size:17,color:C.peach,italics:true})] }),
        ] }),
      new TableCell({ borders:bNoneAll, shading:{fill:C.teal,type:ShadingType.CLEAR},
        margins:{top:120,bottom:120,left:160,right:160}, verticalAlign:VerticalAlign.CENTER,
        children:[
          new Paragraph({ spacing:sp(0,40), children:[run("Student",{bold:true,size:17,color:C.sage})] }),
          new Paragraph({ spacing:sp(0,60), children:[run(name,{bold:true,size:22,color:C.white})] }),
          new Paragraph({ spacing:sp(0,40), children:[run("Behaviors",{bold:true,size:17,color:C.sage})] }),
          new Paragraph({ spacing:sp(0,0), children:[run(hasTwoBeh?"2 addressed":"1 addressed",{size:20,color:C.white})] }),
        ] }),
    ]})],
  }));
  ch.push(blank(160));
  ch.push(twoCol("Behavior 1", `${d.beh1type||"—"}${d.beh1?" — "+d.beh1:""}`));
  if (hasTwoBeh) { ch.push(blank(40)); ch.push(twoCol("Behavior 2", `${d.beh2type||"—"}${d.beh2?" — "+d.beh2:""}`)); }
  ch.push(blank(160));

  // ── Sections 1–2
  const renderBkBlock = (secKey, secNum, secTitle, secColor, renderFn) => {
    ch.push(hdr(secNum, secTitle, secColor||C.forest));
    ch.push(blank(80));
    bkeys.forEach(bk => {
      const b = bd(bk);
      if (hasTwoBeh) { ch.push(subLabel(`Behavior ${bk==="b1"?"1":"2"}: ${btype(bk)||""}`)); ch.push(blank(40)); }
      if (isSame(bk,secKey)) { ch.push(para([run("Same as Behavior 1",{italics:true,color:C.gray})])); }
      else { renderFn(b, bk); }
      ch.push(blank(80));
    });
  };

  renderBkBlock("behavior","1","The behavior impeding learning is…",null, (b,bk) => {
    ch.push(para([run("Behavior: ",{bold:true,color:C.teal}), run(btype(bk)||"—")]));
    ch.push(para([run("Definition: ",{bold:true,color:C.teal}), run(beh(bk)||"—")]));
  });

  renderBkBlock("impedes","2","It impedes learning because…",null, (b) => {
    (b.impedes||[]).forEach(i => ch.push(checkItem(i)));
    if (!(b.impedes||[]).length) ch.push(para([run("—")]));
  });

  ch.push(hdr("3","Environmental Analysis",C.teal));
  ch.push(blank(80));
  ch.push(contentBox("Refer to Environmental Analysis Data Sheet (completed separately). Results inform Sections 6 & 7."));
  ch.push(blank(120));

  renderBkBlock("baseline","4","Frequency, intensity, or duration of behavior",null, (b) => {
    const freqStr = b.freqMax ? `${b.freqMin?b.freqMin+"–":""}${b.freqMax} times per ${b.freqUnit||"day"}${b.freqCtx?" ("+b.freqCtx+")":""}` : "Not recorded";
    ch.push(twoCol("Frequency (baseline)", freqStr));
    ch.push(blank(40));
    ch.push(twoCol("Intensity", b.intensity||"—"));
    ch.push(blank(40));
    const durStr = b.durMax ? `${b.durMin?b.durMin+"–":""}${b.durMax} ${b.durUnit||"seconds"}` : "—";
    ch.push(twoCol("Duration", durStr));
  });

  ch.push(pageBreak());

  renderBkBlock("ants","5","What are the predictors for the behavior?",null, (b) => {
    (b.ants||[]).forEach(a => ch.push(checkItem(a)));
    if (!(b.ants||[]).length) ch.push(para([run("—")]));
    if (b.antNote) ch.push(para([run("Notes: ",{bold:true,color:C.teal}), run(b.antNote)]));
  });

  renderBkBlock("environment","6","Environmental factors & modifications",null, (b) => {
    (b.envSel||[]).forEach(e => {
      const note = b.envS7?.[e];
      ch.push(checkItem(`${e}${note?" — "+note:""}`));
    });
    if (!(b.envSel||[]).length) ch.push(para([run("—")]));
    if (b.envWho) ch.push(para([run("Responsible: ",{bold:true,color:C.teal}), run(b.envWho)]));
  });

  ch.push(hdr("7","Environmental modifications currently in place",C.teal));
  ch.push(blank(80));
  ch.push(contentBox("See Section 6 above — modifications and responsible parties listed per behavior."));
  ch.push(blank(120));

  ch.push(pageBreak());

  renderBkBlock("function","8","Function of behavior",null, (b) => {
    const fns = (b.fns||[]).map(f => FN_LABELS[f]||f);
    fns.forEach(f => ch.push(checkItem(f)));
    if (!fns.length) ch.push(para([run("—")]));
    (b.fnFrames||[]).forEach(fr => ch.push(para([run("Evidence: ",{bold:true,color:C.teal}), run(fr,{italics:true})])));
  });

  renderBkBlock("ferb","9","What should the student do INSTEAD? (FERB)",null, (b) => {
    (b.ferbs||[]).forEach(f => ch.push(checkItem(f)));
    if (!(b.ferbs||[]).length) ch.push(para([run("—")]));
    if (b.ferbQ1) ch.push(para([run("Why this FERB: ",{bold:true,color:C.teal}), run(b.ferbQ1)]));
    if (b.ferbQ2) ch.push(para([run("Meets the function: ",{bold:true,color:C.teal}), run(b.ferbQ2)]));
  });

  ch.push(pageBreak());

  // Section 10 — Teaching
  ch.push(hdr("10","Teaching strategies and materials"));
  ch.push(blank(80));
  bkeys.forEach(bk => {
    const b = bd(bk);
    if (hasTwoBeh) { ch.push(subLabel(`Behavior ${bk==="b1"?"1":"2"}`)); ch.push(blank(40)); }
    if (isSame(bk,"teaching")) { ch.push(para([run("Same as Behavior 1",{italics:true,color:C.gray})])); }
    else {
      (b.teach||[]).forEach(t => ch.push(checkItem(t)));
      if (!(b.teach||[]).length) ch.push(para([run("—")]));
      if (b.teachSetting) ch.push(para([run("Setting: ",{bold:true,color:C.teal}), run(b.teachSetting)]));
      if (b.teachMaterials) ch.push(para([run("Materials: ",{bold:true,color:C.teal}), run(b.teachMaterials)]));
      if (b.teachStart) ch.push(para([run("When to begin: ",{bold:true,color:C.teal}), run(b.teachStart)]));
      if (b.teachLooksLike) ch.push(para([run("Mastery looks like: ",{bold:true,color:C.teal}), run(b.teachLooksLike)]));
      ch.push(blank(60)); ch.push(subLabel("FERB Goal")); ch.push(blank(40));
      const ferb0 = (b.ferbs||[])[0]||"[FERB]";
      const ant = b.ferbGoalAnt ? ", when "+b.ferbGoalAnt+"," : "";
      let goalText;
      if (b.goalType==="pt") {
        goalText = `By ${b.ferbGoalDate||"[date]"}${ant} ${name} will ${ferb0} at ${b.ptRate||"[#]"} correct responses per minute with ${b.ptAccuracy||"[%]"}% accuracy across ${b.ptTimings||"[#]"} consecutive 1-minute timing periods.`;
      } else {
        goalText = `By ${b.ferbGoalDate||"[date]"}${ant} ${name} will ${ferb0} ${b.ferbGoalData||"[data method]"}.`;
      }
      ch.push(contentBox(goalText));
    }
    ch.push(blank(80));
  });

  ch.push(pageBreak());

  // Section 11
  ch.push(hdr("11","Reinforcement, establishment, generalization, maintenance & training"));
  ch.push(blank(80));
  bkeys.forEach(bk => {
    const b = bd(bk);
    if (hasTwoBeh) { ch.push(subLabel(`Behavior ${bk==="b1"?"1":"2"}`)); ch.push(blank(40)); }

    // Reinforcement
    ch.push(para([run("Reinforcement",{bold:true,size:21,color:C.forest})],{before:0,after:60,border:true}));
    if (isSame(bk,"reinforce")) { ch.push(para([run("Same as Behavior 1",{italics:true,color:C.gray})])); }
    else {
      const reinf = [...(b.reinf||[]),...(b.reinfItems||[])];
      reinf.forEach(r => ch.push(checkItem(r)));
      if (!reinf.length) ch.push(para([run("—")]));
      if ((b.reinfCustom||"").trim()) ch.push(para([run("Additional: ",{bold:true,color:C.teal}), run(b.reinfCustom)]));
      if ((b.reinfSchedule||[]).length) ch.push(para([run("Schedule: ",{bold:true,color:C.teal}), run(join(b.reinfSchedule))]));
      if (b.reinfBasis) ch.push(para([run("Identified via: ",{bold:true,color:C.teal}), run(b.reinfBasis)]));
    }
    ch.push(blank(60));

    if (!isSame(bk,"teaching")) {
      ch.push(para([run("Who will establish the FERB?",{bold:true,size:21,color:C.forest})],{before:0,after:60,border:true}));
      ch.push(para([run("Responsible: ",{bold:true,color:C.teal}), run(join([...(b.establishWho||[]),b.establishOther].filter(Boolean)))]));
      ch.push(blank(60));
      ch.push(para([run("Generalization plan",{bold:true,size:21,color:C.forest})],{before:0,after:60,border:true}));
      (b.genStrategies||[]).forEach(s => ch.push(checkItem(s)));
      if (b.genNote) ch.push(para([run("Notes: ",{bold:true,color:C.teal}), run(b.genNote)]));
      if (!(b.genStrategies||[]).length && !b.genNote) ch.push(para([run("—")]));
      ch.push(blank(60));
      ch.push(para([run("Maintenance plan",{bold:true,size:21,color:C.forest})],{before:0,after:60,border:true}));
      (b.maintStrategies||[]).forEach(s => ch.push(checkItem(s)));
      if (b.maintNote) ch.push(para([run("Notes: ",{bold:true,color:C.teal}), run(b.maintNote)]));
      if (!(b.maintStrategies||[]).length && !b.maintNote) ch.push(para([run("—")]));
      ch.push(blank(60));
      ch.push(para([run("Who will be trained on this BIP?",{bold:true,size:21,color:C.forest})],{before:0,after:60,border:true}));
      ch.push(para([run("Staff: ",{bold:true,color:C.teal}), run(join([...(b.trainWho||[]),b.trainOther].filter(Boolean)))]));
      ch.push(para([run("Methods: ",{bold:true,color:C.teal}), run(join(b.trainMethods||[]))]));
      if (b.trainWhen) ch.push(para([run("When: ",{bold:true,color:C.teal}), run(b.trainWhen)]));
    }
    ch.push(blank(100));
  });

  ch.push(pageBreak());

  // Section 12
  ch.push(hdr("12","Reactive strategies if problem behavior occurs again"));
  ch.push(blank(80));
  const PHASE_KEYS_12 = [
    {key:"p1",label:"Phase 1 — Make the Environment Safer"},
    {key:"p2",label:"Phase 2 — Prompt the FERB"},
    {key:"p3help",label:"Phase 3a — Help: Communicate Needs"},
    {key:"p3prompt",label:"Phase 3b — Prompt: Suggest Calming"},
    {key:"p3wait",label:"Phase 3c — Wait: Withhold Attention"},
    {key:"p4",label:"Phase 4 — Re-entry Task"},
    {key:"p5signals",label:"Phase 5 — Recovery Signals"},
  ];
  bkeys.forEach(bk => {
    const b = bd(bk);
    const rx = b.reactive||{};
    if (hasTwoBeh) { ch.push(subLabel(`Behavior ${bk==="b1"?"1":"2"}`)); ch.push(blank(40)); }
    if (isSame(bk,"reactive")) { ch.push(para([run("Same as Behavior 1",{italics:true,color:C.gray})])); }
    else {
      ch.push(para([run("Who responds: ",{bold:true,color:C.teal}), run(join(rx.reactiveWho||[]))]));
      ch.push(blank(60));
      PHASE_KEYS_12.forEach(ph => {
        const items = rx[ph.key]||[];
        if (!items.length) return;
        ch.push(para([run(ph.label,{bold:true,color:C.teal,size:19})],{before:40,after:40}));
        items.forEach(a => ch.push(checkItem(a)));
      });
      if (rx.roomEvac) {
        ch.push(blank(40));
        ch.push(para([run("Room evacuation may be needed",{bold:true,color:C.orange})]));
        if (rx.roomEvacNote) ch.push(para([run(rx.roomEvacNote)],{indent:360}));
      }
      if (rx.p5RecoveryTime) ch.push(para([run("Recovery time: ",{bold:true,color:C.teal}), run(rx.p5RecoveryTime)]));
      if (rx.p5Debrief) ch.push(para([run("Debrief: ",{bold:true,color:C.teal}), run(rx.p5Debrief)]));
      const postItems = [rx.p5Document&&"Document (ABC sheet)", rx.p5Admin&&"Notify administrator", rx.p5Family&&"Contact family", rx.p5TeamDebrief&&"Team debrief"].filter(Boolean);
      if (postItems.length) { ch.push(blank(40)); ch.push(para([run("Post-incident: ",{bold:true,color:C.teal}), run(join(postItems))])); }
    }
    ch.push(blank(80));
  });

  ch.push(pageBreak());

  // Section 13 — Reduction goals
  ch.push(hdr("13","Behavior reduction goal(s)"));
  ch.push(blank(80));
  bkeys.forEach(bk => {
    const b = bd(bk);
    if (hasTwoBeh) { ch.push(subLabel(`Behavior ${bk==="b1"?"1":"2"}: ${btype(bk)||""}`)); ch.push(blank(60)); }
    if (isSame(bk,"goals")) { ch.push(para([run("Same as Behavior 1",{italics:true,color:C.gray})])); }
    else {
      const base = b.freqMax ? `${b.freqMin?b.freqMin+"–":""}${b.freqMax} times per ${b.freqUnit||"day"}` : "[baseline]";
      const goalText = `By ${b.redGoalDate||"[date]"}, ${name} will reduce ${btype(bk)||"the target behavior"} from a baseline of ${base} to ${b.redGoalTarget||"[target]"} ${b.redGoalUnit||"times per day"} as measured by ${b.redGoalData||"[data method]"} across ${b.redGoalConsec||"[#]"} consecutive ${b.freqUnit==="week"?"weeks":"school days"}.`;
      ch.push(contentBox(goalText));
    }
    ch.push(blank(80));
  });

  // Section 14 — Comms
  ch.push(hdr("14","Home–school communication plan"));
  ch.push(blank(80));
  const c = d.comms||{};
  ch.push(twoCol("Primary contact", `${c.contactName||"—"}  ·  ${c.contactMethod||""}`));
  ch.push(blank(80));
  ch.push(para([run("Routine communication",{bold:true,size:21,color:C.forest})],{before:0,after:60,border:true}));
  (c.commsMethod||[]).forEach(m => ch.push(checkItem(m)));
  if (!(c.commsMethod||[]).length) ch.push(para([run("—")]));
  if (c.commsFreq) ch.push(para([run("Frequency: ",{bold:true,color:C.teal}), run(c.commsFreq)]));
  ch.push(blank(80));
  ch.push(para([run("Incident notification",{bold:true,size:21,color:C.forest})],{before:0,after:60,border:true}));
  (c.commsIncident||[]).forEach(m => ch.push(checkItem(m)));
  if (!(c.commsIncident||[]).length) ch.push(para([run("—")]));
  ch.push(blank(80));
  ch.push(para([run("Family input",{bold:true,size:21,color:C.forest})],{before:0,after:60,border:true}));
  ch.push(contentBox(c.familyInput||"—"));
  ch.push(blank(80));
  ch.push(para([run("Language access",{bold:true,size:21,color:C.forest})],{before:0,after:60,border:true}));
  ch.push(twoCol("Language(s)", join(c.lang||[])));
  if (c.langNote) { ch.push(blank(40)); ch.push(contentBox(c.langNote)); }
  ch.push(blank(200));

  // Footer note
  ch.push(new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
    rows:[new TableRow({ children:[new TableCell({
      borders:{ top:bAll(C.sage,8), bottom:bNone, left:bNone, right:bNone },
      shading:{fill:C.cream,type:ShadingType.CLEAR},
      margins:{top:120,bottom:120,left:160,right:160},
      children:[
        new Paragraph({ spacing:{before:0,after:60}, children:[
          run("Note for Families: ",{bold:true,size:18,color:C.teal}),
          run("Schools are required to follow state Education Code and district policy when addressing student behavior. For students with disabilities, federal law (IDEA) provides additional protections.",{size:18,color:C.gray}),
        ]}),
        new Paragraph({ alignment:AlignmentType.CENTER, spacing:{before:0,after:0}, children:[
          run("Generated by BehaviorPath · BASIL Behavior Lab · basilbehaviorlab.org",{size:16,color:C.gray,italics:true}),
        ]}),
      ],
    })]})],
  }));

  const doc = new Document({
    styles:{ default:{ document:{ run:{ font:"Arial", size:20, color:C.black } } } },
    sections:[{
      properties:{ page:{ size:{ width:12240, height:15840 }, margin:{ top:1080, right:1080, bottom:1080, left:1080 } } },
      headers:{ default: new Header({ children:[new Paragraph({
        alignment:AlignmentType.RIGHT,
        border:{ bottom: bAll(C.sage,6) },
        spacing:{before:0,after:0},
        children:[
          run("IEP 6G-1  ·  Behavior Intervention Plan  ·  ",{size:16,color:C.gray}),
          run(name,{size:16,bold:true,color:C.teal}),
        ],
      })] }) },
      footers:{ default: new Footer({ children:[new Paragraph({
        alignment:AlignmentType.CENTER,
        border:{ top: bAll(C.ltgray,4) },
        spacing:{before:0,after:0},
        children:[
          run("BASIL Behavior Lab · BehaviorPath  ·  Page ",{size:16,color:C.gray}),
          new SimpleField("PAGE"),
        ],
      })] }) },
      children: ch,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BIP_${(d.name||"Student").replace(/\s+/g,"_")}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}


// ────────────────────────────────────────────────────────────
// ── Data Sheet generators (client-side via docx.js)
// ────────────────────────────────────────────────────────────
async function ensureDocx() {
  if (window.docx) return window.docx;
  await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/docx@9.5.3/build/index.js";
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  return window.docx;
}

async function downloadBaselineSheet(d) {
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign, PageOrientation,
  } = await ensureDocx();

  const C = { forest:"003B01", teal:"0B4238", sage:"84B59F", cream:"F5F0E8",
    light:"EBF3EE", white:"FFFFFF", muted:"888888", stripe:"F0F7F2",
    tallybg:"FAFBFA", sumbg:"E4F0E8", green2:"5A8A78" };

  const bNone = { style: BorderStyle.NONE, size: 0, color:"FFFFFF" };
  const bNoneAll = { top:bNone, bottom:bNone, left:bNone, right:bNone };
  const bS = (c="84B59F",sz=4) => ({ style:BorderStyle.SINGLE, size:sz, color:c });
  const bBox = c => ({ top:bS(c), bottom:bS(c), left:bS(c), right:bS(c) });
  const bSage = () => bBox("84B59F");

  const run = (text, opts={}) => new TextRun({ text:text||"", font:"Arial",
    size:opts.size||16, bold:opts.bold||false, italics:opts.italics||false,
    color:opts.color||C.forest });

  const para = (children, opts={}) => new Paragraph({
    children: Array.isArray(children)?children:[children],
    alignment: opts.align||AlignmentType.LEFT,
    spacing: { before:opts.before||0, after:opts.after!==undefined?opts.after:0 },
  });

  const isPara = x => x && x.constructor && x.constructor.name==="Paragraph";
  const cell = (children, opts={}) => new TableCell({
    borders: opts.borders||bSage(),
    shading: opts.fill ? { fill:opts.fill, type:ShadingType.CLEAR } : undefined,
    width: opts.width ? { size:opts.width, type:WidthType.DXA } : undefined,
    verticalAlign: opts.valign||VerticalAlign.CENTER,
    margins: { top:50, bottom:50, left:opts.leftPad!==undefined?opts.leftPad:80, right:60 },
    columnSpan: opts.span,
    children: Array.isArray(children)?children:isPara(children)?[children]:[para(children)],
  });

  const sp = () => para([run("")], {before:0, after:60});

  const secHdr = (title, fill) => new Table({
    width:{size:14040,type:WidthType.DXA}, columnWidths:[14040],
    rows:[new TableRow({ children:[new TableCell({
      borders:bNoneAll, shading:{fill,type:ShadingType.CLEAR},
      margins:{top:80,bottom:80,left:160,right:80},
      children:[para([run(title,{bold:true,size:18,color:C.white})],{before:0,after:0})],
    })]})]
  });

  const PAGE_W = 14040;
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Mon","Tue","Wed","Thu","Fri","Mon","Tue","Wed","Thu","Fri"];

  // Frequency table
  const dateW=680,dayW=440,settingW=900,timeW=700,tallyW=320,tallyCount=15,totalW=560,rateW=520;
  const freqW = dateW+dayW+settingW+timeW+tallyW*tallyCount+totalW+rateW;

  const freqTable = () => new Table({
    width:{size:freqW,type:WidthType.DXA},
    columnWidths:[dateW,dayW,settingW,timeW,...Array(tallyCount).fill(tallyW),totalW,rateW],
    rows:[
      new TableRow({ tableHeader:true, children:[
        cell(para([run("Date",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:dateW}),
        cell(para([run("Day",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:dayW}),
        cell(para([run("Setting / Period",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:settingW}),
        cell(para([run("Time observed",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:timeW}),
        ...Array.from({length:tallyCount},(_,i)=>cell(para([run(`${i+1}`,{bold:true,size:14,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:tallyW})),
        cell(para([run("Total",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:totalW}),
        cell(para([run("Rate/hr",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:rateW}),
      ]}),
      ...Array.from({length:15},(_,i)=>{
        const bg=i%2===0?C.stripe:C.white;
        return new TableRow({ height:{value:320,rule:"atLeast"}, children:[
          cell(para([run("")]),{fill:bg,width:dateW}),
          cell(para([run(DAYS[i],{size:15,color:C.muted})],{align:AlignmentType.CENTER}),{fill:bg,width:dayW}),
          cell(para([run("")]),{fill:bg,width:settingW}),
          cell(para([run("")]),{fill:bg,width:timeW}),
          ...Array.from({length:tallyCount},()=>cell(para([run("")]),{fill:C.tallybg,width:tallyW})),
          cell(para([run("")]),{fill:C.sumbg,width:totalW}),
          cell(para([run("")]),{fill:C.sumbg,width:rateW}),
        ]});
      }),
    ],
  });

  // Duration table
  const epW=500,epCount=10,durSumW=560;
  const durW=dateW+dayW+settingW+epW*epCount+durSumW*3;

  const durTable = () => new Table({
    width:{size:durW,type:WidthType.DXA},
    columnWidths:[dateW,dayW,settingW,...Array(epCount).fill(epW),durSumW,durSumW,durSumW],
    rows:[
      new TableRow({ tableHeader:true, children:[
        cell(para([run("Date",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:dateW}),
        cell(para([run("Day",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:dayW}),
        cell(para([run("Setting",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:settingW}),
        ...Array.from({length:epCount},(_,i)=>cell(para([run(`Ep.${i+1}`,{bold:true,size:14,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:epW})),
        cell(para([run("# Eps",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:durSumW}),
        cell(para([run("Total dur.",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:durSumW}),
        cell(para([run("Mean dur.",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:durSumW}),
      ]}),
      ...Array.from({length:15},(_,i)=>{
        const bg=i%2===0?C.stripe:C.white;
        return new TableRow({ height:{value:320,rule:"atLeast"}, children:[
          cell(para([run("")]),{fill:bg,width:dateW}),
          cell(para([run(DAYS[i],{size:15,color:C.muted})],{align:AlignmentType.CENTER}),{fill:bg,width:dayW}),
          cell(para([run("")]),{fill:bg,width:settingW}),
          ...Array.from({length:epCount},()=>cell(para([run("")]),{fill:C.tallybg,width:epW})),
          cell(para([run("")]),{fill:C.sumbg,width:durSumW}),
          cell(para([run("")]),{fill:C.sumbg,width:durSumW}),
          cell(para([run("")]),{fill:C.sumbg,width:durSumW}),
        ]});
      }),
    ],
  });

  // Intensity table
  const ratingW=560,descrW=4800,antW=2400;
  const intW=dateW+dayW+settingW+ratingW+descrW+antW;
  const intColW=Math.floor(intW/4);

  const intTable = () => new Table({
    width:{size:intW,type:WidthType.DXA},
    columnWidths:[dateW,dayW,settingW,ratingW,descrW,antW],
    rows:[
      new TableRow({ tableHeader:true, children:[
        cell(para([run("Date",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:dateW}),
        cell(para([run("Day",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:dayW}),
        cell(para([run("Setting",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:settingW}),
        cell(para([run("Rating
(1–4)",{bold:true,size:15,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:ratingW}),
        cell(para([run("Behavioral description — what exactly happened?",{bold:true,size:15,color:C.teal})]),{fill:C.light,width:descrW}),
        cell(para([run("Antecedent / context",{bold:true,size:15,color:C.teal})]),{fill:C.light,width:antW}),
      ]}),
      ...Array.from({length:12},(_,i)=>{
        const bg=i%2===0?C.stripe:C.white;
        return new TableRow({ height:{value:380,rule:"atLeast"}, children:[
          cell(para([run("")]),{fill:bg,width:dateW}),
          cell(para([run(DAYS[i%15],{size:15,color:C.muted})],{align:AlignmentType.CENTER}),{fill:bg,width:dayW}),
          cell(para([run("")]),{fill:bg,width:settingW}),
          cell(para([run("")]),{fill:bg,width:ratingW}),
          cell(para([run("")]),{fill:C.white,width:descrW}),
          cell(para([run("")]),{fill:C.white,width:antW}),
        ]});
      }),
    ],
  });

  const name = d.name||"";
  const beh1 = d.beh1type||"";
  const b1 = d.b1||{};
  const baselineFreq = b1.freqMax ? `${b1.freqMin?b1.freqMin+"–":""}${b1.freqMax} per ${b1.freqUnit||"day"}` : "_______";
  const baseDur = b1.durMax ? `${b1.durMin?b1.durMin+"–":""}${b1.durMax} ${b1.durUnit||"seconds"}` : "_______";

  const doc2 = new Document({ sections:[{
    properties:{ page:{ size:{ width:12240, height:15840, orientation:PageOrientation.LANDSCAPE },
      margin:{ top:576, bottom:576, left:576, right:576 } } },
    children:[
      new Table({ width:{size:PAGE_W,type:WidthType.DXA}, columnWidths:[3000,7440,3600],
        rows:[new TableRow({ children:[
          cell(para([run("BehaviorPath",{bold:true,size:26,color:C.white})]),{fill:C.forest,borders:bNoneAll,leftPad:160}),
          cell(para([run("Baseline Frequency & Duration Data Sheet",{size:20,color:"C8D8CC"})],{align:AlignmentType.CENTER}),{fill:C.forest,borders:bNoneAll}),
          cell(para([run("BASIL Behavior Lab",{size:15,color:C.sage})],{align:AlignmentType.CENTER}),{fill:C.forest,borders:bNoneAll}),
        ]})]
      }),
      sp(),
      new Table({ width:{size:PAGE_W,type:WidthType.DXA}, columnWidths:[4680,2280,2280,2280,2520],
        rows:[
          new TableRow({ children:[
            cell(para([run(`Student: ${name||"_________________________________"}`,{size:16})]),{fill:C.cream,width:4680}),
            cell(para([run("School year: _________",{size:16})]),{fill:C.cream,width:2280}),
            cell(para([run("Grade: _________",{size:16})]),{fill:C.cream,width:2280}),
            cell(para([run("Setting: _____________",{size:16})]),{fill:C.cream,width:2280}),
            cell(para([run("Observer: _______________",{size:16})]),{fill:C.cream,width:2520}),
          ]}),
          new TableRow({ children:[new TableCell({
            borders:bSage(), shading:{fill:C.cream,type:ShadingType.CLEAR},
            margins:{top:50,bottom:50,left:80,right:60},
            columnSpan:5, width:{size:PAGE_W,type:WidthType.DXA},
            children:[para([run(`Target behavior: ${beh1||"_______________________________________________________________________"}   Date range: _______________________`,{size:16})])],
          })]}),
        ]
      }),
      sp(),
      new Table({ width:{size:PAGE_W,type:WidthType.DXA}, columnWidths:[PAGE_W],
        rows:[new TableRow({ children:[cell(para([
          run("Purpose: ",{bold:true,size:16,color:C.teal}),
          run("Record baseline data ",{size:16,color:C.teal}),
          run("before ",{bold:true,italics:true,size:16,color:C.teal}),
          run("implementing the BIP. Collect for a minimum of 5–10 school days. This establishes the Section 13 Reduction Goal baseline.",{size:16,color:C.teal}),
        ]),{fill:C.light,width:PAGE_W})]})]
      }),
      sp(),
      secHdr("PART 1 — FREQUENCY DATA  (tally each occurrence in the numbered columns)",C.teal),
      freqTable(),
      new Table({ width:{size:freqW,type:WidthType.DXA}, columnWidths:[freqW],
        rows:[new TableRow({ children:[cell(para([
          run("Frequency summary:  ",{bold:true,size:15,color:C.teal}),
          run(`Baseline from Section 4: ${baselineFreq}    Total occurrences: _______    Days: _______    Range: _______ – _______`,{size:15}),
        ]),{fill:C.cream,width:freqW})]})]
      }),
      sp(),
      secHdr("PART 2 — DURATION DATA  (stopwatch required — record each episode in seconds or minutes)",C.forest),
      durTable(),
      new Table({ width:{size:durW,type:WidthType.DXA}, columnWidths:[durW],
        rows:[new TableRow({ children:[cell(para([
          run("Duration summary:  ",{bold:true,size:15,color:C.teal}),
          run(`Baseline from Section 4: ${baseDur}    Longest episode: _______    Shortest episode: _______    Mean total/day: _______`,{size:15}),
        ]),{fill:C.cream,width:durW})]})]
      }),
      sp(),
      secHdr("PART 3 — INTENSITY RATING  (one global rating per observation; use scale below)",C.green2),
      new Table({ width:{size:intW,type:WidthType.DXA}, columnWidths:Array(4).fill(intColW),
        rows:[new TableRow({ children:[
          ["1 — Mild","Minimal disruption; easily redirected; no safety concern","EDFAED"],
          ["2 — Moderate","Disrupts learning; harder to redirect; minor safety concern","FFF8E5"],
          ["3 — Severe","Resistant to redirection; clear safety concern","FFF0E8"],
          ["4 — Crisis","Immediate intervention needed; high safety risk","FDEAEA"],
        ].map(([lbl,desc,bg])=>new TableCell({
          borders:bSage(), shading:{fill:bg,type:ShadingType.CLEAR},
          margins:{top:60,bottom:60,left:100,right:80},
          children:[
            para([run(lbl,{bold:true,size:16,color:C.forest})]),
            para([run(desc,{size:14,color:C.muted})]),
          ],
        }))})]
      }),
      intTable(),
      sp(),
      secHdr("BASELINE SUMMARY & GOAL-SETTING TRANSFER  (complete after collecting all data)",C.teal),
      new Table({ width:{size:PAGE_W,type:WidthType.DXA}, columnWidths:[Math.floor(PAGE_W/2),Math.floor(PAGE_W/2)],
        rows:[
          new TableRow({ children:[
            cell(para([run(`Baseline frequency (mean): ${baselineFreq}`,{size:16})]),{fill:C.cream,width:Math.floor(PAGE_W/2)}),
            cell(para([run(`Baseline duration (mean): ${baseDur}`,{size:16})]),{fill:C.cream,width:Math.floor(PAGE_W/2)}),
          ]}),
          new TableRow({ children:[
            cell(para([run("Baseline intensity (typical):  ☐ 1-Mild  ☐ 2-Moderate  ☐ 3-Severe  ☐ 4-Crisis",{size:16})]),{fill:C.cream,width:Math.floor(PAGE_W/2)}),
            cell(para([run("Number of observation days: _______",{size:16})]),{fill:C.cream,width:Math.floor(PAGE_W/2)}),
          ]}),
          new TableRow({ children:[
            cell(para([run("Settings where behavior occurs most: ________________________",{size:16})]),{fill:C.cream,width:Math.floor(PAGE_W/2)}),
            cell(para([run("Settings where behavior is absent/low: ________________________",{size:16})]),{fill:C.cream,width:Math.floor(PAGE_W/2)}),
          ]}),
          new TableRow({ children:[new TableCell({
            borders:bSage(), shading:{fill:C.cream,type:ShadingType.CLEAR},
            margins:{top:80,bottom:80,left:100,right:80},
            columnSpan:2, width:{size:PAGE_W,type:WidthType.DXA},
            children:[para([
              run("Reduction goal transfer to Section 13:  ",{bold:true,size:16,color:C.teal}),
              run(`By _____________, ${name||"[student]"} will reduce ${beh1||"[behavior]"} from a baseline of _______ per _______ to _______ per _______ as measured by _______________________________ across _______ consecutive school days.`,{size:16}),
            ])],
          })]})
        ],
      }),
      sp(),
      para([run("BehaviorPath · BASIL Behavior Lab · basilbehaviorlab.org  |  Collect 5–10 days of baseline before writing Section 13 goals  |  Aligned to SIRAS IEP Form 6G",{size:14,color:C.sage})],{align:AlignmentType.CENTER}),
    ],
  }]});

  const buf = await Packer.toBuffer(doc2);
  const blob = new Blob([buf], { type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `BehaviorPath_Baseline_${(d.name||"Student").replace(/\s+/g,"_")}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadFidelitySheet(d) {
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  } = await ensureDocx();

  const C = { forest:"003B01", teal:"0B4238", sage:"84B59F", cream:"F5F0E8",
    light:"EBF3EE", white:"FFFFFF", muted:"888888", red:"C0392B", green2:"5A8A78", gold:"7B6A2A" };

  const bNone = { style:BorderStyle.NONE, size:0, color:"FFFFFF" };
  const bNoneAll = { top:bNone, bottom:bNone, left:bNone, right:bNone };
  const bS = (c="84B59F",sz=4) => ({ style:BorderStyle.SINGLE, size:sz, color:c });
  const bBox = c => ({ top:bS(c), bottom:bS(c), left:bS(c), right:bS(c) });
  const bSage = () => bBox("84B59F");

  const run = (text, opts={}) => new TextRun({ text:text||"", font:"Arial",
    size:opts.size||18, bold:opts.bold||false, italics:opts.italics||false, color:opts.color||C.forest });
  const para = (children, opts={}) => new Paragraph({
    children:Array.isArray(children)?children:[children],
    alignment:opts.align||AlignmentType.LEFT,
    spacing:{before:opts.before||0,after:opts.after!==undefined?opts.after:0},
  });
  const isPara = x => x && x.constructor && x.constructor.name==="Paragraph";
  const cell = (children, opts={}) => new TableCell({
    borders:opts.borders||bSage(),
    shading:opts.fill?{fill:opts.fill,type:ShadingType.CLEAR}:undefined,
    width:opts.width?{size:opts.width,type:WidthType.DXA}:undefined,
    verticalAlign:opts.valign||VerticalAlign.CENTER,
    margins:{top:60,bottom:60,left:opts.leftPad!==undefined?opts.leftPad:100,right:80},
    columnSpan:opts.span,
    children:Array.isArray(children)?children:isPara(children)?[children]:[para(children)],
  });
  const sp = () => para([run("")],{before:0,after:80});

  const secHdr = (title,fill) => new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
    rows:[new TableRow({ children:[new TableCell({
      borders:bNoneAll, shading:{fill,type:ShadingType.CLEAR},
      margins:{top:80,bottom:80,left:160,right:80},
      children:[para([run(title,{bold:true,size:18,color:C.white})],{before:0,after:0})],
    })]})]
  });

  const colHdr = () => new TableRow({ tableHeader:true, children:[
    cell(para([run("BIP Component",{bold:true,size:16,color:C.teal})]),{fill:C.light,width:3200}),
    cell(para([run("Prompt / Indicator",{bold:true,size:16,color:C.teal})]),{fill:C.light,width:2000}),
    cell(para([run("2",{bold:true,size:16,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:400}),
    cell(para([run("1",{bold:true,size:16,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:400}),
    cell(para([run("0",{bold:true,size:16,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:400}),
    cell(para([run("N/A",{bold:true,size:16,color:C.teal})],{align:AlignmentType.CENTER}),{fill:C.light,width:400}),
    cell(para([run("Notes / Evidence",{bold:true,size:16,color:C.teal})]),{fill:C.light,width:2560}),
  ]});

  const itemRow = (label, hint, i) => {
    const bg = i%2===0?"F7FAF8":C.white;
    return new TableRow({ children:[
      cell([para([run(label,{size:17})]), hint?para([run(hint,{size:15,italics:true,color:C.muted})]):para([run("")])],{fill:bg,width:3200}),
      cell(para([run("")]),{fill:bg,width:2000}),
      cell(para([run("☐",{size:17})],{align:AlignmentType.CENTER}),{fill:bg,width:400}),
      cell(para([run("☐",{size:17})],{align:AlignmentType.CENTER}),{fill:bg,width:400}),
      cell(para([run("☐",{size:17})],{align:AlignmentType.CENTER}),{fill:bg,width:400}),
      cell(para([run("☐",{size:17})],{align:AlignmentType.CENTER}),{fill:bg,width:400}),
      cell(para([run("")]),{fill:C.white,width:2560}),
    ]});
  };

  const itemTable = (items) => new Table({
    width:{size:9360,type:WidthType.DXA},
    columnWidths:[3200,2000,400,400,400,400,2560],
    rows:[colHdr(),...items.map(([label,hint],i)=>itemRow(label,hint,i))],
  });

  const sections = [
    { title:"A — Antecedent / Preventive Strategies  (Sections 5–7)", color:C.teal, items:[
      ["Predictors identified; staff can name ≥2 triggers","Can staff name them without prompting?"],
      ["Environmental modifications are in place","Seating, lighting, noise, transition supports"],
      ["Pre-corrections delivered before known triggers","Verbal, visual, or schedule preview"],
      ["Schedule is predictable and posted","Visual schedule visible to student"],
      ["Choice-making embedded in the day","≥1 meaningful choice offered per period"],
      ["Preferred reinforcers are accessible as planned","Inventory current; student still motivated"],
    ]},
    { title:"B — Teaching the Replacement Behavior / FERB  (Sections 9–10)", color:C.green2, items:[
      ["FERB explicitly taught (not just prompted)","Student can demonstrate independently"],
      ["Teaching happening in the natural context","Not only in pull-out; generalization targeted"],
      ["Staff use the agreed instructional method","DTT, NE teaching, video model, etc."],
      ["FERB reinforced immediately and contingently","Within 3–5 seconds"],
      ["FERB goal data is being recorded","Data sheet present and filled in"],
      ["Student uses FERB across settings and staff","Evidence of generalization occurring"],
    ]},
    { title:"C — Reinforcement System  (Section 11)", color:C.gold, items:[
      ["Identified reinforcers available and current","Matches student's verified current preference"],
      ["Reinforcement delivered on the planned schedule","FR, VR, interval — as written in the BIP"],
      ["Reinforcement contingent (not after problem behavior)","Not delivered non-contingently"],
      ["Reinforcer variety maintained (no satiation)","Rotating menu; student still visibly motivated"],
      ["Specific and immediate praise","Name + action + reason within 3–5 seconds"],
      ["Token economy / point system as written","Chart visible; exchange happening on schedule"],
    ]},
    { title:"D — Reactive Strategies  (Section 12)", color:C.red, items:[
      ["Staff responded calmly without escalation","Low voice, neutral affect, no lengthy lecturing"],
      ["Phase 1 — environment made safer immediately","Remove hazards; reposition peers as needed"],
      ["Phase 2 — FERB prompted before escalating","Verbal, visual, or gestural prompt offered first"],
      ["Phase 3 — de-escalation used as written","Response matches BIP de-escalation plan exactly"],
      ["Attention withheld (no lengthy verbal engagement)","Staff did not argue, plead, or repeat redirects"],
      ["Room evacuation followed written protocol (if used)","Correct signal, exit, and supervision as planned"],
      ["Re-entry task completed before student returned","Brief, low-demand task confirmed as complete"],
      ["Phase 5 debrief; ABC data recorded same day","Incident fully documented before end of day"],
    ]},
    { title:"E — Documentation & Communication  (Sections 11 / 14)", color:C.forest, items:[
      ["All staff know the BIP; can paraphrase it","Staff can describe plan without prompting"],
      ["Data collected and recorded as planned","Data sheets up to date per collection schedule"],
      ["Data reviewed weekly by case manager","Trends identified; plan adjusted if needed"],
      ["Family communication per the plan","Log, call, or email on agreed schedule"],
      ["Any incident communicated same/next day","Per communication plan requirements"],
      ["BIP reviewed since last IEP or behavior change","Date of last formal review is noted"],
    ]},
  ];

  const name = d.name||"";
  const behaviors = [d.beh1type,d.beh2type].filter(Boolean).join(" / ");

  const doc3 = new Document({ sections:[{
    properties:{ page:{ size:{width:12240,height:15840}, margin:{top:720,bottom:720,left:720,right:720} } },
    children:[
      new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2600,4560,2200],
        rows:[new TableRow({ children:[
          cell(para([run("BehaviorPath",{bold:true,size:28,color:C.white})]),{fill:C.forest,borders:bNoneAll,leftPad:160}),
          cell(para([run("BIP Fidelity Checklist",{size:22,color:"C8D8CC"})],{align:AlignmentType.CENTER}),{fill:C.forest,borders:bNoneAll}),
          cell(para([run("BASIL Behavior Lab",{size:16,color:C.sage})],{align:AlignmentType.CENTER}),{fill:C.forest,borders:bNoneAll}),
        ]})]
      }),
      sp(),
      new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[4680,2340,2340],
        rows:[
          new TableRow({ children:[
            cell(para([run(`Student: ${name||"________________________________"}`,{size:17})]),{fill:C.cream,width:4680}),
            cell(para([run("Date: _____________________",{size:17})]),{fill:C.cream,width:2340}),
            cell(para([run("Observer: _____________________",{size:17})]),{fill:C.cream,width:2340}),
          ]}),
          new TableRow({ children:[
            cell(para([run(`Behavior(s): ${behaviors||"___________________________________________________"}`,{size:17})]),{fill:C.cream,width:4680}),
            cell(para([run("Setting: _____________________",{size:17})]),{fill:C.cream,width:2340}),
            cell(para([run("Session length: ____________",{size:17})]),{fill:C.cream,width:2340}),
          ]}),
        ],
      }),
      sp(),
      new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
        rows:[new TableRow({ children:[cell(para([
          run("Rating scale:  ",{bold:true,size:17,color:C.teal}),
          run("2",{bold:true,size:17,color:C.teal}), run(" = Implemented with fidelity    ",{size:17,color:C.teal}),
          run("1",{bold:true,size:17,color:C.teal}), run(" = Partially implemented    ",{size:17,color:C.teal}),
          run("0",{bold:true,size:17,color:C.teal}), run(" = Not implemented    ",{size:17,color:C.teal}),
          run("N/A",{bold:true,size:17,color:C.teal}), run(" = Not applicable today",{size:17,color:C.teal}),
        ]),{fill:C.light,width:9360})]})]
      }),
      sp(),
      ...sections.flatMap(sec=>[secHdr(sec.title,sec.color), itemTable(sec.items), sp()]),
      secHdr("SUMMARY SCORING",C.teal),
      new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[3000,1200,2760,2400],
        rows:[
          new TableRow({ children:[
            cell(para([run("Total items scored (exclude N/A):",{size:17})]),{fill:C.cream,width:3000}),
            cell(para([run("___________",{size:17})]),{fill:C.cream,width:1200}),
            cell(para([run("Total points earned:",{size:17})]),{fill:C.cream,width:2760}),
            cell(para([run("_______ / _______ possible",{size:17})]),{fill:C.cream,width:2400}),
          ]}),
          new TableRow({ children:[
            cell(para([run("Fidelity %  (points ÷ possible × 100):",{bold:true,size:17})]),{fill:C.cream,width:3000}),
            cell(para([run("_______ %",{bold:true,size:18})]),{fill:C.cream,width:1200}),
            new TableCell({
              borders:bSage(), shading:{fill:C.cream,type:ShadingType.CLEAR},
              margins:{top:60,bottom:60,left:100,right:80},
              columnSpan:2, width:{size:5160,type:WidthType.DXA},
              children:[para([
                run("Threshold:  ",{size:17,color:C.teal}),
                run("≥ 80%",{bold:true,size:17,color:C.teal}),
                run(" = plan implemented with fidelity",{size:17,color:C.teal}),
              ])],
            }),
          ]}),
        ],
      }),
      sp(),
      secHdr("FOLLOW-UP ACTIONS NEEDED",C.forest),
      new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2800,4760,1800],
        rows:[
          new TableRow({ children:[
            cell(para([run("Area of concern",{bold:true,size:16,color:C.teal})]),{fill:C.light,width:2800}),
            cell(para([run("Action / person responsible",{bold:true,size:16,color:C.teal})]),{fill:C.light,width:4760}),
            cell(para([run("By when",{bold:true,size:16,color:C.teal})]),{fill:C.light,width:1800}),
          ]}),
          ...[0,1,2,3].map(i=>new TableRow({
            height:{value:480,rule:"atLeast"},
            children:[
              cell(para([run("")]),{fill:i%2===0?"F7FAF8":C.white,width:2800}),
              cell(para([run("")]),{fill:i%2===0?"F7FAF8":C.white,width:4760}),
              cell(para([run("")]),{fill:i%2===0?"F7FAF8":C.white,width:1800}),
            ],
          })),
        ],
      }),
      sp(),
      new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[4680,4680],
        rows:[new TableRow({ children:[
          cell(para([run("Observer signature: _________________________________   Date: ___________",{size:17})]),{borders:bNoneAll,width:4680}),
          cell(para([run("Staff reviewed with: _________________________________   Date: ___________",{size:17})]),{borders:bNoneAll,width:4680}),
        ]})],
      }),
      sp(),
      para([run("BehaviorPath · BASIL Behavior Lab · basilbehaviorlab.org  |  Aligned to SIRAS IEP Form 6G — Behavior Intervention Plan",{size:14,color:C.sage})],{align:AlignmentType.CENTER}),
    ],
  }]});

  const buf = await Packer.toBuffer(doc3);
  const blob = new Blob([buf], { type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `BehaviorPath_Fidelity_${(d.name||"Student").replace(/\s+/g,"_")}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}


function RenderOutput({ d, go, dl, mode, setMode }) {
  const [downloading, setDownloading] = React.useState(false);
  const [dlError, setDlError] = React.useState(null);

  const handleDownload = async () => {
    setDownloading(true);
    setDlError(null);
    try {
      await downloadBIPDocx(d);
    } catch(e) {
      console.error(e);
      setDlError("Download failed — try again or use the text copy below.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div style={{textAlign:"center",marginBottom:26}}>
        <div style={{fontSize:50}}>🪷</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:B.forest,marginBottom:6}}>Your plan is ready.</h2>
        <p style={{fontSize:13.5,color:B.muted,fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>Download a filled Word document or copy text below.</p>
        <p style={{fontSize:11.5,color:B.sage,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>This plan follows the structure of the SIRAS IEP Form 6G — Behavior Intervention Plan.</p>
      </div>

      {/* Download BIP button */}
      <button onClick={handleDownload} disabled={downloading}
        style={{width:"100%",padding:"14px",borderRadius:10,border:"none",cursor:downloading?"not-allowed":"pointer",
          background:downloading?B.sage:B.forest,color:B.white,fontWeight:700,fontSize:14,
          fontFamily:"'DM Sans',sans-serif",marginBottom:10,transition:"all 0.2s",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        {downloading
          ? "⏳  Generating BIP document…"
          : "⬇️  Download Filled BIP (.docx)"}
      </button>
      {dlError && <div style={{padding:"9px 12px",background:"#FFF0EE",borderRadius:8,border:"1.5px solid #E8834A55",fontSize:12.5,color:"#C0392B",fontFamily:"'DM Sans',sans-serif",marginBottom:10}}>{dlError}</div>}

      <div style={{display:"flex",gap:9,marginBottom:14}}>
        <button onClick={dl} style={{flex:1,padding:"10px",borderRadius:9,border:`1.5px solid ${B.border}`,cursor:"pointer",background:B.white,color:B.muted,fontWeight:500,fontSize:12.5,fontFamily:"'DM Sans',sans-serif"}}>Copy as text (.txt)</button>
        <button onClick={()=>go(-1)} style={{flex:1,padding:"10px",borderRadius:9,border:`1.5px solid ${B.border}`,cursor:"pointer",background:B.white,color:B.muted,fontWeight:500,fontSize:12.5,fontFamily:"'DM Sans',sans-serif"}}>← Edit Plan</button>
      </div>

      {/* Text preview */}
      <div style={{background:B.teal,color:"#C8D8CC",borderRadius:12,padding:"18px 22px",fontFamily:"monospace",fontSize:11,lineHeight:1.9,whiteSpace:"pre-wrap",maxHeight:360,overflowY:"auto"}}>
        {buildOutput(d)}
      </div>

      {/* Data Sheets section */}
      <div style={{marginTop:16,padding:"14px 16px",background:B.cream,borderRadius:11,border:`1px solid ${B.border}`}}>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:12,color:B.forest,marginBottom:10}}>📋 Data Sheets</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={()=>downloadBaselineSheet(d)}
            style={{width:"100%",padding:"11px 14px",borderRadius:9,border:`1.5px solid ${B.teal}`,cursor:"pointer",
              background:"#fff",color:B.teal,fontWeight:600,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .15s"}}>
            📊 Download Baseline Frequency & Duration Sheet (.docx)
          </button>
          <button onClick={()=>downloadFidelitySheet(d)}
            style={{width:"100%",padding:"11px 14px",borderRadius:9,border:`1.5px solid ${B.forest}`,cursor:"pointer",
              background:"#fff",color:B.forest,fontWeight:600,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .15s"}}>
            ✅ Download BIP Fidelity Checklist (.docx)
          </button>
        </div>
        <div style={{marginTop:10,fontSize:10.5,color:B.muted,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>
          Student name and behavior are pre-filled from your plan. Print and complete by hand.
        </div>
      </div>

      <div style={{marginTop:10,padding:"10px 14px",background:B.cream,borderRadius:9,border:`1px solid ${B.border}`,fontSize:11,color:B.teal,fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,textAlign:"center"}}>
        <strong>Where Behavior Plans Begin</strong><br/>
        <span style={{fontSize:10,color:B.muted}}>BehaviorPath · BASIL Behavior Lab · basilbehaviorlab.org</span>
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────────────────
// ── BehaviorPath
// ────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
// BehaviorPath.jsx — Root component
// State + navigation + app shell only.
// All screens live in screens/*.jsx
// ─────────────────────────────────────────────────────────────────
// ── Per-behavior state factory ────────────────────────────────────
function mkB() {
  return {
    impedes: [],
    freqMin: "", freqMax: "", freqUnit: "day", freqCtx: "",
    intensity: "", durMin: "", durMax: "", durUnit: "seconds",
    ants: [], antNote: "",
    envSel: [], envS7: {}, envWho: "",
    fns: [], fnFrames: [],
    ferbs: [], ferbQ1: "", ferbQ2: "",
    ferbGoalDate: "", ferbGoalAnt: "", ferbGoalData: "",
    teach: [], teachSetting: "", teachMaterials: "",
    teachStart: "", teachLooksLike: "", teachReinforce: [],
    reinf: [], reinfSchedule: [], reinfScheduleNote: "", reinfBasis: "",
    trainWho: [], trainMethods: [], trainWhen: "", trainMonitor: "",
    establishWho: [], establishOther: "", genStrategies: [], genNote: "",
    maintStrategies: [], maintNote: "", trainOther: "",
    reactive: {},
    ferbGoal: "", redGoal: "",
    redGoalDate: "", redGoalTarget: "", redGoalUnit: "", redGoalConsec: "", redGoalData: "",
    goalType: "standard", ptRate: "", ptAccuracy: "", ptTimings: "",
    reinfItems: [], reinfCustom: "",
  };
}

const SAME_SECTIONS = [
  "impedes","baseline","ants","env",
  "function","ferb","teaching","reinforce","reactive","goals","comms",
];
const SAME_KEY_MAP = {
  impedes:   ["impedes"],
  baseline:  ["freqMin","freqMax","freqUnit","freqCtx","intensity","durMin","durMax","durUnit"],
  ants:      ["ants","antNote"],
  env:       ["envSel","envS7","envWho"],
  function:  ["fns","fnFrames"],
  ferb:      ["ferbs","ferbQ1","ferbQ2"],
  teaching:  ["teach","teachSetting","teachMaterials","teachStart","teachLooksLike","teachReinforce","ferbGoalDate","ferbGoalAnt","ferbGoalData","goalType","ptRate","ptAccuracy","ptTimings"],
  reinforce: ["reinf","reinfSchedule","reinfScheduleNote","reinfBasis","reinfItems","reinfCustom"],
  reactive:  ["reactive"],
  goals:     ["ferbGoal","redGoal"],
  comms:     ["commsMethod","commsFreq","commsWho","commsIncident","commsNote"],
};

// ── Root component ────────────────────────────────────────────────
const LS_KEY = "behaviorpath_draft";

function loadDraft() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function mkInitialD() {
  return {
    name: "", level: "moderate",
    beh1type: "", beh1: "",
    beh2type: "", beh2: "",
    same: Object.fromEntries(SAME_SECTIONS.map(s => [s, false])),
    b1: mkB(), b2: mkB(),
    comms: {},
  };
}

function BehaviorPath() {
  const draft = loadDraft();
  const [si, setSi]         = useState(draft?.si ?? 0);
  const [anim, setAnim]     = useState(true);
  const [d, setD]           = useState(draft?.d ?? mkInitialD());
  const [hasDraft, setHasDraft] = useState(!!draft);
  const [saveFlash, setSaveFlash] = useState(false);
  const [mode, setMode] = useState("SIRAS");
  const scrollRef = useRef(null);

  // ── Auto-save to localStorage whenever d or si changes ──────────
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ d, si, savedAt: Date.now() }));
      setSaveFlash(true);
      const t = setTimeout(() => setSaveFlash(false), 1200);
      return () => clearTimeout(t);
    } catch { /* storage full or unavailable */ }
  }, [d, si]);

  // ── JSON backup export ───────────────────────────────────────────
  const exportDraft = useCallback(() => {
    const blob = new Blob([JSON.stringify({ d, si, savedAt: Date.now() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BehaviorPath_${(d.name||"draft").replace(/\s+/g,"_")}_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [d, si]);

  // ── JSON backup import ───────────────────────────────────────────
  const importDraft = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed.d) { setD(parsed.d); setSi(parsed.si ?? 0); }
        } catch { alert("Could not read this file. Make sure it's a BehaviorPath backup."); }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  // ── Clear / start over ───────────────────────────────────────────
  const clearDraft = useCallback(() => {
    if (!window.confirm("Start over? This will clear all your current progress.")) return;
    localStorage.removeItem(LS_KEY);
    setD(mkInitialD());
    setSi(0);
    setHasDraft(false);
  }, []);

  // Derived
  const sid             = STOPS[si].id;
  const sec             = STOPS[si].section;
  const pct             = Math.round((si / (STOPS.length - 1)) * 100);
  const hasTwoBehaviors = !!(d.beh1type && d.beh2type);
  const activeBkeys     = hasTwoBehaviors ? ["b1","b2"] : ["b1"];

  // Updaters
  const upd  = (k, v) => setD(p => ({...p, [k]: v}));
  const updB = (bk, k, v) => setD(p => ({...p, [bk]: {...p[bk], [k]: v}}));
  const togB = (bk, k, v) => setD(p => ({
    ...p, [bk]: {...p[bk], [k]: p[bk][k].includes(v) ? p[bk][k].filter(x=>x!==v) : [...p[bk][k], v]},
  }));
  const setSame = (sec, val) => setD(p => {
    const next = {...p, same: {...p.same, [sec]: val}};
    if (val) {
      const keys = SAME_KEY_MAP[sec] || [];
      next.b2 = {...p.b2, ...Object.fromEntries(Object.entries(p.b1).filter(([k]) => keys.includes(k)))};
    }
    return next;
  });

  // Helpers
  const availFerbs = bk => {
    const fns = d[bk]?.fns || [];
    if (!fns.length) return [];
    return [...new Map(fns.flatMap(fid => (FERBS[fid]||[])).map(f => [f.l, f])).values()];
  };
  const availFrames = bk => {
    const fns = d[bk]?.fns || [];
    if (!fns.length) return [];
    return [...new Set(fns.flatMap(fid => FUNCTIONS.find(f=>f.id===fid)?.frames||[]))];
  };

  // Navigation
  const scrollTop = () => setTimeout(() => {
    window.scrollTo({top:0,behavior:"instant"});
    scrollRef.current?.scrollTo({top:0,behavior:"instant"});
  }, 10);
  const go   = dir => { setAnim(false); setTimeout(()=>{setSi(i=>Math.max(0,Math.min(STOPS.length-1,i+dir)));setAnim(true);scrollTop();},140); };
  const jump = i   => { setAnim(false); setTimeout(()=>{setSi(i);setAnim(true);scrollTop();},100); };
  const dl   = ()  => { const a=document.createElement("a"); a.href="data:text/plain;charset=utf-8,"+encodeURIComponent(buildOutput(d)); a.download=`BehaviorPath_BIP_${d.name||"Student"}.txt`; a.click(); };

  // Nav component (inside — needs go/si closure)
  const Nav = ({ok=true, next="Continue →"}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:36,paddingTop:22,borderTop:`1px solid ${B.border}`}}>
      <button onClick={()=>go(-1)} disabled={si===0} style={{padding:"10px 20px",borderRadius:9,border:`1.5px solid ${B.border}`,cursor:si===0?"default":"pointer",background:B.white,color:si===0?B.border:B.muted,fontWeight:500,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>← Back</button>
      <div style={{display:"flex",gap:3}}>{STOPS.map((_,i)=><div key={i} style={{width:i===si?16:6,height:6,borderRadius:3,background:i<si?B.sage:i===si?B.forest:B.border,transition:"all 0.3s"}}/>)}</div>
      <button onClick={()=>ok&&go(1)} disabled={!ok} style={{padding:"10px 24px",borderRadius:9,border:"none",cursor:ok?"pointer":"default",background:ok?B.forest:B.border,color:B.white,fontWeight:600,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>{next}</button>
    </div>
  );

  // Shared props for all screen render functions
  const sp = { d, upd, updB, togB, setSame, setD, hasTwoBehaviors, activeBkeys, availFerbs, availFrames, mode, setMode, go, dl, Nav, sec };

  // Screen router
  const screen = () => {
    switch (sid) {
      case "welcome":     return <WelcomeScreen go={go} mode={mode} setMode={setMode}/>;
      case "student":     return renderStudent(sp);
      case "behavior":    return renderBehavior(sp);
      case "impedes":     return renderImpedes(sp);
      case "baseline":    return renderBaseline(sp);
      case "antecedents": return renderAntecedents(sp);
      case "environment": return renderEnvironment(sp);
      case "function":    return renderFunction(sp);
      case "ferb":        return renderFerb(sp);
      case "teaching":    return renderTeaching(sp);
      case "reinforce":   return renderReinforce(sp);
      case "training":    return renderTraining(sp);
      case "ferb_check":  return renderFerbCheck(sp);
      case "reactive":    return renderReactive(sp);
      case "goals":       return renderGoals(sp);
      case "comms":       return renderComms(sp);
      case "output":      return <RenderOutput {...sp}/>;
      default:            return null;
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${B.mint};border-radius:3px}`}</style>

      <div style={{minHeight:"100vh",background:B.warmWhite,fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column"}}>

        {/* Top bar */}
        <div style={{background:B.forest,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 16px rgba(0,20,0,0.25)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <img src="data:image/png;base64,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BEEyujJWLpcVRZFyuVyrppOVzSZjs2bN0pNPPqlHH31UL7zwgqZMmcLZA+iguLgBAOigdtppJxOXNqy//vrq06ePGhoakgBBJpNRGIZJ4zbXdeU4TvJa3FguDiDEzeQqPwbQMcWZSpWTWyoZY+T7vlzXlW3byX2jchJFHJxsbm7WF198obfeekuPP/64nnvuOd17772cQ4AOhAsaAIAOZPDgwWafffbRTjvtpLq6OnXt2lWu6yYpzJXTF+IggqSFshMkLTY7IQxD+b7fKtsBQMdS2VPB9/3knmHbdjKRJW7saNt2q3tI2/tKXCphWVYyieLdd9/Vc889p3vuuUePPPKI3n33Xc4lQA3jAgYAoIYNHDjQbLrppho0aJC22GIL9erVS1Lrsob447bj5mJxAKHykBCnNMcHgnh8XfxnxtkLADqmymu87bUeZydUBhcLhYJs25bneUkQIs6GioMJkpJeDZZlJb8/Lpl47LHHNGXKFEZaAjWIixYAgBqy+uqrmy233FKbbrqpBgwYoD59+miVVVZJUpHjaQ1x08V43n38emUtdLy5ryxviMVBhvgJZYzyB6BzqLxvxB/Hr1VmMhhjkkBk5de2/Ti+n8T3ofjPqCzF8n1fs2bN0owZM/T444/Hb5xXgBrAhQoAQA3YZ599zP7776+f//znamxsVKlUavUUEAA6EsuyVC6XNWXKFN1www264oorOLcAVYwLFACAKrThhhuarbfeWltssYW23XZbrbbaasnIN8/zZNs22QMAOqxSqaRcLiepZRLFBx98oJdeekkTJ07U5MmT9frrr3OOAaoIFyQAAFVigw02ML/4xS+0ww47aO2111bPnj1bdVivLEkgYwFAR2ZZVtIo1rbt5H43b948ffzxx3rxxRd166236o477uA8A1QBLkQAAFK0xhprmEGDBmm//fbT1ltvrXw+n3wuHuUW90yobKYW908AgI6qsmlk3M8hnkARf+7NN9/UjTfeqH//+9+aPn06ZxsgJVx8AAC0swEDBpiBAwdq++231wYbbKA111xTlmWpWCzKcZxkDKTneZKUTGVwXbdVMIFSCAAdVdxctrIhraRFjrUMgkDvvfeennrqKd19993697//zRkHaGdcdAAAtJODDz7YHHzwwdp0002VyWSUyWRULpflum6rsoY4M6GpqUnZbLbViEff95OO65RC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XL+Gtl9TDZN1LMtSqVRKgi9z585V165d9cUXX+i3v/2t7r77bs5RQAUuCABAh7HBBhuY4447Tvvtt5/q6+vluq7CMFQQBEmQIAxD+b6vXC7X6vf6vp9kKSzqSSKAjqVyMkJlcDEIAgVB0OoeEd83fN9PgghNTU36/PPPNWvWLM2YMUOzZs3SBx98oM8++0wLFixQly5dVCqVNGfOHE2fPr0m9tx9+vQxPXr0UD6fb5XB4XmeunTpop49e2qVVVbRcsstpzXXXFNdu3ZVjx491KVLlyRIGwc0jDHKZDJJL4Y4gyHu2VBZivJdMjXai2VZampqUn19vXzfT34uNDc36+6779b+++9fE/9PgfbCBQEAqHkbb7yx2X///bXPPvuoT58+kpQ8KYzTbys3hvFM82w2m9Q/Vz51q0zfBdBxxdd6XKZQLBb11Vdfad68eZo1a5aam5v12Wef6b333tO7776r999/X5999pmampoURZFmzZrFXlotAQnbtpXJZNTY2KiGhgatuuqqWmGFFbTyyiurR48eamhoULdu3fSjH/1I3bt3149+9KNWgYVqG/Mb/1wol8vKZDJJtobv+5o7d65+9rOf6dVXX+X/P/A/XAwAgJrVu3dvc+yxx2rffffVSiutlDwZi7uZp51KC+D7q0ynb5tZEPcHiK/xuMY//vo4lT7uFeA4TqueCnHQsampSbNmzdK0adM0depUvf7665oxY0acicANZBno1auXyWQyWnvttbXccsupX79+2njjjdW/f3/17NlTtm0n/Q3iLLL4/3OxWJQk5XK55HPGmOT7obIJb2UD3sp+EJIWKmX5PoYNG6bTTjuN7xHgf7gYAAA1af/99zcnnnii1l13XdXX17dqNhY/gayWJ18Avp948kCcbdTU1CTXdZPSpniaQfz5+GPHcRSGYfJ6qVTSvHnzNH/+fL333nt6++23dccdd+iTTz7RlClT2A9XifXWW89svfXW2mijjbThhhuqd+/eWnHFFZNAUVyeEn+8qH4OccCh8nvBtm2FYahyuSzXdZM+Ej/EM888oy233JLvHeB/uBgAADVln332MYcccoi23XZbNTQ0JK9Xlj0EQcBEB6ADiLMLfN9XPp9PXp8/f77y+XxyzbfNaCgWi2pqatKMGTP0+uuva9q0aXrjjTf09ttv67XXXmP/WyPWWGMN07t3b220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HN17773ac8892bcCQJXiUQ4AoKY9+OCD1gknnKAZM2bIdV3l83kyFYAOwPd95XI5ZTIZ7bDDDrrnnnvMhhtuSLQQAKoQkV8AQIew6667mjFjxmj55ZeXJBWLRWWz2ZRXBeD7iqJIjuMoCIKkzOntt9/WcccdpwcffJA9LABUER7pAAA6hHvuucc64ogj9Pbbb0sSQQWgAyiVSkkzR9d1tc4662jkyJHaa6+9yFwAgCpCtBcA0KHsvffeZtiwYerbt2/aSwHwA8TTXTzPkyTNnTtXXbt2VRiGmjdvns4880w9+uijmjp1KvtZAEgZN2IAQIczePBg88ADD9BrAahhQRDI8zz5vi/btuU4jsrlsiQpk8lIkoYNG6ZTTz2V/SwApIwdFwCgw3n44YetPffcUx999JGiKFKxWEyefsbvAVQ313VljJHrurJtW8YYeZ4nz/NkjJExRqeccoruuusus/nmm1MaAQApIsILAOiw9thjDzNy5EittNJKkpQ0gJNaarfjp54Aao9lWWpublZdXZ1eeeUVnXjiiTR1BICUkLEAAOiw7rjjDuv3v/+93n///SSoMG/ePElK6rYB1K5cLqe5c+eqf//+uvPOO3XccceRuQAAKSCqCwDo8HbffXdz8cUXq2/fviqVSvI8L0mtBlCbisWi8vm8JKlcLsvzPBUKBd1www066qij2OMCQDsiYwEA0OFNmDDBOv744/XRRx8pm83KGKMwDNNeFoAfoHKkrOd5sixLdXV12mOPPfTwww+bgQMHEjkEgHZCNBcA0Glst9125rrrrtOqq65KtgJQ4yyrZRsbBIGklmaPlaZPn64TTzxR99xzD/tdAFjGyFgAAHQaDz30kHXSSSdp5syZTIYAalyhUJAxptVYWWOMyuWyjDHq16+fLr/8cp155plEEQFgGSOCCwDodAYPHmzuvPNONTQ0pL0UAN+TZVkKgkC2bcu2bYVhqCiKWjVmLZfLsm1bd911l84++2xNnTqVvS8ALAPcXAEAndJWW21lxo4dqxVWWEGZTEa2batUKiV120EQJKMpAdSmuFxCkh555BGde+65+u9//8v+FwCWMm6sAIBOa9CgQeb666/XaqutJmNM8gRUEkEFoMYFQSDXdZOJEbZt65133tGNN96os846iz0wACxF3FQBAJ3a1ltvba699lqtscYakqSmpibV19fL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t2/SxDGeeS+1HDJc16V5I9CBhWEo3/dl27ay2aykr+8DlSMrp0+frquuukoXXnghNwQAVYsbFAAAKfjJT35ihg8frv79+6uxsTFp1hiXRtBjAejYjDHJyNlisah8Pi9JKhQKyufzSYlUfE946qmndO211+rqq69m/w6g6nBjAgAgJWuttZYZPXq0ttxySzmOkxwyKtOjPc9TFEWKoijJYmAUJdDxRVHUajJMfB944oknNHToUN1///3cBABUDW5IAACkaODAgeZvf/ubfvazn8l1Xfm+L9d1k6eZbfm+L0k0dwQ6OMuyZIxJ7gXlcjnpw/LBBx9o/PjxGjdunJ588kn28wBSx40IAICUrbnmmuaCCy7Qr371K1mWldRZG2NULpclKXlyGZdLSCKwAHRwcXZSnM1ULpeTfgxhGOqtt97S2LFjddNNN2nGjBns6wGkhhsQAABVoFevXubSSy/VzjvvnDRxrBRFkcIwlOd5kr4ukwDQMcUBxDAMW/VjMMYkpVFxVtPLL7+s888/X7fccgt7ewCp4OYDAEAVuf32282uu+6alEXEqc/S108v42ZuiyqVANAxlEol5XI5SS3TImzbXuiaL5fLiqJIuVxOxWJR48eP15gxY/TQQw+xxwfQrrjpAABQRXr16mXOPvts7bfffqqvr5fU0iU+HklXmblAKQTQcUVRJEkLNXBsbm5WNpuV53mtxlLG/Vnee+89PfLII7rgggs0depU9voA2gU3GwAAqtAtt9xidt9996SeulQqJb8uFovKZDJMhgA6sDgzKe674jiOHMdJggmV94RSqSTP81plNMyePVuXXXaZLrjgAm4UAJY5bjQAAFSpq666yuy2225accUVk6eRlmUl3eHJWAA6rri3QpyZEASBstlsq0kRvu8nvVZ835dt23IcJ2kAO2/ePL3yyiu66aabdMUVV7DvB7DMcIMBAKCKXX755ebwww9XJpNJDguxONgQhqHCMEyeXkpKnnAC6JziIGRcNvXwww/r0ksv1Z133sn+H8BSx40FAIAqd+WVV5oDDzxQmUxGjuO0yl6oFD/VdF1XjuOQ0QB0YnHz1yAIFASBcrmcFixYoJtvvllXXXWVpkyZwjkAwFLDDQUAgBowdOhQ8/vf/17LLbecpJZDQ/ze87wkHTqKoiRVmowFoPOqDDzGjSAlqampSfPmzdP111+v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qvfyyy+btddeW5ZlJd3WCSwAqFbxOMq2GQvx56Iokm3bKpVKsm1bnucl4yvvuusuDR8+XE888QRnNdQMSiEAAEDV+9Of/qT58+crk8koCAJFUZT2kgDgG8UBhDh7obLPQhxsiIMK8df7vq/ddttNY8aMoe8CagqBBQAAUPUeeeQR68wzz9TcuXPlOI4sy0q6qse/LpfLrZ4SAkBa4v4KjuMkr9m23Sp7wRgj13Vb9WOIP1599dU1YcIEHXHEEQQXUBMILAAAgJpwxRVXWJdffrnCMEye/uXzefm+L9/3lc1mFYZh2ssEgB8sDqAOHTpUl112GcEFVD0CCwAAoGZceeWVuuOOO2TbdlIO4Xle8uvKJ4AAUKsWLFgg13XV0NCgQw45RFOmTOGmhqpGYAEAANSMd9991xoxYoSmTp0q13VVLBYlSdlsVoVCQbZtKwgCSiEA1LSGhgbNnz9f2WxWDQ0N2mijjfT444+bHXbYgQADqhKBBQAAUFOeeuop64wzztAHH3wgz/PU3NwsScrlcrJtm3IIAB1CLpeT1DJi13VdbbLJJho5cqR++9vfElxA1SGwAAAAas6dd95pXXbZZZKkurq6Vp/LZrMqlUppLAsAloowDOV5nubMmaNMJqMoilRXV6cf/ehHGjVqlI4//niCC6gq5AkCAICadcstt5i99947GdPmeZ5s21a5XE5GuAFArYmn3uRyuWREpeM4iqIoKfkaMmSIxowZo3fffZczHVLHNyEAAKhZG220kRk3bpz69esnqeUpXxRF8jyPBo4Aapbv+3JdNxmnGwSBXNeV1HKfC8NQmUxGEyZM0Omnn67XX3+dcx1SxTcgAACoaYMHDza33367MpmMMplMsvmWlDzps207GVEZz5In8ACgVhljknKJyZMn689//rOee+45znZIDT0WAABATXv44Yetf/7zn8rn83JdV6VSSeVyWVJLOrFt263eA0BH4HmefN/X1ltvrdGjR2vPPfckWorU8NMVAAB0CPfdd5/ZaaedkqwEqSVjQVLysTEmyVQgyACgVlX2YIjff/rppzr33HN16aWXcnNDu+ObDgAAdAj9+/c348aN09prr50EEOK3OFvBsixKIADUvMp7WRAEsixLruvqq6++0tChQzV8+HDOeWhXlEIAAIAO4ZVXXrHOPfdcffrppyoUCkkvhbifQvwWBxgA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tlfWEwMAFuY4jgqFgurr6/XVV1+pa9euOvfcc7X//vsTXKhRBBYAAAC+h0ceecR6/PHHVS6XZdu2LMuS4zhqampKe2kAUNXK5bLy+byamprUpUsXWZalxsZG/d///Z/22GMPggs1iMACAADA93TLLbeoublZQRAkI9XK5XLKqwKA6pbJZCS1TI6wbVvFYlGFQkFrr722zjzzTK277roEF2oMeXoAAAA/wAsvvGA22GADua6blEJIX9cWAwBasyxLxWJRuVxOkrRgwQI1NDRIarl3vvXWW9pnn330yiuvcF6tEWQsAAAA/ABXXnmlPM9TqVRKggoAgMUrlUrK5XIqFouSpIaGhmQsZbFYVL9+/TRs2DD16tWLCG2NIAIEAADwA7322mtmjTXWUDabValUStJ8AQALsyxLQRAkjW4dx5ExRr7vK5PJqFQqyRijsWPH6ne/+x1n1hpAxgIAAMAPdOWVVyqTyahYLCqbzSZP3gAAi+b7vhzHkWVZ8n0/GdkrSdlsVrlcTgcddJDOP/98shZqAIEFAACAH+jxxx/Xq6++qmw2qyAIKIkAgG9gjFEul5MxRpZlyXVdGWOSzIUwDGWMkTHm/9m79zitynr//+9rne7DDIMISh44iTIICqKCB1IRUVMREUkBERHFAx7BraZpXzuYmslOy0Nqav62btuVtXc72x3sfK5dVlaaeSjdWZmZwMzc9zpdvz+mtZxRVA4zs2bmfj0fDx7MLOa+5xLG+17rvT7X56OLL75Ya9asIVzo5wgWAAAAttLPfvYz8+Mf/zi/40bjRgDYclnlgu/7iqJIl156qY488kheWPsxggUAAIAe8MUvflEbNmwgWACArWSMUUdHhySpUqlo++231+233663v/3tvLj2UwQLAAAAPeDzn/+8+fGPfyyJUZMAsDWSJFG1WlV7e7skKU1TjR07VjfeeKP23HNPXmD7IYIFAACAHnL//ferXq/Ldd2ilwIAA1YURZKkarWqMAzluq7a29s1Y8YMvetd7yp4ddgYRncAAAD0oP/93/+1e++9N1ULALCFskkRvu9Lktra2tTU1KT29naVy2XdeuutOv/887mW7UeoWAAAAOhBDz30kGq1WtHLAIABzff9fCtEU1OTarWaqtWqJGnVqlW67LLLSG/7EYIFAACAHvTFL35RL7/8ctHLAIABK01TSVIQBKrX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jqMzzzxTU6dObaiqBYIFAACAgr3wwguSlJfSZuMn6bsAAP1P19fqSqUia608z5PjOLLWapdddtH1119f9DL7FMECAABAway1+Z5dAMDAliSJDj74YC1atKhhXtgJFgAAAArWNVigSgEABjbP81SpVHTGGWdo7NixDREuECwAAAAUjIoFABhcOjo6NHPmTB199NFFL6VPECwAAAAULE1TpWkqiYoFABjowjBUuVxWuVzW8uXLG6JqgWABAACgYFQsAMDg4bput/GTa9asKXpJvY5gAQAAoGD0WACAwcN1XUVRJMfpvNxetmyZZs6cOajTY4IFAACAglGxAACDSzaSMo5jNTU16dxzzy16Sb2KYAEAAKBgSZLkM9GttVQtAMAg4XmePM/T4YcfriOOOGLQJsgECwAAAAAA9BBrrYIgUJIkStNUSZJoxIgROvvss4teWq8hWAAAAOhn2BYBAANXFia4rivHceS6rtI01dFHH60zzzxzUL7AEywAAAAAANBDjDGK41hS51Y3SYqiSL7v67zzzityab2GYAEAAKBgxpj8FwBgYHMcR0EQSJJqtZqSJFGpVFKaptp99931L//yL4OuaoFgAQAAoB9hQgQADA5RFKmpqUlpmkrqbORojNGSJUsKXlnPI1gAAAAAAKAHJUmSV6G5rqt6va40TeW6riZNmqQrr7xyUCXIBAsAAAAAAPSQNE3zMZPt7e1yHEelUklRFEmSSqWSLrjgAk2aNGnQhAsECwAAAAXLymOzclnHcfItEWyLAICBxRiTv35XKpX84yAI8tf0oUOH6oorrih4pT2HYAEAAKAfcF2XBo4A0CCMMTr00EM1Y8aMQZEeEywAAAAUzHXd/OOulQsAgMEnjmP5vq8dd9xRp556atHL6REECwAAAAUrl8uSxLYHAGgASZJIktrb27V06VJNmzZtwL/4EywAAAAUbPjw4UrTNK9UYDsEAAxepVJJ1lp5nqeWlhZdcsklRS9pqxEsAAAAFGz06NFUKwBAA8mChTRNdeKJJ+qEE04Y0G8CBAsAAAAFGzt2rBzHkeNwagYAg10URXIcR2maKkkSua474Hst8O4FAABQsO22207GGLmuy4hJABjksoa9nufJ8zyFYagDDzxwQFctECwAAAAUbMKECQrDUJIUhmG3Hgv0WwCAwSWKoryBYxzHcl1Xw4cP1znnnFPw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AADA4DBx4kR74YUXasiQISqXy2pvb5cxRmma5uECAACDgbVWaZrmQfrMmTO36HkIFgAAALqYPn26Zs+enW95qFar6ujoUKVSked5qtfrcl236GUCALBFoiiS9GqokI1LLpVK2nfffbfoOdkgCAAA8E9jx461//mf/6k999yz6KUAAFCIWbNm6dvf/vZmZQVULAAAAPzT6tWrNWHCBJozAgAa1pQpUzb7MQQLAAAAkubOnWsvuOACtjkAABrawQcfvNmPIVgAAABQ53hJqXPsVrb/FACARkPFAgAAwBa47LLL7Nvf/vZ86kPWHRsAgEYzYsQITZs2bbPeCAkWAABAQ9tnn33sRRddpDRNVSqVtGHDBgVBUPSyAAAoRBAEam1t3azHECwAAICGdtNNN2nkyJEKgkBJksj3/aKXBABAYUql0mZvhyBYAAAADevd73633X///WWMURiGcl1XpVJJYRgWvTQAAAoRBIHGjRu3WY/xemktAAAA/dp+++1nV6xYIUlKkkRBECiOY6VpStUCAKBhWWs3O1igYgEAADSkVatWacyYMXJdV47jyFor13XzgAEAgEZkjNG4ceO05557bnIDR4IFAADQcN7znvfYhQsXynVdWWtljFEcxzLGSJIch1MkAEBjStNU22+/vXbbbbdNfgzvmgAAoKEcccQRdtWqVapWq4qiKB8taYxRmqZKkkSu6xa8SgAAipGF7FOnTt3kxxAsAACAhnLeeedp5MiRSpJExph8G4TnebLWql6vF71EAAAKkwULM2fO3OTHECwAAICGcf3119vDDjtMaZrKcRx5Xmcf61qtJklyXZfGjQCAhpamqSRp2rRpm/wYggUAANAQ5s2bZ1etWqVyuZz3UOi6DUJSPhEiOw4AQKNJkkSStO222+qQQw7ZpDdEggUAADDoTZo0yX7wgx9Uc3OzpM6TJmttPv2hXC532wbBdggAQKPKtghaa7XLLrts2mN6eU0AAACFe9/73pefHGXVCcaYvK9CVqGQBQylUqmwtQIAULQ0TWWM0cEHH7xJX0+wAAAABrXLL7/czp49W5VKRbVaTcYYpj4AAPAGXNfN3ydHjhy5SY8hWAAAAIPWSSedZC+88EINGzZMkuT7ft6oEQAAbJy1Vmmaascdd9SYMWPess8CwQIAABiUJk+ebN/97ndr5MiRCsNQ1lq5rpufLAEAgNfLxjHHcawRI0Zo2223fcvHECwAAIBB6ZJLLtGee+6p9vZ2BUGQN2SsVCpMfQAA4A1k4bvjOBoyZIh22mmnt3wMwQIAABh0rr/+ejt//nxJndsfJMnzvAJXBADAwJCF747jKAgCjR8//i0fwzssAAAYVBYvXmwvvvjifPqD7/uq1+v5pIcwDPOwAQAAdJe9f1pr5fu+dt1117d8DBULAABg0JgxY4Z973vf262HQhYqpGmqNE0VBEF+0gQAALrLKvyyKUqbshWCd1UAADBofP/737cHHHCAoihi6wMAAJuoa+8hY0wewHd0dOiZZ57R5MmT3zQ7oGIBAAAMCnfccYc94IADVKvVCBUAANhCxhhFUSRJcl1XO+ywg8aPH/+mXY8JFgAAwIB31VVX2dNOO02SVC6XGScJAMBWyN5HXdfVsGHDNHr06Df9eoIFAAAwoC1cuNBeeeWVqtfriuNYUueJEAAA2HzW2m59FtI01dixY9/0MQQLAABgwJo1a5a99dZblaapmpqaJElJkhS8KgAABjbXdRXHsRzHUZIk2nvvvd/06wkWAADAgDRz5kx7ww03aLvttlO5XFYYhvI8T2EYFr00AAAGLGOMrLV5FaDv+5o5c+abPoZgAQAADEiXXHKJ9t13X23YsEFS592VWq2mSqVC1QIAAFvIWqs0TeX7fn5st91205gxY96wgSPBAgAAGFB22WUXe++999qjjz5aklQqlSR13mEpl8uKoogeCwAAbKE0TWWtleu6CsNQaZqqXC7nWw43hmABAAAMKBdddJGWLVsmz/PyBlPW2rx0M/scAABsGmNM/st1XRljJElBEChNU7muq3Hjxr3h4wkWAADAgLF69Wp79tlns9UBAIBekm2FyD52nM7YYOTIkW/4GIIFAAAwIJxzzjn22muvlaR8DBYAAOhZWbWC1D1Y2HXXXd/wMQQLAACg3zvllFPs9ddfryAI5DgOkx8AAOhFWZiQSdNUY8eOfcOvJ+4HAAD92ty5c+0HP/hBlUqlvJkUAADofVnPojiONWLEiDf8OioWAABAv3X44Yfbm2++Wdtvv70cx5HjOEqShHABAIBelAUK1tr845aWljf8eoIFAADQLx122GH2Ix/5iMaOHasgCPJpD3Ec502lAABA78kmLgVBoObmZk2aNGmjY5cIFgAAQL+z22672Q9+8INqbW3NT2riOFYYhiqVSorjuOglAgAwaGUNHI0xchxHxhhVKhVts802G/16ggUAANCvTJ8+3f7bv/2bpk+fLsdx8hJM13UVBIGstfJ9v+BVAgAwOGX9jNI0lTFGaZoqiiKNGjVKY8aM2ehjaN4IAAD6jQkTJtjbbrtNEydOLHopAAA0JGttXi2YVStkn79RnwWCBQAA0C+MHz/erl27Vvvss09epQAAAPpe16aN0qu9FoYPH77RrydYAAAAhZs0aZK94447tN9++0mSoihiuwMAAAVwHCdvkpyFC8YYJUmit73tbRt/TJ+tDgAAYCPGjx9v77zzTs2cOVOu6+bdpwEAQDG6BgpdP36jHgsECwAAoDDjx4+3H//4x7XvvvsqSRKFYZh3ogYAAMXI+it05Xmexo8fv9GvJ1gAAACF2GuvvexDDz2kww47TGEYynVdlUolrVu3ruilAQDQ8LJgIdsWIYmtEAAAoP/Ybbfd7E033aRJkyZJkqrVqqy16ujoUEtLi+r1esErBACgcXWtHkySJG/m2NTUpH322ed1HZYJFgAAQJ864ogj7J133qmDDjoo76mQncCUy2V6LAAAUKBsG0QWJnR9Ty6VSqpUKq97DFMhAABAnznwwAPtRz7yEe2+++6MlAQAYADabrvtXneMigUAANAnjjrqKHvnnXdq4sSJRS8FAABsoQkTJrzuGMECAADodSeffLK99dZbNX78eBljVKvVil4SAADYApMnT37dMbZCAACAXrV48WL70Y9+VC0tLXln6ayXAgAAGFioWAAAAH3qoosusrfeeqtaWlrkOI5835cktbe3F7wyAACwJUaOHPm6YwQLAACgV1xzzTX2xhtvVEtLSz75IY5jhWGoarVa9PIAAMAWqFarGjduXLeyQ7ZCAACAHjVu3Dh70UUX6YILLlAURXJdN/8z13Xluq6SJJHjcH8DAICBxnEceV73KIFgAQAA9JjW1lZ73XXXaf78+bLW5icerut266lAqAAAwMAUBIHK5XK3YwQLAACgR+y55572vvvu01577aV169ZpyJAhRS8JAAD0MGOMtt12227HuF0AAAC22pw5c+x//dd/aa+99lKtVlNLS0vRSwIAAL3AdV2NHj262zGCBQAAsFXOO+88e++992qHHXYoeikAAKCXua6rMWPGdDvGVggAALDFrr/+envRRRfljZzq9frr9l0CAIDBw3Vdve1tb+t2jGABAABstqlTp9pVq1bpzDPPVJIkeXPGJEmUpqmkzj2YAABgcHEc53VbHgkWAADAZpkxY4a97rrrdOihhyqKIvm+r7/97W8aMWKEqtWq4jiW53ndpkAAAIDBwRjDuEkAALDlFi9ebG+55RYNGzZMaZrmYyNHjBihJEmoUgAAoAERLAAAgE3yrne9y1544YUaNmyY4jiW67oyxuSVCVnIkG2LAAAAg48xhq0QAABg84wZM8Z+5CMf0fz581Wr1STRPwEAgEb22mCBcZMAAOAN7b///vazn/2s5s+fn098CMOQYAEAgAa23Xbbafz48Xl5IsECAADYqAsvvNA++OCDmjJliqy1KpVKeuWVVxQEQb7tAQAANJY0TbXtttuqubk5P8ZWCAAA8Dr33XefXbRokeI4lu/7kjpPJIYOHSprLRULAAA0KGutWlpatM022+THCBYAAEBu+vTp9p577tGoUaPkeV4eKsRxLGutHMeRtbbbRAgAANA4XNeVJA0bNiw/xhkBAACQJK1evdref//9mjhxolpaWmSMUa1WU5Ik+bzqer0ux3EUx3HBqwUAAEVJ01RDhgzJP6diAQAA6LOf/axdsGBBPkYya9BYLpeVJIk6OjpUqVQkSe3t7apWq4yUBACgQXXdKilRsQAAQEM78cQT7Te+8Q07b968/FgcxwqCQJ7n5dsfyuWyrLWy1qpSqRAqAAAwyGXv+9mvrsdLpZKCIMiPUbEAAECDuu222+whhxyi3XffXVLnNodSqZR/3PWEAQAAoKuuPRYIFgAAaDB77LGHvfHGG7X//vurpaUlP961GSOhAgAAeCPGGO20007552yFAACggaxcudJ+6Utf0syZM9XS0qIwDFWr1SRJvu/nnzNOEgAAbEx2jjBq1Kj8GBULAAA0gDFjxtjrr79exx57rNI0VVNTk6TOyoQkSRTHsYwxeSOmNE0JFwAAwBvacccd848JFgAAGOROOukke8MNN2jUqFEKwzAPE6IoUhAEchxHURTJGJPPpqY5IwAAeCPGGI0YMSL/nK0QAAAMUrvssou955577K233qpRo0bJWqsgCNTe3i7XdVUul+U4jowxCoJAvu8rTVPFcUywAAAANio7R2hpaVFra6uVqFgAAGBQmj9/vr3llls0fPhw+b6vOI7leZ7q9bqq1apqtVre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ut6cfOWVV/Too49u9XMSLAD91OrVq+3atWvzz6Mo6taMMQgCRVEkz+N/YwAAAACbJruucF1XL7zwgn79619v9XM6b/0lAPrStGnT7Kc+9Sm7du1aRVGkMAxVq9Xy//njOFaapvI8j60QAAAAADZLkiSSOsdO/u53v9PTTz+91RcV3OoE+pElS5bYyy+/XJMmTVJHR4cqlYqkzgYr7e3t8jxPQRAoTVMlSZJPhgAAAACATdG1Cvp///d/e+Q5qVgA+on3vve99tZbb9Uee+wha60qlYqstero6JDjOHk/hTiO8+kPHR0dBa8aAAAAwECSjaWv1Wr6wQ9+0CPPSR01ULC99trLvu9979MxxxyjJEnysZFhGKpUKkmS6vW6fN+X4zhKkkTGmDxcoGIBAAAAwKay1ioMQ/3jH//QDjvs0COZAFshgAKdcMIJ9qabbtLQoUPzQCGOY1lr8y0Pxph8vKS1lkABAAAAwFYpl8v6r//6rx57PrZCAAW5+uqr7f33369hw4apWq3mx13XleM4MsYQHgAAAADoUcYY1et1ffe73+2x56RiAehje++9t73mmmv09re/XUEQdJvsEMexjDFyXVfW2nxrBAAAAAD0BGut/vrXv+rb3/52jz0nwQLQh4466ih75513aqeddlKtVstDhSxE6NpjQRKhAgAAAIAelaapfvWrX+kPf/hDj/Vc5KoF6COrV6+2Dz74oHbYYQelaZqPecnmyLquK9/35bqujDEyxsjzyP4AAAAA9KyerFaQCBaAXjd58mT74IMP2htuuCHvn5CmqVzXVa1Wy78um/RgjFGapvRXAAAAANDjarWafvzjH/foc3I7FOhF++67r/3kJz+pSZMmKY5jNTU1SZI8z1McxyqXy91ChK5bI6y1eeUCAAAAAPSEZ599Vk899VSPPicVC0AvOffcc+3nP/95TZgwQdKrYYEk1et1eZ6nNE27TYDIwoSukyEAAAAAoKc88cQT+uMf/9ijFxpULAC94GMf+5hdvny5mpqa8sAg65dgrVUQBHmIsLFqBQAAAADYEkmSdOvVliSJXNdVW1ubmpqa9PDDD/f496RiAehBe+65p/3qV79qV61apWq1qjiOi14SAAAAgAbSdXS99OoNzKamJr300kv66U9/2uPfk2AB6CGHH364/dSnPqU5c+bIGKO2tjamOgAAAADoU8aYPFTIqqSzG54//OEP9ctf/rLH91sTLAA94AMf+ID93Oc+p3HjxilNU9VqNTU3N+f/QwMAAABAX8i2VruuK0n59utarab//M//7JXvSbAAbIWxY8fa2267za5Zs0ZNTU35lIdyuaz169fn/zMDAAAAQF+w1ubXIVnI4Pu+nn/+eX33u9/tle9JsABsoT322MPedtttOuOMM/JjHR0d+bSHIUOGqK2trcAVAgAAAGhEG2sM/8QTT+i3v/1tr4ydYwM4sAXmzp1r77vvPg0ZMkTGGFUqFSVJokqlImutHMdRvV7Pp0IAAAAAQF/IQoU0TeW6ruI4luu6+vGPf9xr35OKBWAznXXWWfbWW29VS0uLPM/L9yy5rqswDJUkiay1KpVKTIUAAAAA0OestUrTVFJnwLBhwwY99thjvfb9qFgANtG4cePspZdeqlNPPVW+7+fzYLuWGfm+n399171NAAAAANBbulZJO46TVytk1dR//etf9ctf/rLXvj/BArCJPvShD2nhwoUKwzAfI1mr1VQqlQpeGQAAAAB0StM0HznpeZ4cx9GPfvQj/f73v++V/goSWyGAt3TMMcfYn/zkJ3bhwoVqb29XEASSpHq9rnK5XPDqAAAAAOBVjuPIWivP85QkidI01UMPPdSr37PXEgtgMFixYoV997vfrXHjxuVbHuI4VhRFqlQqVCwAAAAAKNxrt0KEYaggCFSv1/X8889r11137dVrf7ZCAG/gjDPOsDfddJOq1apqtZrK5bLSNJXnefI8T+3t7apWq0x9AAAAANBvWGvzm6KO4+iRRx7p9e/JVgjgNcaMGWNvvvlme9ttt6larSqKonzLQ61WUxiGkqRqtVrkMgEAAADgdeI4zpvNh2GoL33pS73+PalYALoYP368veuuuzRr1iyFYaj169erublZktTW1qampiZJ0vr161WtVvMKBgAAAADoD7LJdK7r6oknntAvfvGLXv+eVCwA/3TooYfa//iP/9CBBx6oJEkUBIGGDBkiY4xqtZqampqUJInWr1+vIUOGdBs1CQAAAAD9geM4iuNYkvTzn/9czzzzTK9ftBAsAJJOPvlke+ONN2rvvfeW67pKkkRSZxmRtValUimfAdvc3Cxrray1eRoIAAAAAEUxxuS/6vW6PM9TrVbTN7/5zT75/gQLaHjnnnuu/fjHP65p06bpr3/9q1zX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umhubs4bMkqS67pqb29Xc3OzpM6pEJJ044036tprryVUGAAG5e36c845xy5dulS+76tWqxW9HAAAAADAPyVJIt/3tX79egVBoCRJ8kryWq2mUqmk//7v/9bdd99d8EqxqQZdsLDffvvZc845R01NTUqSROVyueglAQAAAAD+yXEcRVGkIUOGSOrcDlEul7Vu3TqVy2V97Wtf03XXXadnn32WaoUBYlD9Q40ePdr+27/9mw488EDVajU1NTXl+3UAAAAAAP1DmqZyXVdxHMvzPEVRJNd19dhjj+n000/XT3/6Uy7iBpBBVbHwrne9SzNnzpTjOGpqalIYhkx9AAAAAIB+JE1TOY6jjo4OOY4ja61839cf//hHXXnllYQKA9CgCRaWLl1qTzzxxG4dRtM0lecN2v6UAAAAADDgZM0aK5WKHMdRW1ub2tra9P73v19f+MIXCBUGoEHxjzZ69Gj7yCOPaOedd857Krz88ssaNmyYoigiXAAAAACAfiKKIgVBoFdeeUVDhw5VHMc688wzdc899wyK69NGNCj+4R555BG73377qampqdvYklqtpnK5LGttwSsEAAAAgMaQ9U+QJGutwjBUqVSSJIVhKMdx5HmerLVat26d/v3f/13nnHPOoLg2bVQDfivEddddZ2fMmKGmpiZJnaNLpM4f4GxkCQAAAACgb73yyiuKokilUklhGKpWqykIgnzrujFGX/nKVwgVBoEB/Q+4cOFC+7GPfUwjR46U1BkqGGPyQCGrXqBiAQAAAAD6hjFGcRxLUl65kIUJ2RSIJEn0wx/+UG9/+9sH9DUpOg3YW/pjxoyx7373uzVixAjFcax6vd4tVEiShIoFAAAAAChAR0eHPM+TMUZtbW2SOqvKs8Dh5z//uZYuXVrkEtGDBuyV9wc/+EFNnTo1n/zg+34eJIRhKGttno4BAAAAAPpGmqZqampSmqaK41jNzc2SOivKy+WyfvnLX+r888/Xs88+S7XCIDEgg4XLLrvMLliwIJ93Kimff5okiVzXzSdBhGFY5FIBAAAAoKGkaSrHcdTe3t6tojwIAj355JO66KKL9MMf/pBQYRAZcHMYDz30UHvqqad2q0aI47hbA5CuWyDorwAAAAAAfSe7HssqFer1uoIg0O9+9ztdf/31+sY3vkGoMMgMuIqFyy+/XLvvvrt831eSJPmWB9d18x/g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AAC0MkEQKJvNylqbHot47LHHNH78ePbfANocKhYq1AMPPGBOPPFEHXPMMXrrrbcURZHiOFahUJAxRsYYBUGQvm6MURRFkj5vFOT7vozhbxcAAEBLy2az6V6tWCzqk08+0QUXXFDuywKADYK7zlbitttus/vss4+KxaKMMWkCnvzBSs7wRVGkKIrSSRJ1dXWqrq4u89UDAAC0P0nVgiTdfvvtmj59OntvAG0SFQutxPTp081hhx2mV199NU3Afd9XNptVJpOR67qSJNd15bqu6urqFASBampqynzlAAAA7U8cx8pms+mTPvPmzSv3JQHABkNq2sr06tXLHnvssZozZ4423nhjWWslNSbinuelzYESDQ0Nyufz5bhUAACAdstaK8dxFMexbr75Zs2aNYt9N4A2iwWuldp3333t3LlzNXz4cHXo0EENDQ2qqqqS1Hj8wfM85XI5+b6vTCZT5qsFAABoX5L+V5988ol22203LVy4kH03gDaLBa4VGzx4sJ0+fbpmzpypfv36SZLq6+vTngq+78t13dWqGAAAALBhJY22//jHP+rQQw9lzw2gTeOOsxVbuHChOfPMM83MmTP197//XVLjnORkgkQURWnvBQAAALSsDz/8UH/84x/LfRkAsMERLLQBCxcuNJMmTTLHHnusPvroI8VxrDAMVVVVlY6gBAAAQMuJokgLFy7UvffeS7UCgDaPha6NGTRokD366KM1ffp0de7cOa1YiONY1tp0NKWkdFxlJpORMSb9vNKjE/RoAAAAWJ0xRsViUa7ryvM8xXGsOI7leV6659ptt9103333sd8G0OZRsdDGvPjii2bu3LnmmGOO0QsvvKAgCFQsFuU4jowxCsNQUmOo0NDQoGw2mx6bCMMwHYmUTJtIZi8DAADgc77vK5fLyfM8+b4va608z1MYhjLG6NZbb9Wrr75a7ssEgBZBgtrGnXvuuXbatGnq0aOHcrlcGhwkgUGhUFA+n0+DBKkxdCitbij9GAAAAD4PFiSpWCymr4dhqPr6es2cOVP/+Mc/2GsDaBdY7NqBUaNG2aOOOkqTJ0/WJptskoYFQRCkAUMcxzLGNDkSkRyLSN4HAACARsaY9ImYpGF28u99992n3XbbjQ0UgHaDoxDtwBNPPGHmzJlj5s6dqxdffFG+76ehQhAETY5CJNUJjuPIdV1CBQAAgLVoaGhI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jKMokqQmFQvJx6TPx755npcGE8ViMT1yAQDrW9JjobRyIQk677rrLu21117sowHgv1gQAQAtpm/fvnb77bfXLrvsotGjR6tr167aaKONVgsRpMZNfV1dnfL5vFzXTZuoMXUCQEtJqqakxuAz6bPw5ptvqmfPnuyjAeC/WBABAGUzYcIEu88++2jy5Mnq1q2bstlsemQiOfIgfX5MInk96dBOsABgQ0n6upQexyoWi8rlcqqvr9eECRP09NNPs5cGABEsAAAqxNSpU+24ceO0ww47qHfv3tpiiy3k+77y+bykxqMPxhgmTgBoEWsKFoIgUCaTURzH+slPfqJLL72UvTQAiGABAFCBxowZY0eNGqVdd91V/fr109Zbby2pMVyQGkuSm/dhAID1rbSBbNJ8Nnnffffdpz333JO9NACIYAEA0ApMnz7dHnHEERo3bpzy+byiKFI2m6VqAcAGkzSKDcMwrVxIwswgCLRq1SqNGDFCb7zxBvtpAO0eCyEAoNXo3bu33XHHHTVu3DgNHDhQffr0UceOHdPjEUmTtaRsWVLa1T0ZG5d8XhzHq31u6efEcdxkNCYAlArDUPvss4/uuusuFgoA7R4LIQCg1Ro/frwdPny4dtttN+2www7q1KmTJKXj4TzPSz83CAIZY5q8r1QYhpKUNomM47hJ0AAAzZ144om68MIL2U8DaPdYCAEAbcIOO+xgJ06cmFYzdOrUSfl8vkk1gzEmDQsaGhrSxpClVQ1JlUJyrhoA1iSOY91888066KCD2E8DaPdYCAEAbc7QoUNtr169NGHCBPXv31+DBg1Sp06dFMex4jiW67pNmrElwULSmE3iKASAdYuiSC+++KKGDh3KQgGg3WMhBAC0eSNGjLB77LGHpkyZosGDByufzysIAkmS53lN+jEk/zbvywAApYwx+vjjjzV58mTNnz+fPTWAdo1FEADQrgwaNMjuueeemjhxovr06aPa2lrV1tYqm802OSoBAOtijFFdXZ1++MMf6ne/+x17agDtGosgAKDd2m677eygQYM0fvx47bTTTurZs6c23XTTdKQc4ywBrEscx/rjH/+oQw45hD01gHaNRRAAgP/q16+f3W233TRt2jSNGDFCNTU15b4kABUqmTyzaNEiDRgwgD01gHaNRRAAgLXYf//97ejRo7XjjjuqW7du6tSpUxo2JFMj4jiW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" style={{height:28,width:"auto",opacity:0.95}} alt="BehaviorPath"/>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:700,color:B.white,letterSpacing:0.3}}>BehaviorPath</span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {/* Auto-save flash */}
            <span style={{fontSize:10,color:B.mint,opacity:saveFlash?1:0,transition:"opacity 0.5s",fontWeight:600,letterSpacing:0.2,minWidth:46}}>✓ saved</span>
            {/* Backup / Restore */}
            <button onClick={exportDraft} title="Download backup (.json)" style={{background:"transparent",border:`1px solid ${B.mint}55`,borderRadius:6,color:B.mint,fontSize:10,padding:"3px 8px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",lineHeight:1}}>⬇ backup</button>
            <button onClick={importDraft} title="Restore from backup (.json)" style={{background:"transparent",border:`1px solid ${B.mint}55`,borderRadius:6,color:B.mint,fontSize:10,padding:"3px 8px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",lineHeight:1}}>⬆ restore</button>
            {/* Progress bar */}
            <div style={{width:72,height:4,background:B.teal,borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",background:B.peach,width:`${pct}%`,borderRadius:2,transition:"width 0.4s"}}/>
            </div>
            <span style={{fontSize:10.5,color:B.mint,fontWeight:700}}>{pct}%</span>
          </div>
        </div>

        {/* Stop nav strip */}
        <div style={{background:B.teal,display:"flex",alignItems:"center",overflowX:"auto",scrollbarWidth:"none",borderBottom:`2px solid ${B.forest}`,padding:"0 16px"}}>
          {STOPS.map((s,i) => {
            const active=i===si, done=i<si;
            return (
              <button key={s.id} onClick={()=>jump(i)} style={{padding:"9px 11px",display:"flex",alignItems:"center",gap:5,fontSize:10.5,fontWeight:active?700:400,color:active?B.peach:done?B.mint:B.sage+"77",borderBottom:`2px solid ${active?B.peach:"transparent"}`,whiteSpace:"nowrap",cursor:"pointer",background:"transparent",border:"none",fontFamily:"'DM Sans',sans-serif",transition:"all 0.13s"}}>
                <Icon ic={s.ic} size={12} color={active?B.peach:done?B.mint:B.sage+"99"}/>{s.label}
              </button>
            );
          })}
        </div>

        {/* Section label strip */}
        {sec && <div style={{background:B.mint+"66",borderBottom:`1px solid ${B.border}`,padding:"6px 24px",fontSize:11,color:B.teal,fontWeight:600,letterSpacing:0.3,fontFamily:"'DM Sans',sans-serif"}}>{sec}</div>}

        {/* Main content */}
        <div ref={scrollRef} style={{flex:1,overflowY:"auto"}}>
          <div style={{maxWidth:640,margin:"0 auto",padding:"36px 18px 70px"}}>
            <div style={{background:B.white,borderRadius:18,border:`1.5px solid ${B.border}`,padding:"34px 38px",boxShadow:"0 4px 28px rgba(0,59,1,0.07)",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(7px)",transition:"opacity 0.16s,transform 0.16s"}}>
              {screen()}
            </div>
            <div style={{textAlign:"center",marginTop:28,fontSize:10.5,color:B.muted,fontFamily:"'DM Sans',sans-serif",letterSpacing:0.3}}>
              BASIL Behavior Lab · basilbehaviorlab.com
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default BehaviorPath;
