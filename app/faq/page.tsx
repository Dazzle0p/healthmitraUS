"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: string;
  order: number;
}

// Static FAQ data as fallback when database is empty
const staticFAQs: FAQ[] = [
  // General Questions
  {
    id: "faq_general_1",
    question: "What is HealthMitra and how does it work?",
    answer:
      "HealthMitra is a comprehensive healthcare platform that connects you with qualified doctors, diagnostic labs, and ambulance services. Simply sign up on our website or app, choose the service you need (consultation, lab tests, ambulance, etc.), and get connected instantly. You can book appointments, schedule teleconsultations, or request home visits based on your convenience.",
    category: "General",
    status: "active",
    order: 1,
  },
  {
    id: "faq_general_2",
    question: "Is HealthMitra available in my city?",
    answer:
      "HealthMitra is currently available in major US cities including New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, and San Diego. We're expanding rapidly to cover more locations. Please visit our Locations page or enter your zip code on the homepage to check service availability in your area.",
    category: "General",
    status: "active",
    order: 2,
  },
  {
    id: "faq_general_3",
    question: "How do I create an account?",
    answer:
      "Creating an account is simple and free. Click on 'Sign Up' on the top right corner, enter your mobile number or email, verify with OTP, and fill in basic details like name, age, and address. You can also sign up using Google or social media accounts for quicker access.",
    category: "General",
    status: "active",
    order: 3,
  },
  {
    id: "faq_general_4",
    question: "Is my personal and medical information secure?",
    answer:
      "Absolutely. HealthMitra is compliant with HIPAA and data protection regulations. We use 256-bit SSL encryption for all data transmission, store information in secure servers, and never share your personal data without explicit consent. You have full control over your medical records and can delete them anytime.",
    category: "General",
    status: "active",
    order: 4,
  },

  // Doctor Consultations
  {
    id: "faq_consult_1",
    question: "How do I book a doctor consultation?",
    answer:
      "Booking is easy! Go to 'Doctor Consultations', browse doctors by specialty, location, or language, check their availability, select a time slot, and confirm your appointment. You'll receive confirmation via SMS/Email with joining links for teleconsultations or address for in-person visits.",
    category: "Doctor Consultations",
    status: "active",
    order: 1,
  },
  {
    id: "faq_consult_2",
    question: "What is teleconsultation and how does it work?",
    answer:
      "Teleconsultation allows you to consult with doctors remotely via video or audio call. After booking, you'll receive a secure video link. During the call, the doctor can discuss symptoms, review past records, diagnose conditions, and prescribe medications. Prescriptions are sent digitally and can be used at any pharmacy.",
    category: "Doctor Consultations",
    status: "active",
    order: 2,
  },
  {
    id: "faq_consult_3",
    question: "How much does a doctor consultation cost?",
    answer:
      "Consultation fees vary by doctor specialty and experience. General Physicians: $300-500, Specialists: $500-800, Super Specialists: $800-1500. HealthMitra Prime members get 3 free consultations monthly and 20% off on all paid consultations. Emergency consultations are always free.",
    category: "Doctor Consultations",
    status: "active",
    order: 3,
  },
  {
    id: "faq_consult_4",
    question: "Can I get a home visit from a doctor?",
    answer:
      "Yes, home visits are available in select cities for general physicians, pediatricians, and geriatric care. The doctor will visit your home at the scheduled time, bring basic diagnostic equipment, and provide treatment. Home visit fees start at $800 + consultation fees, depending on distance.",
    category: "Doctor Consultations",
    status: "active",
    order: 4,
  },
  {
    id: "faq_consult_5",
    question: "Can I choose a doctor who speaks my language?",
    answer:
      "Yes! You can filter doctors by language preferences including English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and more. This ensures comfortable communication during your consultation.",
    category: "Doctor Consultations",
    status: "active",
    order: 5,
  },
  {
    id: "faq_consult_6",
    question: "What if I need a follow-up consultation?",
    answer:
      "Follow-ups are easy! If you need the same doctor, you can book a follow-up appointment with 30% discount within 7 days. For chronic conditions, our system automatically suggests follow-up schedules. You can also share WhatsApp updates with your doctor for minor follow-ups.",
    category: "Doctor Consultations",
    status: "active",
    order: 6,
  },

  // Diagnostic Tests
  {
    id: "faq_diag_1",
    question: "How do I book a lab test?",
    answer:
      "Select 'Diagnostic Tests' from the menu, choose from 2000+ tests or health packages, select home sample collection or lab visit, pick a convenient time slot, and make payment. A phlebotomist will visit your home at the scheduled time to collect samples.",
    category: "Diagnostic Tests",
    status: "active",
    order: 1,
  },
  {
    id: "faq_diag_2",
    question: "When will I get my test reports?",
    answer:
      "Most routine tests (blood count, glucose, thyroid, etc.) are reported within 6-12 hours. Advanced tests (genetic, histopathology) take 2-5 days. You'll receive reports via SMS/Email as soon as they're ready. Reports are also available in your HealthMitra dashboard with historical tracking.",
    category: "Diagnostic Tests",
    status: "active",
    order: 2,
  },
  {
    id: "faq_diag_3",
    question: "Are your labs certified?",
    answer:
      "Yes, all partner labs are NABL accredited (National Accreditation Board for Testing and Calibration Laboratories) or ISO 15189 certified. We regularly audit labs for quality control, equipment calibration, and staff training. Your reports are reliable and accepted by all hospitals.",
    category: "Diagnostic Tests",
    status: "active",
    order: 3,
  },
  {
    id: "faq_diag_4",
    question: "Do I need to fast before a blood test?",
    answer:
      "Fasting requirements depend on the test. For fasting glucose, lipid profile, and certain hormone tests: 8-12 hours fasting (only water allowed). For CBC, thyroid, vitamin tests: no fasting needed. We always send specific instructions via SMS before sample collection.",
    category: "Diagnostic Tests",
    status: "active",
    order: 4,
  },
  {
    id: "faq_diag_5",
    question: "Can I cancel or reschedule my test booking?",
    answer:
      "Yes, free cancellation up to 1 hour before scheduled collection time. Rescheduling is free anytime. If the phlebotomist has already started the collection process, cancellation charges may apply. Simply go to My Bookings > Lab Tests to manage your appointments.",
    category: "Diagnostic Tests",
    status: "active",
    order: 5,
  },
  {
    id: "faq_diag_6",
    question: "What health packages do you offer?",
    answer:
      "We offer comprehensive packages: Full Body Checkup ($999, includes 70+ tests), Women's Health Package ($799), Diabetes Care Package ($599), Cardiac Profile ($1299), Senior Citizen Package ($1499), and Corporate Wellness Plans. Packages include home collection and doctor consultation.",
    category: "Diagnostic Tests",
    status: "active",
    order: 6,
  },

  // Ambulance Services
  {
    id: "faq_amb_1",
    question: "How do I request an ambulance?",
    answer:
      "For emergencies, tap 'Emergency Ambulance' on the homepage or call our 24/7 helpline. Our system automatically detects your location (GPS), dispatches the nearest ambulance, and shares real-time tracking. You can also request ambulance for planned hospital transfers.",
    category: "Ambulance Services",
    status: "active",
    order: 1,
  },
  {
    id: "faq_amb_2",
    question: "How fast will the ambulance arrive?",
    answer:
      "Our average response time is 8-12 minutes in metro cities and 15-20 minutes in smaller towns. All ambulances are GPS-enabled, connected to traffic management systems, and have priority routing. You can track the ambulance live on your app.",
    category: "Ambulance Services",
    status: "active",
    order: 2,
  },
  {
    id: "faq_amb_3",
    question: "What medical facilities are in your ambulances?",
    answer:
      "All our ambulances are ICU-equipped with: Cardiac monitor/Defibrillator, Oxygen cylinder, Ventilator (Advanced Life Support units), Emergency medications, Stretcher with spinal board, and 2 trained paramedics (EMT-certified). Basic Life Support ambulances have essential first-aid and oxygen.",
    category: "Ambulance Services",
    status: "active",
    order: 3,
  },
  {
    id: "faq_amb_4",
    question: "How much does ambulance service cost?",
    answer:
      "Basic Life Support: $800-1200 for first 10km + $50/km extra. Advanced Life Support (ICU): $1500-2000 for first 10km + $75/km extra. HealthMitra Prime members get 50% off on the first 2 ambulance rides per year. Emergency services are covered under most health insurance plans.",
    category: "Ambulance Services",
    status: "active",
    order: 4,
  },
  {
    id: "faq_amb_5",
    question: "Is ambulance service available 24/7?",
    answer:
      "Yes, our ambulance network operates 24 hours a day, 7 days a week, including public holidays. Our dispatch centers are staffed round-the-clock. In case of high demand, we also partner with local 108 services to ensure coverage.",
    category: "Ambulance Services",
    status: "active",
    order: 5,
  },

  // Health Plans & Insurance
  {
    id: "faq_plan_1",
    question: "What health plans does HealthMitra offer?",
    answer:
      "We offer 3 plans: Basic ($199/month) - OPD consultations & 10% lab discounts; Plus ($499/month) - Unlimited consultations, 25% lab discounts & wellness rewards; Prime ($999/month) - Family coverage (4 members), unlimited everything, free ambulance, and 5000+ network hospitals for cashless treatment.",
    category: "Health Plans",
    status: "active",
    order: 1,
  },
  {
    id: "faq_plan_2",
    question: "Can I add my family members to my plan?",
    answer:
      "Yes, Plus plan allows 1 dependent (spouse OR child), Prime plan covers spouse + up to 2 children + 2 parents. Additional members can be added at discounted rates. Family members get separate login credentials and individual consultation limits.",
    category: "Health Plans",
    status: "active",
    order: 2,
  },
  {
    id: "faq_plan_3",
    question: "What are wellness rewards?",
    answer:
      "Wellness rewards are points earned for healthy activities: daily steps (100 points), health checkups (500 points), completing doctor consultations (200 points). Points can be redeemed for free consultations, lab test discounts (10 points = $1), or Amazon/Flipkart vouchers.",
    category: "Health Plans",
    status: "active",
    order: 3,
  },
  {
    id: "faq_plan_4",
    question: "How do I file an insurance claim?",
    answer:
      "For cashless claims: show your HealthMitra card at network hospitals. For reimbursements: Go to 'Insurance Claims' > Upload bills & documents > Submit. Our team processes within 48 hours and sends documents to your insurer. Track claim status in real-time on dashboard.",
    category: "Health Plans",
    status: "active",
    order: 4,
  },
  {
    id: "faq_plan_5",
    question: "Which insurance companies do you work with?",
    answer:
      "We partner with 20+ insurers including: Star Health, HDFC Ergo, ICICI Lombard, Niva Bupa, Care Health, New India Assurance, Oriental Insurance, and more. Our network covers 95% of health insurance policies in India.",
    category: "Health Plans",
    status: "active",
    order: 5,
  },
  {
    id: "faq_plan_6",
    question: "Can I cancel my health plan anytime?",
    answer:
      "Yes, monthly plans can be cancelled anytime with 7-day notice. For annual plans paid upfront: 30-day money-back guarantee (if no claims made). After that, pro-rata refund minus 2 months' fees. Just contact support or cancel from 'My Subscriptions' page.",
    category: "Health Plans",
    status: "active",
    order: 6,
  },

  // Payments & Billing
  {
    id: "faq_payment_1",
    question: "What payment methods are accepted?",
    answer:
      "We accept Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking (50+ banks), Wallet (Paytm, Mobikwik), and Cash on Delivery (selected services). EMI options available on card payments above $3000.",
    category: "Payments & Billing",
    status: "active",
    order: 1,
  },
  {
    id: "faq_payment_2",
    question: "Is my payment secure?",
    answer:
      "Absolutely. All payments are processed through PCI-DSS compliant gateways with 3D Secure authentication. We never store your card details on our servers. You'll also see 'https' and a padlock icon in the address bar during checkout.",
    category: "Payments & Billing",
    status: "active",
    order: 2,
  },
  {
    id: "faq_payment_3",
    question: "How do I get a refund?",
    answer:
      "If a service wasn't delivered (doctor didn't show, lab didn't collect), request refund within 7 days. Refunds are processed within 5-7 business days to original payment method. For health plans, refund policy as mentioned in subscription terms.",
    category: "Payments & Billing",
    status: "active",
    order: 3,
  },


  // Technical Support
  {
    id: "faq_tech_1",
    question: "The video call isn't working. What should I do?",
    answer:
      "Check your internet speed (minimum 2 Mbps required). Ensure camera/mic permissions are enabled for browser/app. Try switching between WiFi and mobile data. If still not working, the call automatically switches to audio-only mode. Contact support for immediate troubleshooting.",
    category: "Technical Support",
    status: "active",
    order: 1,
  },
  {
    id: "faq_tech_2",
    question: "Can I access my health records offline?",
    answer:
      "Yes, you can download PDFs of all consultation summaries, prescriptions, and lab reports from your dashboard. The app also allows offline access to recently viewed records. For security, sensitive data requires re-authentication every 30 days.",
    category: "Technical Support",
    status: "active",
    order: 2,
  },
  {
    id: "faq_tech_3",
    question: "I forgot my password. How do I reset it?",
    answer:
      "Click 'Forgot Password' on login page, enter registered mobile/email, enter OTP received, and set new password. For security, passwords must be 8+ characters with uppercase, lowercase, number, and special character. Enable biometric login for faster access.",
    category: "Technical Support",
    status: "active",
    order: 3,
  },
  {
    id: "faq_tech_4",
    question: "Is there a mobile app available?",
    answer:
      "Yes! HealthMitra is available on both iOS (App Store) and Android (Google Play Store). The app includes SOS ambulance button, medicine reminders, health tracking dashboard, and offline access. Download it for a better experience!",
    category: "Technical Support",
    status: "active",
    order: 4,
  },
];

