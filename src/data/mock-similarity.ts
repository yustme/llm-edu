/** A pair of words/phrases with a pre-computed similarity score */
export interface SimilarityPair {
  id: string;
  wordA: string;
  wordB: string;
  /** Cosine similarity in the range [-1, 1] */
  similarity: number;
}

/** Pre-computed word pair similarities (simulated embedding-based scores) */
export const WORD_PAIRS: SimilarityPair[] = [
  { id: "dog-puppy", wordA: "dog", wordB: "puppy", similarity: 0.92 },
  { id: "king-queen", wordA: "king", wordB: "queen", similarity: 0.85 },
  { id: "happy-joyful", wordA: "happy", wordB: "joyful", similarity: 0.88 },
  { id: "car-automobile", wordA: "car", wordB: "automobile", similarity: 0.95 },
  { id: "hot-cold", wordA: "hot", wordB: "cold", similarity: -0.15 },
  { id: "dog-airplane", wordA: "dog", wordB: "airplane", similarity: 0.12 },
  { id: "bank-river", wordA: "bank", wordB: "river", similarity: 0.35 },
  { id: "run-sprint", wordA: "run", wordB: "sprint", similarity: 0.82 },
  { id: "good-bad", wordA: "good", wordB: "bad", similarity: -0.08 },
  { id: "computer-laptop", wordA: "computer", wordB: "laptop", similarity: 0.91 },
] as const;

/** A document with a similarity score relative to a query */
export interface SearchDocument {
  id: string;
  title: string;
  snippet: string;
  similarity: number;
}

/** A semantic search query with ranked documents */
export interface SemanticSearchQuery {
  id: string;
  query: string;
  documents: SearchDocument[];
}

/** Semantic search demo data: queries with ranked document results */
export const SEMANTIC_SEARCH_DATA: SemanticSearchQuery[] = [
  {
    id: "ml-basics",
    query: "How does machine learning work?",
    documents: [
      { id: "ml-1", title: "Introduction to Machine Learning Algorithms", snippet: "Machine learning is a subset of AI that enables systems to learn from data and improve predictions without explicit programming.", similarity: 0.94 },
      { id: "ml-2", title: "Supervised vs Unsupervised Learning", snippet: "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled datasets.", similarity: 0.87 },
      { id: "ml-3", title: "Neural Networks Explained", snippet: "Deep neural networks consist of layers of interconnected nodes that process information similarly to biological neurons.", similarity: 0.78 },
      { id: "ml-4", title: "Getting Started with Python for Data Science", snippet: "Python offers libraries like scikit-learn and TensorFlow that make implementing ML models straightforward.", similarity: 0.65 },
      { id: "ml-5", title: "Statistics Fundamentals for ML", snippet: "Understanding probability distributions and hypothesis testing is essential for evaluating model performance.", similarity: 0.52 },
      { id: "ml-6", title: "Cloud Computing Infrastructure", snippet: "AWS, GCP, and Azure provide scalable compute resources for training large models in the cloud.", similarity: 0.31 },
      { id: "ml-7", title: "History of Artificial Intelligence", snippet: "The field of AI began in the 1950s with pioneers like Alan Turing and John McCarthy.", similarity: 0.28 },
      { id: "ml-8", title: "Web Development with React", snippet: "React is a JavaScript library for building user interfaces with reusable components.", similarity: 0.08 },
    ],
  },
  {
    id: "cooking-pasta",
    query: "Best way to cook pasta al dente",
    documents: [
      { id: "pasta-1", title: "Italian Pasta Cooking Techniques", snippet: "For perfect al dente pasta, boil in salted water and test two minutes before the package time suggests.", similarity: 0.96 },
      { id: "pasta-2", title: "Guide to Pasta Shapes and Sauces", snippet: "Different pasta shapes hold different sauces better: rigatoni for chunky, spaghetti for oil-based.", similarity: 0.82 },
      { id: "pasta-3", title: "Homemade Fresh Pasta Recipe", snippet: "Mix semolina flour with eggs and knead for 10 minutes to achieve the right texture for fresh pasta.", similarity: 0.74 },
      { id: "pasta-4", title: "Italian Kitchen Essentials", snippet: "A good stockpot, colander, and wooden spoon are the basic tools for any Italian cooking setup.", similarity: 0.55 },
      { id: "pasta-5", title: "Mediterranean Diet Overview", snippet: "The Mediterranean diet emphasizes whole grains, olive oil, fish, and vegetables for heart health.", similarity: 0.41 },
      { id: "pasta-6", title: "Food Safety and Storage Tips", snippet: "Store dried pasta in a cool, dry place. Fresh pasta should be refrigerated and used within three days.", similarity: 0.33 },
      { id: "pasta-7", title: "Kitchen Renovation Ideas", snippet: "Modern kitchen designs feature open layouts, quartz countertops, and smart storage solutions.", similarity: 0.09 },
    ],
  },
  {
    id: "climate-change",
    query: "Impact of climate change on ocean ecosystems",
    documents: [
      { id: "climate-1", title: "Ocean Acidification and Marine Life", snippet: "Rising CO2 levels cause ocean acidification, threatening coral reefs and shellfish populations worldwide.", similarity: 0.95 },
      { id: "climate-2", title: "Rising Sea Temperatures", snippet: "Global warming has increased ocean temperatures by 1.5 degrees, disrupting marine migration patterns.", similarity: 0.89 },
      { id: "climate-3", title: "Coral Reef Bleaching Events", snippet: "Mass bleaching events have destroyed over 50% of the Great Barrier Reef in the last two decades.", similarity: 0.83 },
      { id: "climate-4", title: "Polar Ice Cap Melting Trends", snippet: "Arctic sea ice is declining at a rate of 13% per decade, affecting polar bear habitats and ocean currents.", similarity: 0.72 },
      { id: "climate-5", title: "Renewable Energy Solutions", snippet: "Wind and solar power can reduce carbon emissions by 70% when combined with energy storage systems.", similarity: 0.45 },
      { id: "climate-6", title: "Carbon Capture Technologies", snippet: "Direct air capture facilities can remove CO2 from the atmosphere and store it underground permanently.", similarity: 0.38 },
      { id: "climate-7", title: "Electric Vehicle Market Growth", snippet: "EV sales doubled in 2024 as battery costs dropped and charging infrastructure expanded globally.", similarity: 0.18 },
      { id: "climate-8", title: "Space Exploration Updates", snippet: "NASA plans to establish a permanent lunar base by 2030 as a stepping stone for Mars missions.", similarity: 0.05 },
    ],
  },
] as const;

