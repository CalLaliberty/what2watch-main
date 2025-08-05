// Componet Imports
import MainNavigation from "./ui/mainNavigation";
import MainFooter from "./ui/mainFooter";
import TrendingNow from "./components/MainPage/trendingNow";
import LandingComponent from "./components/MainPage/landingComponet";

export default function Home() {
  return (
    <div>
      <MainNavigation />
      <TrendingNow />
      <LandingComponent />
      <MainFooter />
    </div>
  );
}