export default function FAQPage() {
  const [faqCategories, setFaqCategories] = useState<
    { category: string; questions: FAQ[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("cms_content")
        .select("key, value")
        .like("key", "faq_%")
        .eq("status", "active")
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        console.error("Error fetching FAQs or no data:", error);
        // Use static FAQs as fallback
        const grouped: Record<string, FAQ[]> = {};
        staticFAQs.forEach((faq) => {
          if (!grouped[faq.category]) {
            grouped[faq.category] = [];
          }
          grouped[faq.category].push(faq);
        });
        const categories = Object.entries(grouped).map(
          ([category, questions]) => ({
            category,
            questions: questions.sort((a, b) => a.order - b.order),
          }),
        );
        setFaqCategories(categories);
        setLoading(false);
        return;
      }

      // Group FAQs by category from database
      const grouped: Record<string, FAQ[]> = {};
      data?.forEach((item: any) => {
        try {
          const faq = JSON.parse(item.value);
          if (!grouped[faq.category]) {
            grouped[faq.category] = [];
          }
          grouped[faq.category].push({
            id: item.key,
            question: faq.question || faq.q,
            answer: faq.answer || faq.a,
            category: faq.category,
            status: faq.status || "active",
            order: faq.order || 0,
          });
        } catch (e) {
          // Skip invalid entries
        }
      });

      // If no valid FAQs in DB, use static
      if (Object.keys(grouped).length === 0) {
        staticFAQs.forEach((faq) => {
          if (!grouped[faq.category]) {
            grouped[faq.category] = [];
          }
          grouped[faq.category].push(faq);
        });
      }

      const categories = Object.entries(grouped).map(
        ([category, questions]) => ({
          category,
          questions: questions.sort((a, b) => a.order - b.order),
        }),
      );

      setFaqCategories(categories);
      setLoading(false);
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
        <Footer />
      </>
    );
  }

  // Sort categories in logical order
  const categoryOrder = [
    "General",
    "Doctor Consultations",
    "Diagnostic Tests",
    "Ambulance Services",
    "Health Plans",
    "Payments & Billing",
    "Technical Support",
  ];
  const sortedCategories = [...faqCategories].sort((a, b) => {
    return (
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    );
  });

  let globalIndex = 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-teal-100">
              Find answers to common questions about HealthMitra
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Box - Optional enhancement */}
            <div className="mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your question..."
                  className="w-full px-5 py-3 pl-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-slate-500 mt-2 text-center">
                {sortedCategories.reduce(
                  (acc, cat) => acc + cat.questions.length,
                  0,
                )}{" "}
                answers available
              </p>
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {sortedCategories.map((category) => (
                <a
                  key={category.category}
                  href={`#${category.category.replace(/\s+/g, "-").toLowerCase()}`}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                >
                  {category.category}
                </a>
              ))}
            </div>

            {/* FAQ Accordion by Category */}
            {sortedCategories.map((category) => (
              <div
                key={category.category}
                id={category.category.replace(/\s+/g, "-").toLowerCase()}
                className="mb-12 scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b-2 border-teal-500 inline-block">
                  {category.category}
                </h2>
                <div className="space-y-3 mt-4">
                  {category.questions.map((faq: any) => {
                    const currentIndex = globalIndex++;
                    const questionText = faq.question || faq.q || "";
                    const answerText = faq.answer || faq.a || "";
                    return (
                      <div
                        key={currentIndex}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <button
                          onClick={() =>
                            setOpenIndex(
                              openIndex === currentIndex ? null : currentIndex,
                            )
                          }
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium text-slate-800 pr-4">
                            {questionText}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${openIndex === currentIndex ? "rotate-180" : ""}`}
                          />
                        </button>
                        {openIndex === currentIndex && (
                          <div className="px-6 pb-5 pt-2 text-slate-600 border-t border-slate-100 bg-slate-50/30">
                            {answerText}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-slate-50 to-teal-50/30">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-teal-100">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Still have questions?
              </h2>
              <p className="text-slate-600 mb-6">
                Our support team is here to help you with any questions. We
                typically respond within 2 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
                    Contact Support
                  </Button>
                </Link>
                {/* <Link href="/live-chat">
                  <Button
                    variant="outline"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50 w-full sm:w-auto"
                  >
                    Start Live Chat
                  </Button>
                </Link> */}
              </div>
              <p className="text-xs text-slate-400 mt-6">
                Or email us:{" "}
                <a href="mailto:support@HealthMitraus.com" className="text-teal-600 font-medium">
                  support@HealthMitraus.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
