import postInsight from "@/services/postInsight";
import ImageUpload from "./ImageUpload";
import InputField from "./InputField";
import { constructors } from "@/utils";

export default function NewInsight(lambdaPostImageFunctionUrl) {
  // const types = [
  //   "Free Practice 1",
  //   "Free Practice 2",
  //   "Free Practice 3",
  //   "Sprint",
  //   "Quali",
  //   "Race",
  //   "YouTube",
  //   "News",
  //   "Podcast",
  //   "Other",
  //   "LinkedIn",
  //   "Threads",
  // ];
  // ^ keeping for potential analysis of data pre 12/10/24

  const types = [
    "Business",
    "Cars",
    "Partnerships",
    "LinkedIn",
    "News",
    "Other",
    "Podcast",
    "Threads",
    "YouTube",
    "FP1",
    "FP2",
    "FP3",
    "Quali",
    "Race",
    "Rumors",
    "Sprint",
  ];

  // Sort the array above alphabetically
  const sortedTypes = types.sort();

  const teamsWithNotTeamSpecific = ["Not team-specific", ...constructors];

  return (
    <div>
      <ImageUpload lambdaPostImageFunctionUrl={lambdaPostImageFunctionUrl} />
      <form
        action={postInsight}
        // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms
        className="border-2 border-solid border-customOrangeLogo p-2 text-xs md:text-sm"
      >
        <InputField label="Title" name="title" required={true} />
        <InputField label="Link" name="link" required={true} />
        <InputField
          label="Image Link"
          name="imageLink"
          placeholder="Copy image link generated on image upload from above, providing no image link will display orange 'tldrlw' logo"
          required={true}
        />
        <InputField label="Image Credit" name="imageCredit" required={true} />
        <InputField
          label="Publication/Channel/Outlet"
          name="publicationOrChannelOrOutlet"
          required={true}
        />
        <InputField
          label="Author(s)/Participants"
          name="authorsOrParticipants"
          placeholder="If more than one, provide names followed by a comma (,)"
        />
        <div className="md:flex md:justify-between">
          <InputField
            label="Team"
            name="team"
            options={teamsWithNotTeamSpecific}
          />
          <InputField label="Type" name="type" options={sortedTypes} />
          <InputField label="AI-Assisted?" name="aiAssisted" type="checkbox" />
          <InputField label="Prod?" name="prod" type="checkbox" />
        </div>
        <div className="md:mt-2 md:flex md:justify-between">
          <InputField
            label="Additional Keyword 1"
            name="additionalKeyword1"
            required={true}
          />
          <InputField label="Additional Keyword 2" name="additionalKeyword2" />
          <InputField label="Additional Keyword 3" name="additionalKeyword3" />
        </div>
        <InputField label="Insight 1" name="insight1" required={true} />
        <InputField label="Insight 2" name="insight2" />
        <InputField label="Insight 3" name="insight3" />
        <InputField label="Insight 4" name="insight4" />
        <InputField label="Insight 5" name="insight5" />
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
