import Button from "@/components/ui/button";

export default function Buttons() {
  return (
    <div className="flex pt-6 px-4 pb-3 gap-2">
      <Button link="/community" className="p-20">
        취소
      </Button>
      <Button>등록</Button>
    </div>
  );
}
