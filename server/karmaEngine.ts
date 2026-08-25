import { UserRecord } from './seedData';

export const BADGE_DEFINITIONS = [
  {
    name: 'First Exchange',
    description: 'Completed your first successful peer resource or service exchange',
    icon: 'Sparkles',
    check: (user: UserRecord) => user.tradesCompleted >= 1,
  },
  {
    name: 'Campus Hero',
    description: 'Executed 10+ campus trades and community collaborations',
    icon: 'ShieldCheck',
    check: (user: UserRecord) => user.tradesCompleted >= 10,
  },
  {
    name: 'Top Seller',
    description: 'Maintained exceptional exchange reliability and positive ratings',
    icon: 'Award',
    check: (user: UserRecord) => user.tradesCompleted >= 5,
  },
  {
    name: 'Trusted Peer',
    description: 'Consistently achieved 4.8+ rating across 5 or more peer reviews',
    icon: 'Star',
    check: (user: UserRecord) => user.ratingAvg >= 4.7 && user.reviewsCount >= 5,
  },
  {
    name: 'Community Beacon',
    description: 'Achieved 500+ student karma points through helpful campus exchanges',
    icon: 'Flame',
    check: (user: UserRecord) => user.karma >= 500,
  },
];

export function recalculateBadges(user: UserRecord): { badges: string[]; newBadges: string[] } {
  const currentBadges = new Set(user.badges || []);
  const newBadges: string[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (badge.check(user) && !currentBadges.has(badge.name)) {
      currentBadges.add(badge.name);
      newBadges.push(badge.name);
    }
  }

  return {
    badges: Array.from(currentBadges),
    newBadges,
  };
}
