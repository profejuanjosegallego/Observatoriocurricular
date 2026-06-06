function normalize(name) {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function matchesName(a, b) {
  const tokensA = normalize(a);
  const tokensB = normalize(b);
  if (!tokensA.length || !tokensB.length) return false;

  if (tokensA.join(' ') === tokensB.join(' ')) return true;

  const [shorter, longer] = tokensA.length <= tokensB.length
    ? [tokensA, tokensB]
    : [tokensB, tokensA];

  if (shorter.length < 2) return false;

  return shorter.every(t => longer.includes(t));
}
