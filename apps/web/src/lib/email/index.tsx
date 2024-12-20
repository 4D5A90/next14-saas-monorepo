import "server-only";

import { EmailVerificationTemplate } from "./templates/email-verification";
import { ResetPasswordTemplate } from "./templates/reset-password";
import { render } from "@react-email/render";
import { env } from "@/env";
import { EMAIL_SENDER } from "@/lib/constants";
import { createTransport, type TransportOptions } from "nodemailer";
import type { ComponentProps } from "react";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import SMTPConnection from "nodemailer/lib/smtp-connection";

export enum EmailTemplate {
  EmailVerification = "EmailVerification",
  PasswordReset = "PasswordReset",
}

export type PropsMap = {
  [EmailTemplate.EmailVerification]: ComponentProps<typeof EmailVerificationTemplate>;
  [EmailTemplate.PasswordReset]: ComponentProps<typeof ResetPasswordTemplate>;
};

const getEmailTemplate = <T extends EmailTemplate>(template: T, props: PropsMap[NoInfer<T>]) => {
  switch (template) {
    case EmailTemplate.EmailVerification:
      return {
        subject: "Verify your email address",
        body: render(
          <EmailVerificationTemplate {...(props as PropsMap[EmailTemplate.EmailVerification])} />,
        ),
      };
    case EmailTemplate.PasswordReset:
      return {
        subject: "Reset your password",
        body: render(
          <ResetPasswordTemplate {...(props as PropsMap[EmailTemplate.PasswordReset])} />,
        ),
      };
    default:
      throw new Error("Invalid email template");
  }
};

const smtpConfig: SMTPConnection.Options = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: process.env.NODE_ENV === "production",
  ignoreTLS: process.env.NODE_ENV !== "production",
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
};

const transporter = createTransport(smtpConfig);

export const sendMail = async <T extends EmailTemplate>(
  to: string,
  template: T,
  props: PropsMap[NoInfer<T>],
) => {
  const isSMTPConfigured = await transporter.verify();

  if (!isSMTPConfigured) {
    throw new Error("SMTP configuration is invalid");
  }

  const { subject, body } = getEmailTemplate(template, props);

  const emailSent = await transporter.sendMail({ from: EMAIL_SENDER, to, subject, html: body });

  if (env.NODE_ENV !== "production") {
    console.log("📨 Email sent to:", to, "with template:", template, "and props:", props);
    console.log({ smtpConfig, emailSent });
  }

  return emailSent;
};
