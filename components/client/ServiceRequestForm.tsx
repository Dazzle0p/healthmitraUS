"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Upload,
  MapPin,
  Phone,
  Building,
  Search,
  Navigation,
} from "lucide-react";
import { createServiceRequest } from "@/app/actions/service-requests";

// Updated schema with proper address fields
const formSchema = z.object({
  type: z.string(),
  memberId: z.string().min(1, "Please select a member"),
  description: z.string().optional(),
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to terms"),
  // Type-specific fields (optional based on type)
  testNames: z.array(z.string()).optional(),
  collectionType: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTimeSlot: z.string().optional(),
  collectionAddress: z.string().optional(),
  // Medicine
  prescriptionFile: z.any().optional(),
  deliveryType: z.string().optional(),
  deliveryAddress: z.string().optional(),
  // Ambulance - Enhanced fields
  ambulanceType: z.string().optional(),
  patientName: z.string().optional(),
  patientAge: z.string().optional(),
  patientPhone: z
    .string()
    .min(10, "Please enter a valid 10-digit mobile number")
    .max(10, "Please enter a valid 10-digit mobile number")
    .optional(),
  pickupLocation: z.string().optional(),
  pickupAddressLine1: z
    .string()
    .min(1, "Address line 1 is required")
    .optional(),
  pickupAddressLine2: z.string().optional(),
  pickupCity: z.string().min(1, "City is required").optional(),
  pickupState: z.string().min(1, "State is required").optional(),
  pickupPincode: z
    .string()
    .length(6, "Please enter a valid 6-digit pincode")
    .optional(),
  pickupLandmark: z.string().optional(),
  destination: z.string().optional(),
  destinationHospitalId: z.string().optional(),
  destinationHospitalName: z.string().optional(),
  destinationAddress: z.string().optional(),
  destinationCity: z.string().optional(),
  destinationContact: z.string().optional(),
  urgency: z.string().optional(),
  notesForCrew: z.string().optional(),
  // Doctor
  specialization: z.string().optional(),
  symptoms: z.string().optional(),
  consultationType: z.string().optional(),
  patientPhoneNumber: z.string().optional(),
  // Nursing/Caretaker
  serviceType: z.string().optional(),
  duration: z.string().optional(),
  // Voucher
  voucherCode: z.string().optional(),
  voucherRedeemFor: z.string().optional(),
  // General/Emergency
  subject: z.string().optional(),
  priority: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceRequestFormProps {
  initialType?: string;
  userProfile?: any;
  vouchers?: { code: string; value: number; description: string }[];
}

// Sample nearby hospitals - replace with API call
const NEARBY_HOSPITALS = [
  {
    id: "1",
    name: "Apollo Hospital",
    address: "Greams Road, Chennai",
    city: "Chennai",
    pincode: "600006",
    phone: "044-28290200",
  },
  {
    id: "2",
    name: "Fortis Hospital",
    address: "Vadapalani, Chennai",
    city: "Chennai",
    pincode: "600026",
    phone: "044-42920000",
  },
  {
    id: "3",
    name: "Global Hospitals",
    address: "Perumbakkam, Chennai",
    city: "Chennai",
    pincode: "600100",
    phone: "044-40808080",
  },
  {
    id: "4",
    name: "MIOT International",
    address: "Manapakkam, Chennai",
    city: "Chennai",
    pincode: "600089",
    phone: "044-22492249",
  },
  {
    id: "5",
    name: "Sankara Nethralaya",
    address: "Nungambakkam, Chennai",
    city: "Chennai",
    pincode: "600006",
    phone: "044-28271616",
  },
  {
    id: "6",
    name: "Christian Medical College (CMC)",
    address: "Vellore",
    city: "Vellore",
    pincode: "632004",
    phone: "0416-2281000",
  },
  {
    id: "7",
    name: "Other Hospital",
    address: "Enter manually",
    city: "",
    pincode: "",
  },
];

export function ServiceRequestForm({
  initialType,
  userProfile,
  vouchers = [],
}: ServiceRequestFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(
    null,
  );
  const [useGpsLocation, setUseGpsLocation] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<string>("");
  const [manualDestination, setManualDestination] = useState(false);

  const typeFromUrl = searchParams.get("type");
  const defaultType = initialType || typeFromUrl || "medical_consultation";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultType,
      memberId: userProfile?.full_name || "Myself",
      agreedToTerms: false,
      deliveryType: "home",
      collectionType: "home",
      ambulanceType: "bls",
      urgency: "scheduled",
      consultationType: "video",
      priority: "normal",
      patientPhone: userProfile?.phone || "",
    },
  });

  const watchType = form.watch("type");
  const watchAmbulanceType = form.watch("ambulanceType");
  const watchUrgency = form.watch("urgency");

  // Auto-fill user's saved address if available
  useEffect(() => {
    if (userProfile?.address) {
      form.setValue("pickupAddressLine1", userProfile.address);
    }
    if (userProfile?.city) {
      form.setValue("pickupCity", userProfile.city);
    }
    if (userProfile?.pincode) {
      form.setValue("pickupPincode", userProfile.pincode);
    }
    if (userProfile?.phone) {
      form.setValue("patientPhone", userProfile.phone);
    }
  }, [userProfile, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("prescriptionFile", file);
      const reader = new FileReader();
      reader.onloadend = () => setPrescriptionPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding to get address details
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          );
          const data = await response.json();
          if (data.address) {
            form.setValue(
              "pickupAddressLine1",
              data.address.road || data.address.suburb || "",
            );
            form.setValue(
              "pickupCity",
              data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
            );
            form.setValue("pickupState", data.address.state || "");
            form.setValue("pickupPincode", data.address.postcode || "");
            form.setValue(
              "pickupLandmark",
              data.address.suburb || data.address.neighbourhood || "",
            );
            toast.success("Location detected successfully");
          }
        } catch {
          // Use coordinates as fallback
          form.setValue(
            "pickupAddressLine1",
            `Lat: ${latitude}, Lon: ${longitude}`,
          );
          toast.success("Location coordinates captured");
        }
        setLocationLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to get location. Please enter address manually.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Handle hospital selection
  const handleHospitalSelect = (hospitalId: string) => {
    setSelectedHospital(hospitalId);
    if (hospitalId === "7") {
      setManualDestination(true);
      form.setValue("destinationHospitalId", "");
      form.setValue("destinationHospitalName", "");
      form.setValue("destinationAddress", "");
      form.setValue("destinationCity", "");
    } else {
      setManualDestination(false);
      const hospital = NEARBY_HOSPITALS.find((h) => h.id === hospitalId);
      if (hospital) {
        form.setValue("destinationHospitalId", hospital.id);
        form.setValue("destinationHospitalName", hospital.name);
        form.setValue("destinationAddress", hospital.address);
        form.setValue("destinationCity", hospital.city);
        form.setValue("destinationContact", hospital.phone);
      }
    }
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const validTypes = [
        "medical_consultation",
        "diagnostic",
        "medicine",
        "ambulance",
        "caretaker",
        "nursing",
        "other",
      ];
      const dbType = validTypes.includes(data.type) ? data.type : "other";

      const { type, memberId, agreedToTerms, ...restFields } = data;
      const details: Record<string, any> = { ...restFields };
      if (data.type !== dbType) details.original_type = data.type;
      details.member_name = memberId;

      const result = await createServiceRequest({
        type: dbType,
        memberId,
        details,
      });

      if (result.success) {
        toast.success("Service request submitted successfully!", {
          description:
            watchUrgency === "immediate"
              ? "Ambulance has been dispatched. Track live on your dashboard."
              : "You will be notified once our team reviews it.",
        });
        router.push("/service-requests");
      } else {
        toast.error("Failed to submit request", { description: result.error });
      }
    } catch {
      toast.error("Something went wrong while submitting your request");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getTitle = () => {
    const titles: Record<string, string> = {
      diagnostic: "Book Diagnostic Test",
      medicine: "Order Medicines",
      ambulance: "Book Ambulance Service",
      medical_consultation: "Doctor Appointment",
      caretaker: "Caretaker Services",
      nursing: "Nursing Procedures",
      voucher: "Redeem Voucher",
      general: "General Request",
      emergency: "Emergency Service",
    };
    return titles[watchType] || "Service Request";
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/service-requests")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-bold mb-6">{getTitle()}</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Common Field: Member Selection */}
          <div className="space-y-2">
            <Label>Select Member</Label>
            <Select
              onValueChange={(val) => form.setValue("memberId", val)}
              defaultValue={form.getValues("memberId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Myself">Myself (Self)</SelectItem>
                <SelectItem value="Spouse">Spouse</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Parent">Parent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ===== AMBULANCE - COMPLETE REWRITE WITH PROPER FIELDS ===== */}
          {watchType === "ambulance" && (
            <div className="space-y-6">
              {/* Urgency Section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Urgency Level</Label>
                <RadioGroup
                  onValueChange={(val) => form.setValue("urgency", val)}
                  defaultValue="scheduled"
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-red-200 bg-red-50">
                    <RadioGroupItem
                      value="immediate"
                      id="urgent"
                      className="border-red-500"
                    />
                    <Label
                      htmlFor="urgent"
                      className="text-red-700 font-semibold cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-xl">🚨</span> Immediate (Emergency)
                      - Dispatch within 2 minutes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled" className="cursor-pointer">
                      Scheduled Transfer - For planned hospital visits
                    </Label>
                  </div>
                </RadioGroup>

                {watchUrgency === "immediate" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                    <p className="text-red-700 text-sm">
                      ⚠️ For life-threatening emergencies, please call 108 or
                      112 immediately while we dispatch.
                    </p>
                  </div>
                )}
              </div>

              {/* Ambulance Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Ambulance Type
                </Label>
                <RadioGroup
                  onValueChange={(val) => form.setValue("ambulanceType", val)}
                  defaultValue="bls"
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${watchAmbulanceType === "bls" ? "border-teal-500 bg-teal-50" : "border-slate-200"}`}
                  >
                    <RadioGroupItem value="bls" id="bls" />
                    <Label htmlFor="bls" className="cursor-pointer">
                      <span className="font-medium">BLS</span>
                      <p className="text-xs text-slate-500">
                        Basic Life Support
                      </p>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${watchAmbulanceType === "als" ? "border-teal-500 bg-teal-50" : "border-slate-200"}`}
                  >
                    <RadioGroupItem value="als" id="als" />
                    <Label htmlFor="als" className="cursor-pointer">
                      <span className="font-medium">ALS</span>
                      <p className="text-xs text-slate-500">
                        Advanced Life Support
                      </p>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${watchAmbulanceType === "icu" ? "border-teal-500 bg-teal-50" : "border-slate-200"}`}
                  >
                    <RadioGroupItem value="icu" id="icu" />
                    <Label htmlFor="icu" className="cursor-pointer">
                      <span className="font-medium">ICU on Wheels</span>
                      <p className="text-xs text-slate-500">ICU Equipped</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Patient Information */}
              <div className="space-y-3 border-t pt-4">
                <Label className="text-base font-semibold">
                  Patient Information
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Full Name *</Label>
                    <Input
                      id="patientName"
                      {...form.register("patientName")}
                      placeholder="Enter patient's full name"
                      className="focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Age *</Label>
                    <Input
                      id="patientAge"
                      type="number"
                      {...form.register("patientAge")}
                      placeholder="Enter age in years"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientPhone">Contact Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="patientPhone"
                      type="tel"
                      {...form.register("patientPhone")}
                      placeholder="10-digit mobile number"
                      className="pl-10 focus:ring-teal-500"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    We'll send ambulance ETA and live tracking to this number
                  </p>
                </div>
              </div>

              {/* Pickup Location - Complete Address with Pincode */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">
                    Pickup Location (Current Address)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="text-teal-600 border-teal-200"
                  >
                    <Navigation
                      className={`h-4 w-4 mr-1 ${locationLoading ? "animate-spin" : ""}`}
                    />
                    {locationLoading ? "Detecting..." : "Use My Location"}
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="pickupAddressLine1">Address Line 1 *</Label>
                    <Input
                      id="pickupAddressLine1"
                      {...form.register("pickupAddressLine1")}
                      placeholder="House/Flat/Block No., Street Name"
                      className="focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupAddressLine2">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="pickupAddressLine2"
                      {...form.register("pickupAddressLine2")}
                      placeholder="Apartment, Area, Colony"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupLandmark">
                        Landmark (Optional)
                      </Label>
                      <Input
                        id="pickupLandmark"
                        {...form.register("pickupLandmark")}
                        placeholder="Nearby hospital, mall, or landmark"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupCity">City *</Label>
                      <Input
                        id="pickupCity"
                        {...form.register("pickupCity")}
                        placeholder="City name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupState">State *</Label>
                      <Select
                        onValueChange={(val) =>
                          form.setValue("pickupState", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="Maharashtra">
                            Maharashtra
                          </SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Telangana">Telangana</SelectItem>
                          <SelectItem value="West Bengal">
                            West Bengal
                          </SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupPincode">Pincode *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="pickupPincode"
                          type="text"
                          {...form.register("pickupPincode")}
                          placeholder="6-digit pincode"
                          className="pl-10 focus:ring-teal-500"
                          maxLength={6}
                          pattern="[0-9]{6}"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination Hospital Section */}
              <div className="space-y-3 border-t pt-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Building className="h-4 w-4" /> Destination Hospital
                </Label>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Select Hospital</Label>
                    <Select
                      onValueChange={handleHospitalSelect}
                      value={selectedHospital}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Search or select a hospital" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {NEARBY_HOSPITALS.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id}>
                            <div>
                              <p className="font-medium">{hospital.name}</p>
                              <p className="text-xs text-slate-500">
                                {hospital.address}, {hospital.city} -{" "}
                                {hospital.pincode}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {manualDestination && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="space-y-2">
                        <Label htmlFor="destinationHospitalName">
                          Hospital/Medical Facility Name *
                        </Label>
                        <Input
                          id="destinationHospitalName"
                          {...form.register("destinationHospitalName")}
                          placeholder="Enter hospital name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destinationAddress">
                          Complete Address *
                        </Label>
                        <Textarea
                          {...form.register("destinationAddress")}
                          placeholder="Street, area, city, landmark"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="destinationCity">City</Label>
                          <Input
                            {...form.register("destinationCity")}
                            placeholder="City"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destinationContact">
                            Contact Number (Optional)
                          </Label>
                          <Input
                            {...form.register("destinationContact")}
                            placeholder="Hospital phone"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {!manualDestination &&
                    selectedHospital &&
                    selectedHospital !== "7" && (
                      <div className="bg-slate-50 rounded-lg p-3 text-sm">
                        <p className="font-medium text-slate-700">
                          📍 Selected Hospital Details
                        </p>
                        <p className="text-slate-600 mt-1">
                          {
                            NEARBY_HOSPITALS.find(
                              (h) => h.id === selectedHospital,
                            )?.address
                          }
                          ,{" "}
                          {
                            NEARBY_HOSPITALS.find(
                              (h) => h.id === selectedHospital,
                            )?.city
                          }{" "}
                          -{" "}
                          {
                            NEARBY_HOSPITALS.find(
                              (h) => h.id === selectedHospital,
                            )?.pincode
                          }
                        </p>
                        {NEARBY_HOSPITALS.find((h) => h.id === selectedHospital)
                          ?.phone && (
                          <p className="text-slate-500 text-xs mt-1">
                            ☎️{" "}
                            {
                              NEARBY_HOSPITALS.find(
                                (h) => h.id === selectedHospital,
                              )?.phone
                            }
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-3 border-t pt-4">
                <Label htmlFor="notesForCrew">
                  Special Instructions for Ambulance Crew (Optional)
                </Label>
                <Textarea
                  {...form.register("notesForCrew")}
                  placeholder="E.g., Patient on oxygen, difficulty breathing, need stretcher, cardiac history, etc."
                  rows={3}
                  className="focus:ring-teal-500"
                />
              </div>

              {/* Scheduled Date for Non-Emergency */}
              {watchUrgency === "scheduled" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Input type="date" {...form.register("preferredDate")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Time</Label>
                    <Select
                      onValueChange={(val) =>
                        form.setValue("preferredTimeSlot", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">
                          Morning (8 AM - 12 PM)
                        </SelectItem>
                        <SelectItem value="afternoon">
                          Afternoon (12 PM - 4 PM)
                        </SelectItem>
                        <SelectItem value="evening">
                          Evening (4 PM - 8 PM)
                        </SelectItem>
                        <SelectItem value="night">
                          Night (8 PM - 12 AM)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other service types (diagnostic, medicine, doctor, caretaker, nursing, voucher, general, emergency) remain unchanged */}
          {/* ... (keep the existing code for other service types from your original component) ... */}

          {/* Terms */}
          <div className="flex items-start space-x-2 pt-4 border-t">
            <Checkbox
              id="terms"
              checked={form.watch("agreedToTerms")}
              onCheckedChange={(c) =>
                form.setValue("agreedToTerms", c as boolean)
              }
            />
            <Label
              htmlFor="terms"
              className="text-sm text-slate-500 leading-none"
            >
              I agree to the terms and conditions and authorize HealthMitra to
              process this request.
            </Label>
          </div>
          {form.formState.errors.agreedToTerms && (
            <p className="text-sm text-red-500">
              {form.formState.errors.agreedToTerms.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {watchUrgency === "immediate"
              ? "🚨 Request Ambulance Now"
              : "Submit Ambulance Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}
