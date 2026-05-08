import { Chapter, StorySetup } from "./schemas";

/**
 * Deterministic offline brain — ships canned chapters that follow the same
 * shape MiMo would emit in live mode. Used when there's no API key, when
 * MIMO_FORCE_MOCK=1, and as the fixture suite for end-to-end tests.
 *
 * The chapters loop through five "beats" (call to adventure → trial →
 * revelation → climax → coda) so a player always gets a satisfying arc
 * even without a live model.
 */

const BEATS: Array<Omit<Chapter, "index" | "title">> = [
  {
    text:
      "The lantern hissed as %PROTAGONIST% nudged the door. A single feather, longer than %PROTAGONIST%'s arm, lay on the threshold. It pulsed with a slow, pale-blue heartbeat. From the dark beyond came a sound that was not quite a voice — older, patient, the way old houses remember the people who built them. %PROTAGONIST% knelt. Up close the feather smelled of rain on copper and someone else's grief. The pulse quickened to match %PROTAGONIST%'s own. Whatever had left it had wanted to be found. Whatever had left it was still close enough to know %PROTAGONIST% was kneeling.",
    image_prompt:
      "A figure crouched in a stone doorway holding a long, faintly glowing feather. Wet cobblestones reflect lantern light; mist rolls in from the dark beyond. Low angle, dramatic chiaroscuro.",
    branches: ["Pick the feather up", "Step back and call out", "Set the lantern down and listen"],
    is_ending: false,
  },
  {
    text:
      "The corridor narrowed until it had to bend, and where it bent, the wall remembered being a tree. Bark grew under %PROTAGONIST%'s palm. The feather warmed in answer. Somewhere ahead, water moved that had no business moving — a low, considered drip, like a clock that had decided what hour it would be. %PROTAGONIST% counted seven drips and found, at the eighth, a chamber. In its centre stood a cage made of folded paper, each fold bearing a child's handwriting in a language %PROTAGONIST% had never been taught yet read effortlessly. Inside the cage, nothing — and yet the air there was warmer than anywhere else.",
    image_prompt:
      "A small chamber where the stone walls bleed into living tree bark. In the centre, a delicate origami cage taller than a person, glowing faintly from within. Soft, reverent light.",
    branches: ["Read the writing aloud", "Open the cage", "Leave a token and back away"],
    is_ending: false,
  },
  {
    text:
      "When %PROTAGONIST% spoke the words, the cage unfolded itself like a slow apology. Each fold became a name. Each name became a face %PROTAGONIST% had never seen and somehow had been waiting to forget. The last name was %PROTAGONIST%'s own. The faces turned, all together, the way starlings turn, and one of them — a child with the feather already braided into her hair — said: \"You are the one we sent to fetch us back.\" The lantern guttered. The corridor behind %PROTAGONIST% was no longer there. There was only the chamber, and the names, and a choice that had been waiting since before %PROTAGONIST% was born.",
    image_prompt:
      "A constellation of translucent child-faces hovering above an unfolded paper cage; one face, in the centre, wears a long luminous feather braided into her hair. Awe and quiet sorrow.",
    branches: ["Take the child's hand", "Refuse — turn and demand a way out", "Ask who sent you"],
    is_ending: false,
  },
  {
    text:
      "The child's hand was paper-light and absurdly warm. %PROTAGONIST% felt the chamber become a hallway again, but a different hallway — one that had always been there, behind the first, the way a second meaning sits behind a careful sentence. They walked. The names walked with them, faint as breath on glass. At the end of the hallway was a door %PROTAGONIST% had drawn as a child and forgotten. %PROTAGONIST% had drawn it because %PROTAGONIST% had needed it. It opened to a kitchen, late afternoon, somebody humming. The names sighed and slipped, one by one, into the warm light, becoming small again, becoming children again, until only %PROTAGONIST% and the feather-haired girl remained at the threshold.",
    image_prompt:
      "A childhood kitchen seen through an impossible doorway: golden afternoon light, a half-peeled apple on a wooden board, a hummed song almost visible in the air. A small figure stepping through.",
    branches: ["Go in", "Stay at the threshold", "Send the girl through alone"],
    is_ending: true,
  },
];

const TITLES = [
  "What Was Left at the Door",
  "The Chamber of Folded Names",
  "Starlings Turning Together",
  "The Door I Drew as a Child",
  "Coda — The Apple, Half-Peeled",
];

export function mockChapter(args: {
  setup: StorySetup;
  index: number;
}): Chapter {
  const beatIndex = Math.min(args.index - 1, BEATS.length - 1);
  const beat = BEATS[beatIndex];
  const title = TITLES[beatIndex] || `Chapter ${args.index}`;
  return {
    index: args.index,
    title,
    text: beat.text.replaceAll("%PROTAGONIST%", args.setup.protagonist),
    image_prompt: `${beat.image_prompt} Art style: ${args.setup.art_style}.`,
    branches: [...beat.branches],
    is_ending: beat.is_ending,
  };
}
