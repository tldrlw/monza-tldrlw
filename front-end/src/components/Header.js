import Image from "next/image";

export default async function Header() {
  return (
    <div className=" bg-black md:py-12 py-6">
      <div className="container mx-auto">
        {/* ^ container will only apply to desktop viewports */}
        <Image
          src="https://monza-tldrlw-images.s3.amazonaws.com/logos/logo-no-background.svg"
          // src="https://monza-tldrlw-images.s3.amazonaws.com/logos/logo-white.svg"
          alt="tldrlw logo"
          className="w-3/4 md:w-1/3"
          priority
          width={500}
          height={125}
        />
      </div>
    </div>
  );
}

// Use Tailwind’s w- and h- classes to define the width and height of the image.
// You can also use percentage values like w-1/2 for half the width, or specific pixel sizes like w-32 for 128px width.
// w-32: Sets the width of the image to 128px.
// h-auto: Automatically adjusts the height to maintain the aspect ratio of the image.
// You can adjust the w-32 class to other values like w-24 (96px), w-48 (192px), or even use percentage values like w-1/2 to make it 50% of the container width.
