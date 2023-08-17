import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { BsMoonStars, BsSun } from 'react-icons/bs';

const ThemeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      {colorMode === 'dark' ? (
        <BsSun id='theme' key={colorMode} onClick={toggleColorMode} />
      ) : (
        <BsMoonStars id='theme' key={colorMode} onClick={toggleColorMode} />
      )}
    </>
  );
};

export default ThemeSwitch;
