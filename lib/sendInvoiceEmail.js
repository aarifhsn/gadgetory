import { transporter } from "./email";

export async function sendInvoiceEmail({ to, subject, html, attachments }) {
  await transporter.sendMail({
    from: `"Gadgets BD" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
}
