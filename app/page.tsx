

// Componet Imports 
import MainNavigation from "./ui/mainNavigation";
import LandingComponent from "./components/MainPage/landingComponet";
import MainFooter from "./ui/mainFooter";

export default function Home() {
  return (
    <div>
      <MainNavigation />
      <LandingComponent />
      <MainFooter />
    </div>
  );
}
