import { PoeticForm, SamplePoem } from './types';

export const POETIC_FORMS: PoeticForm[] = [
  {
    id: 'free_verse',
    name: 'Free Verse',
    description: 'No strict rules on meter or rhyme. Focus on imagery and rhythm of speech.',
    structure: 'Open form. Follow your own cadence.',
    example: 'The fog comes\non little cat feet...'
  },
  {
    id: 'haiku',
    name: 'Haiku',
    description: 'A Japanese form focused on nature and a specific moment in time.',
    structure: 'Three lines: 5 syllables, 7 syllables, 5 syllables.',
    example: 'An old silent pond...\nA frog jumps into the pond,\nsplash! Silence again.'
  },
  {
    id: 'sonnet',
    name: 'Shakespearean Sonnet',
    description: 'A 14-line poem written in iambic pentameter.',
    structure: 'ABAB CDCD EFEF GG. 14 lines.',
    example: 'Shall I compare thee to a summer\'s day?...'
  },
  {
    id: 'limerick',
    name: 'Limerick',
    description: 'A humorous, frequently bawdy, verse of three long and two short lines.',
    structure: 'AABBA rhyme scheme.',
    example: 'There was an Old Man with a beard...'
  },
  {
    id: 'villanelle',
    name: 'Villanelle',
    description: 'A highly structured 19-line poem with two repeating rhymes and two refrains.',
    structure: 'Five tercets followed by a quatrain.',
    example: 'Do not go gentle into that good night...'
  }
];

export const SAMPLE_POEMS: SamplePoem[] = [
  {
    id: 'sample_draft_1',
    title: 'The Sad Rain',
    author: 'Anonymous Draft',
    description: 'Level: Needs Significant Work (Red)',
    formId: 'free_verse',
    text: `The rain comes down hard
It makes the ground wet
I am sad today
Because my cat is wet too
And the sky is gray like my soul.`
  },
  {
    id: 'sample_draft_2',
    title: 'Summer Heat',
    author: 'Student Attempt',
    description: 'Level: Structure Errors (Red/Orange)',
    formId: 'haiku',
    text: `The sun is very hot (6)
I like to eat ice cream cones (7)
Summer is the best (5)`
  },
  {
    id: 'sample_good_1',
    title: 'The Man from Leeds',
    author: 'Draft Limerick',
    description: 'Level: Good Bones (Orange)',
    formId: 'limerick',
    text: `There once was a gardener from Leeds
Who swallowed a packet of seeds
It wasn't too long
Till he felt something wrong
And his nose was covered in weeds.`
  },
  {
    id: 'sample_great_1',
    title: 'The Red Wheelbarrow',
    author: 'William Carlos Williams',
    description: 'Level: Masterpiece (Green)',
    formId: 'free_verse',
    text: `so much depends
upon

a red wheel
barrow

glazed with rain
water

beside the white
chickens`
  },
  {
    id: 'sample_great_2',
    title: 'Ozymandias',
    author: 'Percy Bysshe Shelley',
    description: 'Level: Masterpiece (Green)',
    formId: 'sonnet',
    text: `I met a traveller from an antique land,
Who said—“Two vast and trunkless legs of stone
Stand in the desert. . . . Near them, on the sand,
Half sunk a shattered visage lies, whose frown,
And wrinkled lip, and sneer of cold command,
Tell that its sculptor well those passions read
Which yet survive, stamped on these lifeless things,
The hand that mocked them, and the heart that fed;
And on the pedestal, these words appear:
My name is Ozymandias, King of Kings;
Look on my Works, ye Mighty, and despair!
Nothing beside remains. Round the decay
Of that colossal Wreck, boundless and bare
The lone and level sands stretch far away.”`
  }
];

export const SYSTEM_INSTRUCTION = `
You are a discerning Literary Editor using the RBFR and SSPSS frameworks.

**CORE PHILOSOPHY: BALANCED PROFESSIONALISM**
Your goal is to evaluate if the work is **ready for publication** in a decent literary journal.
- **Do not be overly effusive.** Toxic positivity helps no one.
- **Do not be a nitpicker.** If the poem works, don't hunt for microscopic flaws.
- **The Standard:** "Green" means *Competent and Complete*. It does not mean "Genius". It means the poet has achieved their intent effectively and the poem stands on its own.
- **The Gap:** "Orange" means "Almost, but...". It has a spark but stumbles on execution (clichés, rhythm breaks, vague imagery).
- **The Draft:** "Red" means the core idea is obscured by technical or structural issues.

**Role:** A critical but constructive editor. You are not a cheerleader; you are a coach.

**Behaviour (SSPSS):**
1.  **State:** Identify what the poem is *trying* to do.
2.  **Support:** Highlight the strongest line or image. Be specific.
3.  **Problem:** Identify the main obstacle to publication. (Is it cliché? Is the rhythm awkward? Is it confusing?).
4.  **Solve:** Offer a concrete fix.
5.  **Summarize:** Valid/Not Valid for publication.

**Reporting:** Return strictly JSON.
`;