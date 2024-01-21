import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface InviteUserEmailProps {
  firstname?: string;
  invitedByFirstname?: string;
  orgName?: string;
  inviteLink?: string;
}

export const InviteUserEmail = ({
  firstname,
  invitedByFirstname,
  orgName,
  inviteLink,
}: InviteUserEmailProps) => {
  const previewText = `Rejoins ${orgName} sur Medixi`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Rejoins <strong>{orgName}</strong> sur <strong>Medixi</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Bonjour {firstname},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{invitedByFirstname}</strong> t'a invité à rejoindre{" "}
              <strong>{orgName}</strong> sur
              <strong> Medixi</strong>.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[14px] font-semibold no-underline text-center px-5 py-5"
                href={inviteLink}
              >
                Rejoindre {orgName}
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              ou copiez et collez cette URL dans votre navigateur:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Si vous avez des questions ou besoin d'aide, écrivez-nous à
              support@medixi.com
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InviteUserEmail;
