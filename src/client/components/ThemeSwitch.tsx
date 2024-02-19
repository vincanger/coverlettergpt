import { Button, useColorMode } from '@chakra-ui/react';
import { FC } from 'react';
import { BsMoonStars, BsSun } from 'react-icons/bs';

const ThemeSwitch: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button mr='3' border='1px' borderColor='border-contrast-sm' p='1' size='xs'>
      {colorMode === 'dark' ? (
        <BsSun id='theme' key={colorMode} onClick={toggleColorMode} />
      ) : (
        <BsMoonStars id='theme' key={colorMode} onClick={toggleColorMode} />
      )}
    </Button>
  );
};

export default ThemeSwitch;
