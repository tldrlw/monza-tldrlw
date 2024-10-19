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
