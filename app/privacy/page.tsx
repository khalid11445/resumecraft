import LegalPage from "@/components/site/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        The details you type into the resume builder are used only to generate
        your resume. Payments are handled by our payment provider, and we do not
        see or store your card details.
      </p>
      <p>
        We do not sell your personal data. Contact us at
        your-email@example.com to ask about or delete your data.
      </p>
    </LegalPage>
  );
}