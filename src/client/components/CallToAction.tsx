import { VStack, Button, Text, Link } from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";

export function CallToAction() {
    return (
        <VStack width={["sm", "lg", "xl"]} mt={10} textAlign="center" gap={4}>
            <Text color="text-contrast-sm" fontSize="sm">
                This is a work in progress, but I'm planning to add lots more features and open source this project soon! 
                If you're interested in how I built the app, <Link href='https://wasp-lang.notion.site/How-I-Built-CoverLetterGPT-67df0ca8c03e48b3a6247d600a38311d' color='purple.300' target='_blank' textDecoration='underline'>go here</Link>. 
                If you're interested in keeping up to date... 
            </Text>
            <Button colorScheme="twitter" leftIcon={<FaTwitter />} size="sm">
                <a href="https://twitter.com/hot_town" target="_blank">
                    Follow me @hot_town
                </a>
            </Button>
        </VStack>
    );
}
