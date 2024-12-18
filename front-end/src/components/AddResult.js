import InputField from "./InputField";
import { drivers, races } from "@/utils";
import postResult from "@/services/postResult";

// Utility function to get race options
export function lastRaceAndFutureRaces(races) {
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  // Get the last race that ended within the last 7 days
  const lastRace = races
    .filter((race) => {
      const endDate = new Date(race.endDate);
      return endDate <= currentDate && endDate >= sevenDaysAgo; // Race must have ended within the past 7 days
    })
    .pop(); // Get the most recent race within the range

  // Get all future races
  const futureRaces = races.filter(
    (race) => new Date(race.endDate) > currentDate, // Race ends after today's date
  );

  // Combine the last race (if it exists) with future races
  const combinedRaces = lastRace
    ? [lastRace, ...futureRaces] // Include last race if found
    : [...futureRaces]; // Otherwise, just future races

  // Sort the races chronologically by start date
  const sortedRaces = combinedRaces.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate), // Ascending order by start date
  );

  return {
    raceNames: sortedRaces.map((race) => race.name), // Return an array of race names
    isEndOfSeason: combinedRaces.length === 0, // No races left in the season
  };
}

export default function AddResult() {
  // Options for the "Type" dropdown
  const types = ["Quali", "Race", "Sprint"];

  // List of all driver names
  const driverNames = drivers.map((driver) => driver.name);

  // Add an "N/A" option to the driver names list
  const driverNamesWithNA = ["N/A", ...driverNames];

  // Generate an array of positions (1-20)
  const positions = Array.from({ length: 20 }, (_, i) => i + 1);

  // Call utility function to get race names and season status
  const { raceNames, isEndOfSeason } = lastRaceAndFutureRaces(races);

  return (
    <div>
      <form
        action={postResult} // Handle the form submission using server actions
        // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms
        className="my-2 border-2 border-solid border-customOrangeLogo p-2 text-xs md:text-sm"
      >
        {/* Race selection dropdown */}
        <InputField
          label="Race"
          name="race"
          options={isEndOfSeason ? ["No races available"] : raceNames} // Show "No races available" if the season has ended
        />

        {/* Dropdowns for Type, Fastest Lap, and Driver of the Day */}
        <div className="md:flex md:justify-between">
          <InputField label="Type" name="type" options={types} />
          <InputField
            label="Fastest Lap"
            name="fastestLap"
            options={driverNamesWithNA} // Include "N/A" option
          />
          <InputField
            label="Driver of the Day"
            name="driverOfTheDay"
            options={driverNamesWithNA} // Include "N/A" option
          />
        </div>

        {/* Loop through positions and render input fields for each */}
        <div className="mt-4 md:mt-2">
          {positions.map((position, index) => (
            <div
              key={index} // Use index as the key since positions are unique
              className="my-2 flex justify-between border-2 border-dotted border-gray-300 p-2"
            >
              {/* Static position value */}
              <div className="ml-2 mt-4 font-bold">{position}</div>

              {/* Dropdown for selecting a driver */}
              <div>
                <InputField name={`driver-${position}`} options={driverNames} />
              </div>

              {/* Checkbox for DNF status */}
              <div className="mr-2 mt-2">
                <InputField
                  label="DNF?" // Label for the checkbox
                  name={`dnf-${position}`} // Unique name for each position's checkbox
                  type="checkbox" // Checkbox input type
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`my-2 rounded-md px-4 py-2 font-medium text-white transition duration-200 ${
              isEndOfSeason
                ? "cursor-not-allowed bg-gray-400"
                : "bg-customOrangeLogo hover:bg-black"
            }`}
            disabled={isEndOfSeason} // Disables the button functionality
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
