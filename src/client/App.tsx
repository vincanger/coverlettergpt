import { ChakraProvider, VStack } from "@chakra-ui/react";
import { theme } from "./theme";
import { ReactNode } from "react";
import NavBar from "./components/NavBar";

export default function App({ children, user }: { children: ReactNode, user: any }) {
  return (
    <ChakraProvider theme={theme}>
      <NavBar />
      <VStack>
        {children}
      </VStack>
    </ChakraProvider>
  );
}