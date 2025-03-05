import { capitalize } from "@/utils";
import { Skeleton } from "@nextui-org/skeleton";
import { Spacer } from "@nextui-org/spacer";

interface I_FollowersText {
  isLoaded: boolean;
  data: any;
  textSingular: string;
  textPlural: string;
}

export function DynamicText({
  isLoaded,
  data,
  textSingular,
  textPlural,
}: I_FollowersText) {
  return (
    <>
      <Skeleton isLoaded={isLoaded} className="rounded-full">
        <p className="font-semibold text-default-400 text-small">
          {Number(data).toString()}
        </p>
      </Skeleton>
      <p className=" text-default-400 text-small">
        {Number(data) === 1 ? capitalize(textSingular) : capitalize(textPlural)}
      </p>
    </>
  );
}

export function DotSpacer() {
  return (
    <>
      <Spacer x={1} />
      <div className="size-1.5 bg-foreground-400 rounded-full"></div>
      <Spacer x={1} />
    </>
  );
}
