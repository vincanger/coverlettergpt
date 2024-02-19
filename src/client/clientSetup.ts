import { configureQueryClient } from "wasp/client/operations";

export default async function mySetupFunction() {
  configureQueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
}
