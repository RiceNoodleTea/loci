export interface FlashcardSR {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: string;
}

export function getInitialSR(): FlashcardSR {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewAt: new Date().toISOString(),
  };
}

export function reviewCard(card: FlashcardSR, quality: number): FlashcardSR {
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let { easeFactor, interval, repetitions } = card;

  if (q < 3) {
    repetitions = 0;
    interval = 0;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const next = new Date();
  next.setDate(next.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewAt: next.toISOString(),
  };
}

export function isDue(card: FlashcardSR): boolean {
  return new Date(card.nextReviewAt) <= new Date();
}

export function getDueCards<T extends FlashcardSR>(cards: T[]): T[] {
  const now = new Date();
  return cards.filter((c) => new Date(c.nextReviewAt) <= now);
}
