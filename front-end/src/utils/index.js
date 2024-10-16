export function getLoggedInUser(cookieStore, userPoolClientId) {
  // ^ The logged output of `cookieStore` is a JavaScript Map object, not a regular JavaScript object. You can still parse through it, but the syntax differs slightly from standard objects (need to use `.get`, see below)
  const cookieStoreParsedMap = cookieStore._parsed;
  const lastAuthUserKey = `CognitoIdentityServiceProvider.${userPoolClientId}.LastAuthUser`;
  const lastAuthUser = cookieStoreParsedMap.get(lastAuthUserKey);
  const loggedInUser = lastAuthUser.value;
  // console.log(loggedInUser)
  return loggedInUser;
  // returns the username
}

export function formatToHumanReadable(isoString) {
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "long", // Full month name (e.g., September)
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short", // Includes time zone (e.g., GMT)
  };
  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

// Sort by DateTime in descending order (most recent first)
export function sortDataByTime(data) {
  return data.slice().sort((a, b) => {
    const dateA = new Date(a.DateTime.S);
    const dateB = new Date(b.DateTime.S);
    return dateB - dateA;
  });
}

export const teams = [
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

export const drivers = [
  { driver: "Alexander Albon", team: "Williams", nationality: "Thailand 🇹🇭" },
  { driver: "Carlos Sainz", team: "Ferrari", nationality: "Spain 🇪🇸" },
  { driver: "Charles Leclerc", team: "Ferrari", nationality: "Monaco 🇲🇨" },
  { driver: "Daniel Ricciardo", team: "RB", nationality: "Australia 🇦🇺" },
  { driver: "Esteban Ocon", team: "Alpine", nationality: "France 🇫🇷" },
  {
    driver: "Fernando Alonso",
    team: "Aston Martin Aramco",
    nationality: "Spain 🇪🇸",
  },
  { driver: "Franco Colapinto", team: "Williams", nationality: "Argentina 🇦🇷" },
  {
    driver: "George Russell",
    team: "Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  { driver: "Kevin Magnussen", team: "Haas", nationality: "Denmark 🇩🇰" },
  {
    driver: "Lance Stroll",
    team: "Aston Martin Aramco",
    nationality: "Canada 🇨🇦",
  },
  { driver: "Lando Norris", team: "McLaren", nationality: "United Kingdom 🇬🇧" },
  {
    driver: "Lewis Hamilton",
    team: "Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  { driver: "Liam Lawson", team: "RB", nationality: "New Zealand 🇳🇿" },
  {
    driver: "Logan Sargeant",
    team: "Williams",
    nationality: "United States 🇺🇸",
  },
  {
    driver: "Max Verstappen",
    team: "Red Bull Racing",
    nationality: "Netherlands 🇳🇱",
  },
  { driver: "Nico Hulkenberg", team: "Haas", nationality: "Germany 🇩🇪" },
  { driver: "Oliver Bearman", team: "Haas", nationality: "United Kingdom 🇬🇧" },
  { driver: "Oscar Piastri", team: "McLaren", nationality: "Australia 🇦🇺" },
  { driver: "Pierre Gasly", team: "Alpine", nationality: "France 🇫🇷" },
  { driver: "Sergio Perez", team: "Red Bull Racing", nationality: "Mexico 🇲🇽" },
  { driver: "Valtteri Bottas", team: "Kick Sauber", nationality: "Finland 🇫🇮" },
  { driver: "Yuki Tsunoda", team: "RB", nationality: "Japan 🇯🇵" },
  { driver: "Zhou Guanyu", team: "Kick Sauber", nationality: "China 🇨🇳" },
];
