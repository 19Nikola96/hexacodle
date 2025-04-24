import Hexacodle from "@/app/_use_cases/Hexacodle/ui_components/Hexacodle";

export const revalidate = 0;

export default function Home() {
  return (
    <div className="h-[calc(100dvh-48px)]">
      <Hexacodle />
    </div>
  );
}
