import "./globals.css";
import {
  // Lato,
  // Chakra_Petch,
  // Dosis,
  // Titillium_Web,
  IBM_Plex_Mono,
} from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfigureAmplifyClientSide from "@/app/amplify-cognito-config";

// test

export const metadata = {
  title: "Monza - Formula One News and Insights",
  description:
    "Discover the latest Formula One news, fan content, podcasts, YouTube videos, and in-depth insights on all things F1.",
};

// const lato = Lato({ weight: "400", subsets: ["latin"] });
// https://fonts.google.com/specimen/Lato
// const chakraPetch = Chakra_Petch({ weight: "400", subsets: ["latin"] });
// const dosis = Dosis({ weight: "400", subsets: ["latin"] });
// const titilliumWeb = Titillium_Web({ weight: "400", subsets: ["latin"] });
const iBMPlexMono = IBM_Plex_Mono({ weight: "400", subsets: ["latin"] });
// https://nextjs.org/docs/pages/api-reference/components/font#weight
// https://nextjs.org/docs/pages/api-reference/components/font#subsets

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${iBMPlexMono.className} flex min-h-screen flex-col`}>
        <Header />
        <main className="container mx-auto flex-grow">
          <ConfigureAmplifyClientSide></ConfigureAmplifyClientSide>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

// keeping the footer at the bottom:
// •	min-h-screen: Ensures that the body element takes up at least the full height of the viewport.
// •	flex: Turns the body into a Flexbox container.
// •	flex-col: Makes the body a column-based Flexbox layout, stacking the header, content, and footer vertically.
// •	flex-grow: Applied to the main content (children), this makes the main content grow to fill the available space between the header and footer.
// •	Footer: It stays at the bottom since the main content takes up the rest of the space.
// With this layout, the footer will always be pushed to the bottom, even when there is not enough content to fill the page.
