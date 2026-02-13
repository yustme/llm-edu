// ----------------------------------------------------------------
// Chunking algorithm implementations for the interactive demo
// ----------------------------------------------------------------

export type ChunkingStrategy = "fixed" | "sentence" | "paragraph" | "recursive";

export interface ChunkResult {
  /** The text content of the chunk */
  text: string;
  /** Starting character index in the original text */
  startIndex: number;
  /** Ending character index in the original text */
  endIndex: number;
}

export interface ChunkingStats {
  chunkCount: number;
  avgSize: number;
  minSize: number;
  maxSize: number;
  overlapPercent: number;
}

/**
 * Split text into fixed-size chunks by character count.
 * When overlap is specified, each chunk starts (chunkSize - overlapChars) after the previous.
 */
export function chunkFixedSize(
  text: string,
  chunkSize: number,
  overlapChars: number
): ChunkResult[] {
  if (text.length === 0) return [];
  const step = Math.max(chunkSize - overlapChars, 1);
  const chunks: ChunkResult[] = [];

  for (let i = 0; i < text.length; i += step) {
    const end = Math.min(i + chunkSize, text.length);
    chunks.push({
      text: text.slice(i, end),
      startIndex: i,
      endIndex: end,
    });
    if (end >= text.length) break;
  }
  return chunks;
}

/**
 * Split text at sentence boundaries (period, exclamation, question mark followed by space or end).
 * Preserves the sentence-ending punctuation within each chunk.
 */
export function chunkBySentence(
  text: string,
  _chunkSize: number,
  overlapChars: number
): ChunkResult[] {
  if (text.length === 0) return [];

  // Split at sentence boundaries, keeping the delimiter with the preceding sentence
  const sentenceRegex = /[^.!?]*[.!?]+(?:\s|$)|[^.!?]+$/g;
  const rawSentences: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = sentenceRegex.exec(text)) !== null) {
    const trimmed = match[0].trim();
    if (trimmed.length > 0) {
      rawSentences.push(trimmed);
    }
  }

  if (rawSentences.length === 0) {
    return [{ text: text.trim(), startIndex: 0, endIndex: text.length }];
  }

  // Build chunks from sentences, merging short sentences and applying overlap
  const chunks: ChunkResult[] = [];
  let currentStart = 0;

  for (let i = 0; i < rawSentences.length; i++) {
    const sentence = rawSentences[i];
    const startIndex = text.indexOf(sentence, currentStart);
    const endIndex = startIndex + sentence.length;

    chunks.push({
      text: sentence,
      startIndex,
      endIndex,
    });
    currentStart = endIndex;
  }

  // Apply overlap: duplicate trailing characters from previous chunk into the next
  if (overlapChars > 0 && chunks.length > 1) {
    const overlappedChunks: ChunkResult[] = [chunks[0]];
    for (let i = 1; i < chunks.length; i++) {
      const prev = chunks[i - 1];
      const overlapText = prev.text.slice(-overlapChars);
      const combined = overlapText + " " + chunks[i].text;
      overlappedChunks.push({
        text: combined,
        startIndex: prev.endIndex - overlapChars,
        endIndex: chunks[i].endIndex,
      });
    }
    return overlappedChunks;
  }

  return chunks;
}

/**
 * Split text at paragraph boundaries (double newlines).
 */
export function chunkByParagraph(
  text: string,
  _chunkSize: number,
  overlapChars: number
): ChunkResult[] {
  if (text.length === 0) return [];

  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) {
    return [{ text: text.trim(), startIndex: 0, endIndex: text.length }];
  }

  const chunks: ChunkResult[] = [];
  let searchStart = 0;

  for (const paragraph of paragraphs) {
    const startIndex = text.indexOf(paragraph, searchStart);
    const endIndex = startIndex + paragraph.length;
    chunks.push({
      text: paragraph,
      startIndex,
      endIndex,
    });
    searchStart = endIndex;
  }

  // Apply overlap
  if (overlapChars > 0 && chunks.length > 1) {
    const overlappedChunks: ChunkResult[] = [chunks[0]];
    for (let i = 1; i < chunks.length; i++) {
      const prev = chunks[i - 1];
      const overlapText = prev.text.slice(-overlapChars);
      const combined = overlapText + " " + chunks[i].text;
      overlappedChunks.push({
        text: combined,
        startIndex: prev.endIndex - overlapChars,
        endIndex: chunks[i].endIndex,
      });
    }
    return overlappedChunks;
  }

  return chunks;
}

