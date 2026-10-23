export const RPS_CHOICES = {
 rock: { emoji: '🪨', beats: 'scissors' },
 paper: { emoji: '📄', beats: 'rock' },
 scissors: { emoji: '✂️', beats: 'paper' },
};

/** @returns {'win' | 'lose' | 'draw'} from the player's perspective */
export function rpsOutcome(player, computer) {
 if (!(player in RPS_CHOICES) || !(computer in RPS_CHOICES)) {
  throw new Error(`Invalid choice: ${player} vs ${computer}`);
 }
 if (player === computer) return 'draw';
 return RPS_CHOICES[player].beats === computer ? 'win' : 'lose';
}

export const EIGHT_BALL_ANSWERS = [
 'It is certain.',
 'It is decidedly so.',
 'Without a doubt.',
 'Yes, definitely.',
 'You may rely on it.',
 'As I see it, yes.',
 'Most likely.',
 'Outlook good.',
 'Yes.',
 'Signs point to yes.',
 'Reply hazy, try again.',
 'Ask again later.',
 'Better not tell you now.',
 'Cannot predict now.',
 'Concentrate and ask again.',
 "Don't count on it.",
 'My reply is no.',
 'My sources say no.',
 'Outlook not so good.',
 'Very doubtful.',
];

// Answers 0-9 are positive; "lucky" mode only draws from those.
export const LUCKY_ANSWERS = EIGHT_BALL_ANSWERS.slice(0, 10);
