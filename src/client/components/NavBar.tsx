import { useAuth } from "wasp/client/auth";
import {
  HStack,
  Heading,
  Button,
  Link,
  Spacer,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Text,
  StackProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { MdWorkOutline } from 'react-icons/md';
import { AiOutlineMenu } from 'react-icons/ai';
import { useRef } from 'react';
import ThemeSwitch from './ThemeSwitch';

export default function NavBar() {
  const { data: user } = useAuth();

  const gptTextColor = useColorModeValue('purple.500', 'white');
  const borderColor = useColorModeValue('purple.300', 'purple.100');

  return (
    <HStack
      as='nav'
      align='center'
      justify='between'
      px={7}
      py={4}
      top={0}
      width='full'
      position='sticky'
      backdropFilter='blur(5px)'
      borderBottom='md'
      borderColor={borderColor}
      filter='drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.25))'
      color='text-contrast-lg'
      zIndex={99}
    >
      <HStack width='full' px={1} gap={3} align='center' justify='space-between'>
        <Link as={RouterLink} to='/'>
          <HStack gap={0}>
            <Heading size='md' color={'text-contrast-md'}>
              CoverLetter
            </Heading>
            <Heading size='md' color={gptTextColor}>
              GPT
            </Heading>
          </HStack>
        </Link>
        <Spacer />
        <ThemeSwitch />

        {user ? (
          <>
            <NavButton icon={<MdWorkOutline />} to='/jobs'>
              Jobs Dashboard
            </NavButton>
            <Spacer maxW='3px' />
            <NavButton icon={<CgProfile />} to='/profile'>
              Account
            </NavButton>
            <MobileButton icon={<AiOutlineMenu />} isUser={true}>
              Menu
            </MobileButton>
          </>
        ) : (
          <>
            <NavButton icon={<CgProfile />} to='/login'>
              Login
            </NavButton>
            <MobileButton icon={<AiOutlineMenu />} isUser={false}>
              Menu
            </MobileButton>
          </>
        )}
      </HStack>
    </HStack>
  );
}

interface NavButtonProps extends StackProps {
  children: React.ReactNode;
  icon: React.ReactElement;
  to: string;
  props?: StackProps;
}

function NavButton({ children, icon, to, ...props }: NavButtonProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  function removeFocus() {
    if (linkRef.current) {
      linkRef.current.blur();
    }
  }

  return (
    <Link as={RouterLink} to={to} display={['none', 'block']} ref={linkRef} onClick={removeFocus}>
      <HStack {...props}>
        {icon}
        <Text>{children}</Text>
      </HStack>
    </Link>
  );
}

function MobileButton({
  children,
  icon,
  isUser,
}: {
  children: React.ReactNode;
  icon: React.ReactElement;
  isUser?: boolean;
}) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label={children as string}
        leftIcon={icon}
        display={['block', 'none']}
        size='md'
        border='md'
        _hover={{
          border: 'md',
          borderColor: 'rgba(255, 250, 240, 0.55)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {children}
      </MenuButton>
      <MenuList bgColor='gray.900'>
        {isUser ? (
          <>
            <Link as={RouterLink} to={`/jobs`}>
              <MenuItem>Jobs Dashboard</MenuItem>
            </Link>
            <Link as={RouterLink} to={`/profile`}>
              <MenuItem>Account</MenuItem>
            </Link>
          </>
        ) : (
          <>
            <Link as={RouterLink} to='/login'>
              <MenuItem>Login</MenuItem>
            </Link>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
