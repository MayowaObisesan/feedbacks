import { Skeleton } from "@heroui/skeleton";
import { Spacer } from "@heroui/spacer";

import { capitalize } from "@/utils";

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
      <Skeleton className="rounded-full" isLoaded={isLoaded}>
        <p className="font-semibold text-default-600 text-small">
          {Number(data).toString()}
        </p>
      </Skeleton>
      <p className=" text-default-600 text-small">
        {Number(data) === 1 ? capitalize(textSingular) : capitalize(textPlural)}
      </p>
    </>
  );
}

export function DotSpacer() {
  return (
    <>
      <Spacer x={1} />
      <div className="size-1.5 bg-foreground-400 rounded-full" />
      <Spacer x={1} />
    </>
  );
}

export function DotSpacerSmall() {
  return (
    <>
      <Spacer x={1} />
      <div className="size-1 bg-foreground-400 rounded-full" />
      <Spacer x={1} />
    </>
  );
}