/** 2D vector point for the interactive demo */
export interface Vector2D {
  x: number;
  y: number;
}

/** Named preset for the vector demo */
export interface VectorPreset {
  name: string;
  vectorA: Vector2D;
  vectorB: Vector2D;
}

/** Vector presets for the interactive cosine similarity demo */
export const VECTOR_PRESETS: VectorPreset[] = [
  {
    name: "Parallel",
    vectorA: { x: 100, y: -80 },
    vectorB: { x: 120, y: -96 },
  },
  {
    name: "Perpendicular",
    vectorA: { x: 120, y: 0 },
    vectorB: { x: 0, y: -120 },
  },
  {
    name: "Opposite",
    vectorA: { x: 100, y: -60 },
    vectorB: { x: -100, y: 60 },
  },
  {
    name: "45 deg",
    vectorA: { x: 120, y: 0 },
    vectorB: { x: 85, y: -85 },
  },
] as const;

/** Distance metric comparison data for the summary step */
export interface DistanceMetric {
  name: string;
  formula: string;
  range: string;
  bestFor: string;
  scaleInvariant: boolean;
}

/** Comparison of common distance/similarity metrics */
export const DISTANCE_METRICS: DistanceMetric[] = [
  {
    name: "Cosine Similarity",
    formula: "cos(theta) = (A . B) / (|A| x |B|)",
    range: "[-1, 1]",
    bestFor: "Text embeddings, semantic similarity",
    scaleInvariant: true,
  },
  {
    name: "Euclidean Distance",
    formula: "d = sqrt(sum((Ai - Bi)^2))",
    range: "[0, inf)",
    bestFor: "Spatial data, clustering (k-means)",
    scaleInvariant: false,
  },
  {
    name: "Dot Product",
    formula: "A . B = sum(Ai x Bi)",
    range: "(-inf, inf)",
    bestFor: "When magnitude matters (popularity + relevance)",
    scaleInvariant: false,
  },
] as const;
