import { Box, HStack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { NumberInput, NumberInputField, Center } from "@chakra-ui/react";
import AppContext from "src/context/AppContext";

const CommandListManager = () => {
    const { commandList } = useContext(AppContext);
    //console.log(commandList);

    return (
        <Box flex={1}>
            {commandList.map((cmd, i) => (
                <HStack key={i}>
                    <Center w={6} px={1}>
                        {cmd.type}
                    </Center>
                    <HStack>
                        {cmd?.coords?.map((c, j) => (
                            <Box key={j}>
                                <NumberInput size="xs" value={c} w={10}>
                                    <NumberInputField p={0} />
                                </NumberInput>
                            </Box>
                        ))}
                    </HStack>
                </HStack>
            ))}
        </Box>
    );
};

export default CommandListManager;
