import { Unkey, verifyKey } from "@unkey/api";
import { toast } from "sonner";

const unkeyRootKey = process.env.NEXT_PUBLIC_UNKEY_ROOT_KEY;

if (!unkeyRootKey) {
  toast.error("API KEY System is not functional.", { richColors: true, duration: 5000 });
  throw new Error("API KEY System is not functional.");
}

// Check that the key is valid also.
async function isRootKeyValid() {
  const { result, error } = await verifyKey(unkeyRootKey!);

  if (error) {
    // handle potential network or bad request error
    // a link to our docs will be in the `error.docs` field
    console.error(error.message);
    toast.error("ROOT Key is invalid.", { richColors: true, duration: 5000 });
    return;
  }

  if (!result.valid) {
    // do not grant access
    return;
  }

  // process request
  // console.log(result);
}

// isRootKeyValid();

export const unkey = new Unkey({
  rootKey: unkeyRootKey,
  retry: {
    attempts: 5,
    backoff: (retryCount) => retryCount * 1000
  }
});
