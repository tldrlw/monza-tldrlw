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
    name: "Alexander Albon",
    team: "Williams Mercedes",
    nationality: "Thailand 🇹🇭",
  },
  {
    name: "Carlos Sainz",
    team: "Ferrari",
    nationality: "Spain 🇪🇸",
  },
  {
    name: "Charles Leclerc",
    team: "Ferrari",
    nationality: "Monaco 🇲🇨",
  },
  {
    name: "Daniel Ricciardo",
    team: "RB Honda RBPT",
    nationality: "Australia 🇦🇺",
  },
  {
    name: "Esteban Ocon",
    team: "Alpine Renault",
    nationality: "France 🇫🇷",
  },
  {
    name: "Fernando Alonso",
    team: "Aston Martin Aramco Mercedes",
    nationality: "Spain 🇪🇸",
  },
  {
    name: "Franco Colapinto",
    team: "Williams Mercedes",
    nationality: "Argentina 🇦🇷",
  },
  {
    name: "George Russell",
    team: "Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    name: "Jack Doohan",
    team: "Alpine Renault",
    nationality: "Australia 🇦🇺",
  },
  {
    name: "Kevin Magnussen",
    team: "Haas Ferrari",
    nationality: "Denmark 🇩🇰",
  },
  {
    name: "Lance Stroll",
    team: "Aston Martin Aramco Mercedes",
    nationality: "Canada 🇨🇦",
  },
  {
    name: "Lando Norris",
    team: "McLaren Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    name: "Lewis Hamilton",
    team: "Mercedes",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    name: "Liam Lawson",
    team: "RB Honda RBPT",
    nationality: "New Zealand 🇳🇿",
  },
  {
    name: "Logan Sargeant",
    team: "Williams Mercedes",
    nationality: "United States 🇺🇸",
  },
  {
    name: "Max Verstappen",
    team: "Red Bull Racing Honda RBPT",
    nationality: "Netherlands 🇳🇱",
  },
  {
    name: "Nico Hulkenberg",
    team: "Haas Ferrari",
    nationality: "Germany 🇩🇪",
  },
  {
    name: "Oliver Bearman",
    team: "Haas Ferrari",
    nationality: "United Kingdom 🇬🇧",
  },
  {
    name: "Oscar Piastri",
    team: "McLaren Mercedes",
    nationality: "Australia 🇦🇺",
  },
  {
    name: "Pierre Gasly",
    team: "Alpine Renault",
    nationality: "France 🇫🇷",
  },
  {
    name: "Sergio Perez",
    team: "Red Bull Racing Honda RBPT",
    nationality: "Mexico 🇲🇽",
  },
  {
    name: "Valtteri Bottas",
    team: "Kick Sauber Ferrari",
    nationality: "Finland 🇫🇮",
  },
  {
    name: "Yuki Tsunoda",
    team: "RB Honda RBPT",
    nationality: "Japan 🇯🇵",
  },
  {
    name: "Zhou Guanyu",
    team: "Kick Sauber Ferrari",
    nationality: "China 🇨🇳",
  },
];

export const races = [
  {
    name: "Gulf Air Bahrain Grand Prix",
    location: "Bahrain International Circuit",
    startDate: "2024-02-29",
    endDate: "2024-03-02",
    // iso format for dates
  },
  {
    name: "STC Saudi Arabian Grand Prix",
    location: "Jeddah Street Circuit",
    startDate: "2024-03-07",
    endDate: "2024-03-09",
  },
  {
    name: "Rolex Australian Grand Prix",
    location: "Melbourne Grand Prix Circuit",
    startDate: "2024-03-21",
    endDate: "2024-03-24",
  },
  {
    name: "MSC Cruises Japanese Grand Prix",
    location: "Suzuka International Racing Course",
    startDate: "2024-04-04",
    endDate: "2024-04-07",
  },
  {
    name: "Lenovo Chinese Grand Prix",
    location: "Shanghai International Circuit",
    startDate: "2024-04-18",
    endDate: "2024-04-21",
  },
  {
    name: "Crypto.com Miami Grand Prix",
    location: "Miami International Autodrome",
    startDate: "2024-05-03",
    endDate: "2024-05-05",
  },
  {
    name: "MSC Cruises Emilia Romagna Grand Prix",
    location: "Autodromo Enzo e Dino Ferrari",
    startDate: "2024-05-17",
    endDate: "2024-05-19",
  },
  {
    name: "Monaco Grand Prix",
    location: "Circuit de Monaco",
    startDate: "2024-05-24",
    endDate: "2024-05-26",
  },
  {
    name: "AWS Canadian Grand Prix",
    location: "Circuit Gilles-Villeneuve",
    startDate: "2024-06-07",
    endDate: "2024-06-09",
  },
  {
    name: "Aramco Spanish Grand Prix",
    location: "Circuit de Barcelona-Catalunya",
    startDate: "2024-06-21",
    endDate: "2024-06-23",
  },
  {
    name: "Qatar Airways Austrian Grand Prix",
    location: "Red Bull Ring",
    startDate: "2024-06-28",
    endDate: "2024-06-30",
  },
  {
    name: "Qatar Airways British Grand Prix",
    location: "Silverstone Circuit",
    startDate: "2024-07-05",
    endDate: "2024-07-07",
  },
  {
    name: "Hungarian Grand Prix",
    location: "Hungaroring",
    startDate: "2024-07-19",
    endDate: "2024-07-21",
  },
  {
    name: "Rolex Belgian Grand Prix",
    location: "Circuit de Spa-Francorchamps",
    startDate: "2024-07-26",
    endDate: "2024-07-28",
  },
  {
    name: "Heineken Dutch Grand Prix",
    location: "Circuit Park Zandvoort",
    startDate: "2024-08-23",
    endDate: "2024-08-25",
  },
  {
    name: "Pirelli Italian Grand Prix",
    location: "Autodromo Nazionale Monza",
    startDate: "2024-08-30",
    endDate: "2024-09-01",
  },
  {
    name: "Qatar Airways Azerbaijan Grand Prix",
    location: "Baku City Circuit",
    startDate: "2024-09-13",
    endDate: "2024-09-15",
  },
  {
    name: "Singapore Airlines Singapore Grand Prix",
    location: "Marina Bay Street Circuit",
    startDate: "2024-09-20",
    endDate: "2024-09-22",
  },
  {
    name: "Pirelli United States Grand Prix",
    location: "Circuit of the Americas",
    startDate: "2024-10-18",
    endDate: "2024-10-20",
  },
  {
    name: "Mexico City Grand Prix",
    location: "Autodromo Hermanos Rodriguez",
    startDate: "2024-10-25",
    endDate: "2024-10-27",
  },
  {
    name: "Lenovo São Paulo Grand Prix",
    location: "Autodromo Jose Carlos Pace",
    startDate: "2024-11-01",
    endDate: "2024-11-03",
  },
  {
    name: "Heineken Las Vegas Grand Prix",
    location: "Las Vegas Street Circuit",
    startDate: "2024-11-21",
    endDate: "2024-11-24",
  },
  {
    name: "Qatar Airways Qatar Grand Prix",
    location: "Losail International Circuit",
    startDate: "2024-11-29",
    endDate: "2024-12-01",
  },
  {
    name: "Etihad Airways Abu Dhabi Grand Prix",
    location: "Yas Marina Circuit",
    startDate: "2024-12-06",
    endDate: "2024-12-08",
  },
];
