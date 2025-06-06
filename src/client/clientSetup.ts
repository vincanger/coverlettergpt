//import { configureQueryClient } from "wasp/client/operations";

//export default async function mySetupFunction() {
//  configureQueryClient({
//    defaultOptions: {
//      queries: {
//        refetchOnWindowFocus: false,
 //     },
 //   },
 // });
//}
// Simplified clientSetup - let Wasp handle QueryClient setup
export default function clientSetup() {
  // Add any other client-side setup here
  // Remove any QueryClient initialization as Wasp handles this automatically
  console.log('Client setup completed');
}
