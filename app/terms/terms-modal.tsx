"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface TermsModalProps {
  service: "ambulance" | "doctor" | "lab" | "health-plan";
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const termsContent = {
  ambulance: {
    title: "Terms & Conditions for Ambulance Service",
    sections: [
      {
        title: "1. Service Agreement",
        content:
          "By requesting ambulance services, you agree to pay all applicable charges including base fare, per-kilometer charges (₹50-75/km), waiting time charges (₹100 per 15 minutes after first 30 minutes), and any medical supplies used during transport.",
      },
      {
        title: "2. Medical Consent",
        content:
          "You consent to emergency medical assessment, basic life support, oxygen administration, cardiac monitoring, IV fluid administration, and transportation to the nearest appropriate medical facility. In case of unconscious patient, this consent is presumed as per Good Samaritan laws.",
      },
      {
        title: "3. Liability Waiver",
        content:
          "HealthMitra and its partner ambulance providers are not liable for: delays caused by traffic, weather, natural disasters, or road conditions; deterioration of patient condition during transport; refusal of admission by hospitals; or any pre-existing conditions. We will make best efforts to reach you within stated response times (8-12 minutes in metro cities).",
      },
      {
        title: "4. Insurance & Payment",
        content:
          "Ambulance charges are your responsibility unless fully covered by your insurance policy. Cashless facility is available only with 20+ partnered insurers. Payment is due immediately upon service completion or admission to hospital. We accept UPI, cards, cash, and insurance cards.",
      },
      {
        title: "5. Cancellation Policy",
        content:
          "• Cancellation within 2 minutes of booking: No charges\n• Cancellation after ambulance dispatch: 50% of base fare (₹400-600)\n• Cancellation after arrival at pickup location: Full base fare (₹800-1500)\n• No-show when ambulance arrives: Full fare + waiting charges\n• Cancellation by HealthMitra due to safety concerns: No charges",
      },
      {
        title: "6. Data Privacy & Location Tracking",
        content:
          "Your real-time location is shared only with dispatched ambulance crew for navigation purposes. Location history is deleted after 24 hours. Medical information shared is protected under applicable privacy laws (HIPAA equivalent standards).",
      },
      {
        title: "7. Right to Refuse Service",
        content:
          "Ambulance crew may refuse transport if: patient is violent or abusive; patient has infectious disease without proper protective equipment; requested destination is beyond service area (50km limit); ambulance is not medically equipped for patient's condition (e.g., requires ventilator when ALS not available).",
      },
      {
        title: "8. Patient Responsibility",
        content:
          "You must provide accurate medical history, current medications, allergies, and any infectious conditions. False information may void coverage and incur additional charges. For minors or unconscious patients, accompanying guardian assumes responsibility.",
      },
    ],
  },
  doctor: {
    title: "Terms & Conditions for Doctor Consultation",
    sections: [
      {
        title: "1. Consultation Agreement",
        content:
          "By booking a consultation, you agree to pay the consultation fee (₹300-1500 depending on doctor). Fees are non-refundable if cancellation is less than 2 hours before appointment. No-show appointments are charged 100% of fee.",
      },
      {
        title: "2. Teleconsultation Terms",
        content:
          "You confirm that you have a stable internet connection (minimum 2 Mbps). Video consultations are recorded for quality and training purposes with your consent. Prescriptions issued are valid as per Telemedicine Practice Guidelines 2023. Emergency conditions will be referred to physical consultation.",
      },
      {
        title: "3. Medical Disclaimer",
        content:
          "Online consultations are not replacements for physical examination. Doctors cannot perform physical assessments, vital checks, or certain diagnostic procedures. For emergencies (chest pain, breathing difficulty, severe bleeding, loss of consciousness), please call 108 or visit nearest hospital immediately.",
      },
      {
        title: "4. Prescription Policy",
        content:
          "E-prescriptions are digitally signed and valid across India. Schedule H and X drugs cannot be prescribed via teleconsultation. Controlled substances require physical consultation. Prescriptions are available for download for 30 days.",
      },
      {
        title: "5. Cancellation & Refund",
        content:
          "• Cancellation 24+ hours before: 100% refund\n• Cancellation 2-24 hours before: 50% refund\n• Cancellation less than 2 hours: No refund\n• Doctor cancels: 100% refund + free rescheduling\n• Refunds processed within 5-7 business days",
      },
      {
        title: "6. Follow-up Policy",
        content:
          "Follow-up consultations within 7 days get 30% discount if with same doctor. Free text follow-up via WhatsApp is available for 48 hours after consultation for minor clarifications (not for diagnosis).",
      },
    ],
  },
  lab: {
    title: "Terms & Conditions for Lab Tests",
    sections: [
      {
        title: "1. Service Agreement",
        content:
          "Home sample collection is available within 10km of partner labs. Collection timings: 6 AM - 8 PM. Phlebotomist will carry government ID. You must provide accurate patient information and medical history including bleeding disorders or needle phobia.",
      },
      {
        title: "2. Fasting & Preparation",
        content:
          "You are responsible for following test preparation instructions (fasting, medication hold, etc.) sent via SMS/Email. Failure to comply may result in inaccurate results or need for re-collection (additional charges apply).",
      },
      {
        title: "3. Report Delivery",
        content:
          "• Routine tests: 6-12 hours\n• Specialized tests: 24-72 hours\n• Genetic/Histopathology: 3-7 days\n• Reports are preliminary until digitally signed by pathologist\n• Physical copies available for ₹99 shipping fee",
      },
      {
        title: "4. Quality Guarantee",
        content:
          "All partner labs are NABL accredited or ISO 15189 certified. In case of report errors due to lab negligence, free re-testing at different lab is provided. However, we are not liable for treatment decisions based on reports.",
      },
      {
        title: "5. Cancellation & Rescheduling",
        content:
          "• Free cancellation up to 2 hours before collection\n• Free rescheduling anytime\n• After phlebotomist dispatch: ₹100 cancellation fee\n• After sample collection: No cancellation, payment forfeited\n• Refunds: 5-7 business days",
      },
      {
        title: "6. Sample Storage & Disposal",
        content:
          "Biological samples are stored for 7 days for possible re-testing, then disposed as per biomedical waste rules. You can request sample destruction within 24 hours of collection.",
      },
    ],
  },
  "health-plan": {
    title: "Terms & Conditions for Health Plans",
    sections: [
      {
        title: "1. Subscription Agreement",
        content:
          "Plans are monthly or annual auto-renewing subscriptions. Billing occurs on same date each month/year. First payment is charged immediately. Plans activate within 24 hours of payment confirmation.",
      },
      {
        title: "2. Coverage Details",
        content:
          "• Basic (₹199/mo): 2 OPD consultations, 10% lab discount\n• Plus (₹499/mo): Unlimited consultations, 25% lab discount, 1 dependent\n• Prime (₹999/mo): Family of 4, 5000+ network hospitals, free ambulance (2/year)\n• Wellness rewards expire 6 months after earning",
      },
      {
        title: "3. Cancellation & Refund",
        content:
          "• Monthly plans: Cancel anytime, effective next billing cycle\n• Annual plans: 30-day money-back guarantee (if no claims made)\n• After 30 days: Pro-rata refund minus 2 months' fees\n• No refund for partial months\n• Cancellation processes within 24 hours",
      },
      {
        title: "4. Claim Process",
        content:
          "Cashless claims: Show HealthMitra card at network hospitals. Reimbursement: Upload bills within 30 days of discharge. Processing time: 48 hours for documentation, insurer takes 7-15 days. False claims result in permanent ban.",
      },
      {
        title: "5. Fair Usage Policy",
        content:
          "• Max 12 consultations per year per condition\n• Ambulance: Max 2 per year for Prime\n• Lab discounts: Max ₹5000 per month\n• Abuse (excessive usage) may result in plan review",
      },
      {
        title: "6. Automatic Renewal",
        content:
          "Plans auto-renew unless cancelled 48+ hours before renewal date. You will receive reminder 7 days and 24 hours before renewal. Failed payments have 5-day grace period before service suspension.",
      },
    ],
  },
};

export function TermsModal({
  service,
  isOpen,
  onClose,
  onAgree,
}: TermsModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const content = termsContent[service];

  if (!isOpen) return null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    if (isBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900">{content.title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto space-y-4 text-sm"
          onScroll={handleScroll}
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-amber-800 text-xs">
              ⚠️ Please read carefully. These terms affect your legal rights.
              Last updated: January 15, 2024
            </p>
          </div>

          {content.sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-slate-800 mb-2">{section.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          <div className="bg-slate-50 rounded-lg p-4 mt-4">
            <p className="text-slate-700 text-xs">
              By clicking "I Understand & Agree", you confirm that you have
              read, understood, and agree to be bound by these Terms &
              Conditions. You also consent to electronic communications and
              agree to our Privacy Policy and Data Processing terms.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button
            onClick={onAgree}
            disabled={!hasScrolledToBottom}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              hasScrolledToBottom
                ? "bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {hasScrolledToBottom
              ? "I Understand & Agree"
              : "Please read to the bottom to agree"}
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">
            You must scroll to the end to enable agreement
          </p>
        </div>
      </div>
    </div>
  );
}
