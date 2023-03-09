import { VStack, Button, Text } from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";

export function CallToAction() {
    return (
        <VStack width={["sm", "lg", "xl"]} mt={10} textAlign="center" gap={4}>
            <Text color="text-contrast-sm" fontSize="sm">
                I'm planning to open source this project soon. If you're
                interested in following along, you can follow me on Twitter.
            </Text>
            <Button colorScheme="twitter" leftIcon={<FaTwitter />} size="sm">
                <a href="https://twitter.com/hot_town" target="_blank">
                    Follow me @hot_town
                </a>
            </Button>
        </VStack>
    );
}
