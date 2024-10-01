export function getRandomSentences() {
  // Array of sample words to create sentences
  const words = [
    "adventure",
    "beautiful",
    "challenge",
    "delightful",
    "extraordinary",
    "fantastic",
    "gorgeous",
    "harmony",
    "inspiration",
    "journey",
    "knowledge",
    "love",
    "marvelous",
    "nature",
    "opportunity",
    "peace",
    "quiet",
    "remarkable",
    "success",
    "tranquil",
    "unique",
    "victory",
    "wonderful",
    "youthful",
    "zealous",
    "brilliant",
    "dynamic",
    "elegant",
    "radiant",
    "serene",
    "blissful",
    "courageous",
    "innovative",
    "joyful",
    "limitless",
    "optimistic",
    "persistent",
    "resilient",
    "splendid",
    "thriving",
    "vibrant",
    "wondrous",
    "adventurous",
    "compassionate",
    "fearless",
  ];

  // Function to generate a random sentence with between 15 and 25 words
  function getRandomSentence() {
    const sentenceLength = Math.floor(Math.random() * 11) + 15; // Random sentence length between 15 and 25 words
    const sentence = new Set(); // Use a Set to avoid duplicate words
    while (sentence.size < sentenceLength) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      sentence.add(randomWord);
    }

    // Join words into a string, capitalize the first letter, and add a period
    const sentenceArray = [...sentence]; // Convert Set back to Array
    const sentenceString = sentenceArray.join(" "); // Just join the words once, no tripling
    return (
      sentenceString.charAt(0).toUpperCase() + sentenceString.slice(1) + "."
    );
  }

  // Number of sentences (randomly between 3 and 5)
  const numSentences = Math.floor(Math.random() * 3) + 3;

  // Create the array of sentences
  const sentences = [];
  for (let i = 0; i < numSentences; i++) {
    sentences.push(getRandomSentence());
  }

  return sentences;
}

// Example usage:
const randomSentences = getRandomSentences();
console.log(randomSentences);
