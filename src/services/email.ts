import { Resend } from "resend";

const resend = new Resend("re_S848uW4B_2xxkr3LzZsAoJibZw1FAErvu");

interface IEmailParams {
  to: string;
  subject: string;
  react: any;
}

export const sendEmail = async ({ to, subject, react }: IEmailParams) =>
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: [to],
    subject,
    react,
  });
