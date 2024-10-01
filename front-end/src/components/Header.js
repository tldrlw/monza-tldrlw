import Image from "next/image";
import resizeImage from "@/utils/resizeImage";

export default async function Header() {
  const logoDimensions = await resizeImage(
    "https://monza-tldrlw-images.s3.amazonaws.com/logos/logo-no-background.svg",
    0.5
  );

  return (
    <main>
      <div>
        <div className="mx-auto bg-customBlueLogo px-4 pt-4 md:p-8">
          <Image
            src="https://monza-tldrlw-images.s3.amazonaws.com/logos/logo-no-background.svg"
            alt="tldrlw logo"
            className="h-auto w-1/2 md:w-1/4"
            priority
            width={logoDimensions.width}
            height={logoDimensions.height}
          />
        </div>
      </div>
    </main>
  );
}

// Use Tailwind’s w- and h- classes to define the width and height of the image.
// You can also use percentage values like w-1/2 for half the width, or specific pixel sizes like w-32 for 128px width.
// w-32: Sets the width of the image to 128px.
// h-auto: Automatically adjusts the height to maintain the aspect ratio of the image.
// You can adjust the w-32 class to other values like w-24 (96px), w-48 (192px), or even use percentage values like w-1/2 to make it 50% of the container width.
