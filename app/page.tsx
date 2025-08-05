// Componet Imports
import MainNavigation from "./ui/mainNavigation";
import MainFooter from "./ui/mainFooter";
import LandingComponent from "./components/MainPage/landingComponet";

export default function Home() {
  return (
    <div>
      <MainNavigation />
      <LandingComponent />
      <MainFooter />
    </div>
  );
}
