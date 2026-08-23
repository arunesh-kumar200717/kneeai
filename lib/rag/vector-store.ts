import { DocumentChunk, SURGICAL_KNOWLEDGE_BASE } from "./knowledge-base";

export interface SearchResult {
  chunk: DocumentChunk;
  similarityScore: number;
  matchedKeywords: string[];
}

export interface MorphometryFilters {
  catalogName?: string;
  femurApWidthMm?: number;
  tibiaMlWidthMm?: number;
  varusValgusDeg?: number;
}

/**
 * In-Memory Vector Store & Semantic Retrieval Engine
 * Generates vector weights from medical vocabulary and calculates cosine similarity
 * combined with morphometric range matching.
 */
export class SurgicalVectorStore {
  private chunks: DocumentChunk[];
  private vocabulary: Map<string, number>;
  private chunkVectors: number[][];

  constructor(chunks: DocumentChunk[] = SURGICAL_KNOWLEDGE_BASE) {
    this.chunks = chunks;
    this.vocabulary = new Map();
    this.chunkVectors = [];
    this.buildIndex();
  }

  /**
   * Tokenizes text and strips punctuation, lowercases, and stems key medical terms
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s.-]/g, " ")
      .split(/\s+/)
      .filter((term) => term.length > 2);
  }

  /**
   * Builds the vector space index and precomputes chunk vectors
   */
  private buildIndex(): void {
    let termIndex = 0;

    // Collect vocabulary from all chunks and tags
    for (const chunk of this.chunks) {
      const fullText = `${chunk.documentTitle} ${chunk.section} ${chunk.content} ${chunk.tags.join(" ")} ${chunk.catalog}`;
      const tokens = this.tokenize(fullText);

      for (const token of tokens) {
        if (!this.vocabulary.has(token)) {
          this.vocabulary.set(token, termIndex++);
        }
      }
    }

    // Precompute TF-IDF vector embeddings for each document chunk
    const vocabSize = this.vocabulary.size;
    this.chunkVectors = this.chunks.map((chunk) => {
      const vector = new Array(vocabSize).fill(0);
      const fullText = `${chunk.documentTitle} ${chunk.section} ${chunk.content} ${chunk.tags.join(" ")} ${chunk.catalog}`;
      const tokens = this.tokenize(fullText);

      for (const token of tokens) {
        const idx = this.vocabulary.get(token);
        if (idx !== undefined) {
          vector[idx] += 1;
        }
      }

      // L2 Normalize the vector
      const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
      return magnitude > 0 ? vector.map((v) => v / magnitude) : vector;
    });
  }

  /**
   * Vectorizes a query string
   */
  private vectorizeQuery(query: string): number[] {
    const vocabSize = this.vocabulary.size;
    const vector = new Array(vocabSize).fill(0);
    const tokens = this.tokenize(query);

    for (const token of tokens) {
      const idx = this.vocabulary.get(token);
      if (idx !== undefined) {
        vector[idx] += 1;
      }
    }

    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map((v) => v / magnitude) : vector;
  }

  /**
   * Cosine similarity between two normalized vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dotProduct));
  }

  /**
   * Performs Semantic Vector Search with Morphometric Constraint Boosting
   */
  public search(
    query: string,
    filters?: MorphometryFilters,
    topK = 3
  ): SearchResult[] {
    const queryVector = this.vectorizeQuery(query);
    const queryTokens = this.tokenize(query);

    const scoredResults: SearchResult[] = this.chunks.map((chunk, idx) => {
      const chunkVector = this.chunkVectors[idx];
      let baseSimilarity = this.cosineSimilarity(queryVector, chunkVector);

      // Morphometric Boosts
      let boost = 0;
      const matchedKeywords: string[] = [];

      // 1. Catalog matching boost
      if (filters?.catalogName) {
        const catalogLower = filters.catalogName.toLowerCase();
        if (chunk.catalog.toLowerCase().includes(catalogLower) || catalogLower.includes(chunk.catalog.toLowerCase())) {
          boost += 0.25;
          matchedKeywords.push(`Catalog: ${chunk.catalog}`);
        }
      }

      // 2. Femur AP Dimension match
      if (filters?.femurApWidthMm && chunk.femurApRangeMm) {
        const [min, max] = chunk.femurApRangeMm;
        if (filters.femurApWidthMm >= min && filters.femurApWidthMm <= max) {
          boost += 0.20;
          matchedKeywords.push(`Femur AP (${min}-${max}mm)`);
        }
      }

      // 3. Tibia ML Dimension match
      if (filters?.tibiaMlWidthMm && chunk.tibiaMlRangeMm) {
        const [min, max] = chunk.tibiaMlRangeMm;
        if (filters.tibiaMlWidthMm >= min && filters.tibiaMlWidthMm <= max) {
          boost += 0.20;
          matchedKeywords.push(`Tibia ML (${min}-${max}mm)`);
        }
      }

      // 4. Deformity (Varus/Valgus) match
      if (filters?.varusValgusDeg !== undefined) {
        if (filters.varusValgusDeg > 4 && chunk.tags.includes("varus")) {
          boost += 0.15;
          matchedKeywords.push("Varus Alignment Protocol");
        } else if (filters.varusValgusDeg < -2 && chunk.tags.includes("valgus")) {
          boost += 0.15;
          matchedKeywords.push("Valgus Alignment Protocol");
        }
      }

      // Find token overlaps for keyword highlighting
      for (const token of queryTokens) {
        if (chunk.tags.includes(token) && !matchedKeywords.includes(token)) {
          matchedKeywords.push(token);
        }
      }

      const totalScore = Math.min(0.99, Number((baseSimilarity * 0.4 + boost * 0.6).toFixed(4)));

      return {
        chunk,
        similarityScore: totalScore,
        matchedKeywords,
      };
    });

    // Rank by similarity score and return top K
    return scoredResults
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topK);
  }
}

// Export singleton vector store instance
export const globalVectorStore = new SurgicalVectorStore();
