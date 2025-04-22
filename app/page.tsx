import Header from "@/app/_cross_project/ui_components/Header";
import Hexacodle from "@/app/_use_cases/Hexacodle/ui_components/Hexacodle";

export default function Home() {
  return (
    <>
      <Header />
      <div className="h-[calc(100dvh-48px)]">
        <Hexacodle />
      </div>
    </>
  );
}
