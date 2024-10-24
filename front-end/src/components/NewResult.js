import InputField from "./InputField";
import { drivers, races } from "@/utils";
import postResult from "@/services/postResult";

export default function NewResult() {
  const types = ["Quali", "Race", "Sprint"];

  const driverNames = drivers.map((driver) => driver.name);
  const driverNamesWithNA = ["N/A", ...driverNames];
  // If you want to keep driverNames unchanged and create a new array, you can use the spread operator
  // If you want to avoid modifying the original array and create a new one, use the spread operator (...)

  function lastRaceAndFutureRaces() {
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    // Get the last race that ended within the last 7 days
    const lastRace = races
      .filter((race) => {
        const endDate = new Date(race.endDate);
        return endDate <= currentDate && endDate >= sevenDaysAgo;
      })
      .pop(); // Get the most recent race within the range
    // Get all future races
    const futureRaces = races.filter(
      (race) => new Date(race.endDate) > currentDate,
    );
    // Combine the last race (if it exists) with future races
    const combinedRaces = lastRace
      ? [lastRace, ...futureRaces]
      : [...futureRaces];
    // Sort the races chronologically by startDate
    const sortedRaces = combinedRaces.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate),
    );
    return sortedRaces.map((race) => race.name);
  }

  const positions = Array.from({ length: 20 }, (_, i) => i + 1); // Array of numbers 1-20

  return (
    <div>
      <form
        action={postResult}
        // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms
        className="my-2 border-2 border-solid border-customOrangeLogo p-2 text-xs md:text-sm"
      >
        <InputField
          label="Race"
          name="race"
          options={lastRaceAndFutureRaces()}
        />
        <div className="md:flex md:justify-between">
          <InputField label="Type" name="type" options={types} />
          <InputField
            label="Fastest Lap"
            name="fastestLap"
            options={driverNamesWithNA}
          />
          <InputField
            label="Driver of the Day"
            name="driverOfTheDay"
            options={driverNamesWithNA}
          />
        </div>
        {/* Loop through positions and render a driver input next to each */}
        <div className="mt-4 md:mt-2">
          {positions.map((position, index) => (
            <div
              key={index}
              className="my-2 flex justify-between border-2 border-dotted border-gray-300 p-2"
            >
              {/* Static position value */}
              <div className="ml-2 mt-4 font-bold">{position}</div>
              {/* Driver input field next to the position */}
              <div>
                <InputField name={`driver-${position}`} options={driverNames} />
              </div>
              <div className="mr-2 mt-2">
                <InputField
                  label="DNF?"
                  name={`dnf-${position}`}
                  type="checkbox"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="my-2 rounded-md bg-customOrangeLogo px-4 py-2 font-medium text-white transition duration-200 hover:bg-black"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
