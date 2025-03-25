import Button from "@/components/ui/button";

export default function ButtonGroup() {
  return (
    <div className="flex p-8 gap-2">
      <Button link="/community" secondary className="flex-grow justify-center">
        취소
      </Button>
      <Button link="/" primary className="flex-grow justify-center">
        등록
      </Button>
    </div>
  );
}
