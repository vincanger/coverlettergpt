import { configureQueryClient } from '@wasp/queryClient';

export default async function mySetupFunction() {
  configureQueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
}
