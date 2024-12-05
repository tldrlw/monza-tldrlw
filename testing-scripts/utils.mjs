export const drivers = [
  {
    driver: "Max Verstappen",
    team: "Red Bull Racing Honda RBPT",
    nationality: "Netherlands 🇳🇱",
  },
  {
    driver: "Lando Norris",
    team: "McLaren Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    driver: "Charles Leclerc",
    team: "Ferrari",
    nationality: "Monaco 🇲🇨",
  },
  {
    driver: "Oscar Piastri",
    team: "McLaren Mercedes",
    nationality: "Australia 🇦🇺",
  },
  {
    driver: "Carlos Sainz",
    team: "Ferrari",
    nationality: "Spain 🇪🇸",
  },
  {
    driver: "Lewis Hamilton",
    team: "Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    driver: "George Russell",
    team: "Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    driver: "Sergio Perez",
    team: "Red Bull Racing Honda RBPT",
    nationality: "Mexico 🇲🇽",
  },
  {
    driver: "Fernando Alonso",
    team: "Aston Martin Aramco Mercedes",
    nationality: "Spain 🇪🇸",
  },
  {
    driver: "Nico Hulkenberg",
    team: "Haas Ferrari",
    nationality: "Germany 🇩🇪",
  },
  {
    driver: "Lance Stroll",
    team: "Aston Martin Aramco Mercedes",
    nationality: "Canada 🇨🇦",
  },
  {
    driver: "Yuki Tsunoda",
    team: "RB Honda RBPT",
    nationality: "Japan 🇯🇵",
  },
  {
    driver: "Alexander Albon",
    team: "Williams Mercedes",
    nationality: "Thailand 🇹🇭",
  },
  {
    driver: "Daniel Ricciardo",
    team: "RB Honda RBPT",
    nationality: "Australia 🇦🇺",
  },
  {
    driver: "Pierre Gasly",
    team: "Alpine Renault",
    nationality: "France 🇫🇷",
  },
  {
    driver: "Oliver Bearman",
    team: "Haas Ferrari",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    driver: "Kevin Magnussen",
    team: "Haas Ferrari",
    nationality: "Denmark 🇩🇰",
  },
  {
    driver: "Esteban Ocon",
    team: "Alpine Renault",
    nationality: "France 🇫🇷",
  },
  {
    driver: "Franco Colapinto",
    team: "Williams Mercedes",
    nationality: "Argentina 🇦🇷",
  },
  {
    driver: "Zhou Guanyu",
    team: "Kick Sauber Ferrari",
    nationality: "China 🇨🇳",
  },
  {
    driver: "Logan Sargeant",
    team: "Williams Mercedes",
    nationality: "United States 🇺🇸",
  },
  {
    driver: "Valtteri Bottas",
    team: "Kick Sauber Ferrari",
    nationality: "Finland 🇫🇮",
  },
  {
    driver: "Liam Lawson",
    team: "RB Honda RBPT",
    nationality: "New Zealand 🇳🇿",
  },
];

export const raceScoringSystem = [
  { position: 1, points: 25 },
  { position: 2, points: 18 },
  { position: 3, points: 15 },
  { position: 4, points: 12 },
  { position: 5, points: 10 },
  { position: 6, points: 8 },
  { position: 7, points: 6 },
  { position: 8, points: 4 },
  { position: 9, points: 2 },
  { position: 10, points: 1 },
  { position: "fastestLap", points: 1 },
];

export const sprintScoringSystem = [
  { position: 1, points: 8 },
  { position: 2, points: 7 },
  { position: 3, points: 6 },
  { position: 4, points: 5 },
  { position: 5, points: 4 },
  { position: 6, points: 3 },
  { position: 7, points: 2 },
  { position: 8, points: 1 },
];

export const constructors = [
  "Alpine Renault",
  "Aston Martin Aramco Mercedes",
  "Ferrari",
  "Haas Ferrari",
  "Kick Sauber Ferrari",
  "McLaren Mercedes",
  "Mercedes",
  "RB Honda RBPT",
  "Red Bull Racing Honda RBPT",
  "Williams Mercedes",
];

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

// Sort by DateTime in descending order (most recent first)
export function sortDataByTime(data) {
  return data.slice().sort((a, b) => {
    const dateA = new Date(a.DateTime.S);
    const dateB = new Date(b.DateTime.S);
    return dateB - dateA;
  });
}

///

export function getRandomF1Team() {
  // Generate a random index and return the corresponding team
  const randomIndex = Math.floor(Math.random() * constructors.length);
  return constructors[randomIndex];
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
// const randomSentences = getRandomSentences();
// console.log(randomSentences);
