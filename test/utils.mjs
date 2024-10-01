// Function to generate a 10-character unique identifier
export function generateUniqueId() {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueId = "";
  for (let i = 0; i < 10; i++) {
    uniqueId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return uniqueId;
}

// Function to generate ISO 8601 timestamp
export function getISO8601Timestamp(date = new Date()) {
  return date.toISOString();
}

export function getRandomF1Team() {
  const teams = [
    "Mercedes-AMG",
    "Ferrari",
    "Red Bull",
    "McLaren",
    "Alpine",
    "Aston Martin",
    "Williams",
    "Sauber",
    "VCaRB",
    "Haas",
  ];
  // Generate a random index and return the corresponding team
  const randomIndex = Math.floor(Math.random() * teams.length);
  return teams[randomIndex];
}

export function getSource() {
  const sources = ["YouTube", "News", "Podcast", "Race", "FP", "Quali"];
  // Generate a random index and return the corresponding team
  const randomIndex = Math.floor(Math.random() * sources.length);
  return sources[randomIndex];
}

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
