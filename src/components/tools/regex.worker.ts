self.addEventListener('message', (e) => {
  const { pattern, flags, testString } = e.data;

  try {
    // Only pass 'g' if it's not already in flags and we need to matchAll.
    // Actually, matchAll requires 'g'.
    const hasG = flags.includes('g');
    const safeFlags = hasG ? flags : flags + 'g';
    
    const re = new RegExp(pattern, safeFlags);
    
    // Convert IterableIterator to array of simple objects to pass back via postMessage
    const matches = [...testString.matchAll(re)];
    
    const serializedMatches = matches.map((m: RegExpExecArray) => {
      return {
        0: m[0],
        index: m.index,
        length: m[0].length
      };
    });

    // If 'g' wasn't originally requested, just return the first match to simulate non-global matchAll
    if (!hasG && serializedMatches.length > 0) {
      self.postMessage({ matches: [serializedMatches[0]], error: null });
    } else {
      self.postMessage({ matches: serializedMatches, error: null });
    }
  } catch (error: any) {
    self.postMessage({ matches: [], error: error.message || 'Invalid regex' });
  }
});
