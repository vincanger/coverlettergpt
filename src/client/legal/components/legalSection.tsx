import { ReactNode } from 'react';
import { Heading, Text } from '@chakra-ui/react';

type LegalSectionProps = {
  title: string;
  children: ReactNode;
  id?: string;
};

const LegalSection = ({ title, children, id }: LegalSectionProps) => {
  return (
    <section id={id}>
      <Heading as='h2' size='sm' mb={2}>{title}</Heading>
      <Text>{children}</Text>
    </section>
  );
};

export default LegalSection;
