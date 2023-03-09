import { ChakraProvider, VStack } from "@chakra-ui/react";
import { theme } from "./theme";
import { ReactNode } from "react";
import NavBar from "./components/NavBar";
import { CallToAction } from "./components/CallToAction";

export default function App({
    children,
    user
}: {
    children: ReactNode;
    user: any;
}) {
    return (
        <ChakraProvider theme={theme}>
            <NavBar />
            <VStack gap={5}>
                {children}
                <CallToAction />
            </VStack>
        </ChakraProvider>
    );
}