/**
 * Recursive chunking: try paragraph split first, then sentence split
 * for any chunk that exceeds the target size.
 */
export function chunkRecursive(
  text: string,
  chunkSize: number,
  overlapChars: number
): ChunkResult[] {
  if (text.length === 0) return [];

  // Level 1: Split by paragraphs
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const intermediateChunks: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.length <= chunkSize) {
      intermediateChunks.push(paragraph);
    } else {
      // Level 2: Split oversized paragraphs by sentences
      const sentenceRegex = /[^.!?]*[.!?]+(?:\s|$)|[^.!?]+$/g;
      let match: RegExpExecArray | null;
      while ((match = sentenceRegex.exec(paragraph)) !== null) {
        const trimmed = match[0].trim();
        if (trimmed.length > 0) {
          intermediateChunks.push(trimmed);
        }
      }
    }
  }

  // Build final ChunkResult array with positions
  const chunks: ChunkResult[] = [];
  let searchStart = 0;

  for (const chunk of intermediateChunks) {
    const startIndex = text.indexOf(chunk, searchStart);
    const endIndex = startIndex + chunk.length;
    chunks.push({
      text: chunk,
      startIndex: startIndex >= 0 ? startIndex : searchStart,
      endIndex: startIndex >= 0 ? endIndex : searchStart + chunk.length,
    });
    searchStart = startIndex >= 0 ? endIndex : searchStart + chunk.length;
  }

  // Apply overlap
  if (overlapChars > 0 && chunks.length > 1) {
    const overlappedChunks: ChunkResult[] = [chunks[0]];
    for (let i = 1; i < chunks.length; i++) {
      const prev = chunks[i - 1];
      const overlapText = prev.text.slice(-overlapChars);
      const combined = overlapText + " " + chunks[i].text;
      overlappedChunks.push({
        text: combined,
        startIndex: prev.endIndex - overlapChars,
        endIndex: chunks[i].endIndex,
      });
    }
    return overlappedChunks;
  }

  return chunks;
}

/** Dispatch to the appropriate chunking function based on strategy name */
export function chunkText(
  text: string,
  strategy: ChunkingStrategy,
  chunkSize: number,
  overlapPercent: number
): ChunkResult[] {
  const overlapChars = Math.round(chunkSize * (overlapPercent / 100));

  switch (strategy) {
    case "fixed":
      return chunkFixedSize(text, chunkSize, overlapChars);
    case "sentence":
      return chunkBySentence(text, chunkSize, overlapChars);
    case "paragraph":
      return chunkByParagraph(text, chunkSize, overlapChars);
    case "recursive":
      return chunkRecursive(text, chunkSize, overlapChars);
    default:
      return chunkFixedSize(text, chunkSize, overlapChars);
  }
}

/** Compute statistics for a set of chunks */
export function computeStats(
  chunks: ChunkResult[],
  overlapPercent: number
): ChunkingStats {
  if (chunks.length === 0) {
    return { chunkCount: 0, avgSize: 0, minSize: 0, maxSize: 0, overlapPercent };
  }

  const sizes = chunks.map((c) => c.text.length);
  const total = sizes.reduce((sum, s) => sum + s, 0);

  return {
    chunkCount: chunks.length,
    avgSize: Math.round(total / chunks.length),
    minSize: Math.min(...sizes),
    maxSize: Math.max(...sizes),
    overlapPercent,
  };
}
