export const drivers = [
  {
    name: "Max Verstappen",
    team: "Red Bull Racing Honda RBPT",
    nationality: "Netherlands 🇳🇱",
  },
  {
    name: "Lando Norris",
    team: "McLaren Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    name: "Charles Leclerc",
    team: "Ferrari",
    nationality: "Monaco 🇲🇨",
  },
  {
    name: "Oscar Piastri",
    team: "McLaren Mercedes",
    nationality: "Australia 🇦🇺",
  },
  {
    name: "Carlos Sainz",
    team: "Ferrari",
    nationality: "Spain 🇪🇸",
  },
  {
    name: "Lewis Hamilton",
    team: "Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    name: "George Russell",
    team: "Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    name: "Sergio Perez",
    team: "Red Bull Racing Honda RBPT",
    nationality: "Mexico 🇲🇽",
  },
  {
    name: "Fernando Alonso",
    team: "Aston Martin Aramco Mercedes",
    nationality: "Spain 🇪🇸",
  },
  {
    name: "Nico Hulkenberg",
    team: "Haas Ferrari",
    nationality: "Germany 🇩🇪",
  },
  {
    name: "Lance Stroll",
    team: "Aston Martin Aramco Mercedes",
    nationality: "Canada 🇨🇦",
  },
  {
    name: "Yuki Tsunoda",
    team: "RB Honda RBPT",
    nationality: "Japan 🇯🇵",
  },
  {
    name: "Alexander Albon",
    team: "Williams Mercedes",
    nationality: "Thailand 🇹🇭",
  },
  {
    name: "Daniel Ricciardo",
    team: "RB Honda RBPT",
    nationality: "Australia 🇦🇺",
  },
  {
    name: "Pierre Gasly",
    team: "Alpine Renault",
    nationality: "France 🇫🇷",
  },
  {
    name: "Oliver Bearman",
    team: "Haas Ferrari",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    name: "Kevin Magnussen",
    team: "Haas Ferrari",
    nationality: "Denmark 🇩🇰",
  },
  {
    name: "Esteban Ocon",
    team: "Alpine Renault",
    nationality: "France 🇫🇷",
  },
  {
    name: "Franco Colapinto",
    team: "Williams Mercedes",
    nationality: "Argentina 🇦🇷",
  },
  {
    name: "Zhou Guanyu",
    team: "Kick Sauber Ferrari",
    nationality: "China 🇨🇳",
  },
  {
    name: "Logan Sargeant",
    team: "Williams Mercedes",
    nationality: "United States 🇺🇸",
  },
  {
    name: "Valtteri Bottas",
    team: "Kick Sauber Ferrari",
    nationality: "Finland 🇫🇮",
  },
  {
    name: "Liam Lawson",
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
// https://www.the-race.com/formula-1/f1-points-system-explained-how-it-works/

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
// https://www.formula1.com/en/latest/article/2024-f1-sprint-rules-format-explained.5pQvaAY52nnX9vZYAYgf3O

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

export async function fetchData(endpoint) {
  // used to get current drivers standings
  try {
    const response = await fetch(endpoint); // Make the GET request
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
    }
    const data = await response.json(); // Parse the JSON from the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching data:", error); // Handle errors
    return null;
  }
}

export function normalizeResults(data) {
  // Destructure to extract the driver who achieved the fastest lap and the race results from the input data
  const { FastestLap: fastestLapDriver, Results } = data;

  // Map through each result item to create a simplified object
  return Results.map((item) => ({
    position: item.Position, // Extract the driver's position in the race
    driver: item.Driver, // Extract the driver's name
    dnf: item.DNF, // Extract the DNF (Did Not Finish) status
    fastestLap: item.Driver === fastestLapDriver, // Check if the current driver achieved the fastest lap
  }));
}
