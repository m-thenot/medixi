import { Resend } from "resend";

const resend = new Resend("re_5ns3pAeP_6suixqNrriZqyrj7MutoACnv");

interface IEmailParams {
  to: string;
  subject: string;
  react: any;
}

export const sendEmail = async ({ to, subject, react }: IEmailParams) =>
  await resend.emails.send({
    from: "Medixi <support@prestime.pro>",
    to: [to],
    subject,
    react,
  });
