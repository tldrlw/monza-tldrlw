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
