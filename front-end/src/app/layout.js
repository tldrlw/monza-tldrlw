import "./globals.css";
import {
  Lato,
  Chakra_Petch,
  Dosis,
  Titillium_Web,
  IBM_Plex_Mono,
} from "next/font/google";

export const metadata = {
  title: "Monza - F0rmu1a 0ne news and insights",
  description:
    "F0rmu1a 0ne media and fan content coverage (news articles, podcasts, YouTube videos, etc.) insights",
};

const lato = Lato({ weight: "400", subsets: ["latin"] });
// https://fonts.google.com/specimen/Lato
const chakraPetch = Chakra_Petch({ weight: "400", subsets: ["latin"] });
const dosis = Dosis({ weight: "400", subsets: ["latin"] });
const titilliumWeb = Titillium_Web({ weight: "400", subsets: ["latin"] });
const iBMPlexMono = IBM_Plex_Mono({ weight: "400", subsets: ["latin"] });
// https://nextjs.org/docs/pages/api-reference/components/font#weight
// https://nextjs.org/docs/pages/api-reference/components/font#subsets

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={iBMPlexMono.className}>{children}</body>
    </html>
  );
}
