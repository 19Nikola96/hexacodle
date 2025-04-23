import Hexacodle from "@/app/_use_cases/Hexacodle/ui_components/Hexacodle";

export default function Unlimited() {
  return (
    <div className="h-[calc(100dvh-48px)]">
      <Hexacodle isUnlimited={true} />
    </div>
  );
}
