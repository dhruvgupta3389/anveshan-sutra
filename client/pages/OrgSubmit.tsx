import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Check, Loader2, Edit3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SubmitOrganizationRequest } from "@shared/api";
import { submitOrganization, updateOrganization, getOrganizationById } from "@/lib/services/organizations";

interface FormData extends SubmitOrganizationRequest {
  confirmation: boolean;
  userRole?: "ngo" | "funder";
  grantBudget?: string;
  maxGrantSize?: string;
  preferredNGOTypes?: string[];
  minYearsOperation?: number;
}

const initialFormData: FormData = {
  name: "",
  type: "NGO",
  website: "",
  headquarters: "",
  region: "",
  focusAreas: [],
  mission: "",
  description: "",
  fundingType: "mixed",
  targetBeneficiaries: [],
  partnerHistory: [],
  projects: [],
  confirmation: false,
  userRole: undefined,
};

export default function OrgSubmit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing organization data in edit mode
  useEffect(() => {
    const loadOrganization = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const org = await getOrganizationById(id);
        if (org) {
          setFormData({
            name: org.name,
            type: org.type,
            website: org.website || "",
            headquarters: org.headquarters,
            region: org.region,
            focusAreas: org.focusAreas,
            mission: org.mission,
            description: org.description,
            fundingType: org.fundingType,
            targetBeneficiaries: org.targetBeneficiaries || [],
            partnerHistory: org.partnerHistory || [],
            projects: org.projects || [],
            confirmation: false,
            userRole: org.type === "Foundation" || org.type === "CSR" ? "funder" : "ngo",
          });
          // Skip role selection step in edit mode
          setCurrentStep(1);
        } else {
          toast.error("Organization not found");
          navigate("/org-submit");
        }
      } catch (error) {
        console.error("Failed to load organization:", error);
        toast.error("Failed to load organization data");
        navigate("/org-submit");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganization();
  }, [id, navigate]);

  const steps = [
    {
      number: 0,
      title: "I Am A...",
      description: "Select your organization type",
    },
    {
      number: 1,
      title: "Basic Info",
      description: "Organization name and type",
    },
    {
      number: 2,
      title: "Details",
      description: "Mission, focus areas, and regions",
    },
    {
      number: 3,
      title: "Documents",
      description: "Upload verification documents",
    },
    { number: 4, title: "Review", description: "Preview and submit" },
  ];

  const focusAreaOptions = [
    "Education & STEM",
    "School Education",
    "Digital Education",
    "STEM / Robotics",
    "Scholarships",
    "Teacher Training",
    "Adult Literacy",

    "Skill Development & Livelihood",
    "Vocational Training",
    "Entrepreneurship Support",
    "Self-Employment",
    "Rural Livelihood",
    "Urban Livelihood",

    "Health & Nutrition",
    "Preventive Healthcare",
    "Maternal & Child Health",
    "Sanitation & Hygiene",
    "Nutrition Programs",
    "Medical Camps",

    "Women Empowerment",
    "Women Skilling",
    "Women Safety & Rights",
    "Financial Inclusion (Women)",
    "Leadership Development (Women)",

    "Environment & Sustainability",
    "Waste Management",
    "Water Conservation",
    "Renewable Energy",
    "Energy Efficiency",
    "Climate Action",
    "Urban Green Spaces",

    "Agriculture & Rural Development",
    "Farmer Training",
    "Agri-Tech",
    "Supply Chain Improvement",
    "Irrigation Support",
    "Animal Husbandry",

    "Community Development",
    "Village Development",
    "Infrastructure Support",
    "Slum Development",
    "Migrant Support",
    "Disaster Relief",
    "Public Utilities",

    "Innovation, Research & Technology",
    "Innovation Labs",
    "Incubation Support",
    "R&D Projects",
    "Social Innovation",
    "Startup & Entrepreneurship Programs",
    "Digital Transformation",

    "Differently-Abled Support",
    "Assistive Devices",
    "Special Education",
    "Accessibility Initiatives",

    "Youth Development & Sports",
    "Sports Training",
    "Sports Infrastructure",
    "Youth Leadership Programs",
    "Volunteering Programs",

    "Arts, Culture & Heritage",
    "Cultural Preservation",
    "Museums & Heritage",
    "Cultural Programs",

    "Governance, Policy & Civic Engagement",
    "Good Governance",
    "Digital Governance",
    "Transparency Initiatives",
    "Citizen Engagement Platforms",
    "RTI Awareness"
  ];

  const regionOptions = [
    "Northern India",
    "Southern India",
    "Eastern India",
    "Western India",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFocusAreaChange = (area: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: checked
        ? [...prev.focusAreas, area]
        : prev.focusAreas.filter((a) => a !== area),
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.userRole) {
          toast.error("Please select whether you are an NGO or Funder");
          return false;
        }
        return true;
      case 1:
        if (!formData.name.trim()) {
          toast.error("Organization name is required");
          return false;
        }
        if (!formData.type) {
          toast.error("Organization type is required");
          return false;
        }
        return true;
      case 2:
        if (!formData.mission.trim()) {
          toast.error("Mission statement is required");
          return false;
        }
        if (!formData.description.trim()) {
          toast.error("Description is required");
          return false;
        }
        if (formData.focusAreas.length === 0) {
          toast.error("At least one focus area is required");
          return false;
        }
        if (!formData.region.trim()) {
          toast.error("Region is required");
          return false;
        }
        return true;
      case 3:
        // Documents are optional for MVP
        return true;
      case 4:
        if (!formData.confirmation) {
          toast.error("Please confirm the information is accurate");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(4, currentStep + 1));
    }
  };

  const getTotalSteps = () => {
    return formData.userRole ? 5 : 1; // If no role selected, only show role selection
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const orgData = {
        name: formData.name,
        type: formData.type,
        website: formData.website,
        headquarters: formData.headquarters,
        region: formData.region,
        focusAreas: formData.focusAreas,
        mission: formData.mission,
        description: formData.description,
        fundingType: formData.fundingType,
      };

      let result;
      if (isEditMode && id) {
        result = await updateOrganization(id, orgData);
      } else {
        result = await submitOrganization(orgData);
      }

      if (!result.success) {
        throw new Error(result.error || `Failed to ${isEditMode ? 'update' : 'submit'} organization`);
      }

      toast.success(
        isEditMode
          ? `Organization "${formData.name}" updated successfully!`
          : `Organization "${formData.name}" submitted successfully! Redirecting to search...`,
      );

      // Redirect after a brief delay
      setTimeout(() => {
        if (isEditMode) {
          navigate(`/organization/${id}`);
        } else {
          navigate("/dashboard");
        }
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditMode ? 'update' : 'submit'} organization`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-lg text-muted-foreground">Loading organization data...</p>
            </div>
          ) : (
            <>
              {/* Back Button */}
              <Link
                to={isEditMode ? `/organization/${id}` : "/home"}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors mb-8 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                {isEditMode ? "Back to Organization" : "Back to Home"}
              </Link>

              {/* Two Column Layout: Progress + Form */}
              <div className="grid lg:grid-cols-[280px_1fr] gap-8">

                {/* Left Sidebar - Progress Indicator */}
                <div className="hidden lg:block">
                  <div className="sticky top-28 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                    {/* Circular Progress */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            className="fill-none stroke-slate-100"
                            strokeWidth="8"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            className="fill-none stroke-primary transition-all duration-500"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - (currentStep / (steps.length - 1)))}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-slate-800">
                            {Math.round((currentStep / (steps.length - 1)) * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">Complete</p>
                    </div>

                    {/* Step List */}
                    <div className="space-y-3">
                      {steps.map((step, index) => (
                        <div
                          key={step.number}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${step.number === currentStep
                            ? "bg-primary/10 border border-primary/20"
                            : step.number < currentStep
                              ? "bg-green-50"
                              : "bg-slate-50"
                            }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step.number < currentStep
                              ? "bg-green-500 text-white"
                              : step.number === currentStep
                                ? "bg-primary text-white"
                                : "bg-slate-200 text-slate-500"
                              }`}
                          >
                            {step.number < currentStep ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              step.number
                            )}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${step.number === currentStep ? "text-primary" : "text-slate-700"
                              }`}>
                              {step.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Encouragement */}
                    <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-purple-50 rounded-xl border border-primary/10">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {currentStep === 0 && "👋 Let's get started! This only takes 2 minutes."}
                        {currentStep === 1 && "📝 Great start! Basic info helps us identify you."}
                        {currentStep === 2 && "🎯 This helps us find perfect matches for you."}
                        {currentStep === 3 && "📎 Documents are optional — you can add them later."}
                        {currentStep === 4 && "🎉 Almost there! Just review and submit."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Form Content */}
                <div>
                  {/* Mobile Progress Bar */}
                  <div className="lg:hidden mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {Math.round((currentStep / (steps.length - 1)) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      {isEditMode && <Edit3 className="w-8 h-8 text-primary" />}
                      <h1 className="text-3xl font-bold text-slate-800">
                        {isEditMode ? "Edit Organization" : "Add Your Organization"}
                      </h1>
                    </div>
                    <p className="text-slate-500">
                      {isEditMode
                        ? "Update your organization details."
                        : "Join Drivya.AI to connect with aligned partners."}
                    </p>
                  </div>

                  {/* Form Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-6">

                    {currentStep === 0 && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            Are you an NGO or Funder?
                          </h2>
                          <p className="text-slate-500">
                            Tell us what type of organization you represent so we can customize your experience.
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* NGO Option */}
                          <div
                            onClick={() => handleInputChange("userRole", "ngo")}
                            className={`p-8 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${formData.userRole === "ngo"
                              ? "border-primary bg-primary/5 shadow-lg"
                              : "border-slate-200 hover:border-primary/50 bg-white"
                              }`}
                          >
                            <div className="text-4xl mb-4">🏢</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                              I'm an NGO
                            </h3>
                            <p className="text-slate-500 text-sm">
                              Looking for funders, partners, and collaboration opportunities
                            </p>
                            {formData.userRole === "ngo" && (
                              <div className="mt-4 text-primary font-semibold flex items-center gap-2">
                                <Check className="w-5 h-5" /> Selected
                              </div>
                            )}
                          </div>

                          {/* Funder Option */}
                          <div
                            onClick={() => handleInputChange("userRole", "funder")}
                            className={`p-8 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${formData.userRole === "funder"
                              ? "border-primary bg-primary/5 shadow-lg"
                              : "border-slate-200 hover:border-primary/50 bg-white"
                              }`}
                          >
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                              I'm a Funder
                            </h3>
                            <p className="text-slate-500 text-sm">
                              Looking for NGO partners and impact investment opportunities
                            </p>
                            {formData.userRole === "funder" && (
                              <div className="mt-4 text-primary font-semibold flex items-center gap-2">
                                <Check className="w-5 h-5" /> Selected
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}


                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            Basic Information
                          </h2>
                          <p className="text-slate-500 text-sm">
                            ✏️ Don't worry, you can edit this later anytime.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Organization Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Enter your organization name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Organization Type *
                          </label>
                          <select
                            value={formData.type}
                            onChange={(e) => handleInputChange("type", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          >
                            <option value="NGO">NGO</option>
                            <option value="Foundation">Foundation</option>
                            <option value="Incubator">Incubator</option>
                            <option value="CSR">CSR Initiative</option>
                            <option value="Social Enterprise">Social Enterprise</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Headquarters *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Uttar Pradesh"
                            value={formData.headquarters}
                            onChange={(e) =>
                              handleInputChange("headquarters", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Website
                            <span className="text-slate-400 font-normal ml-1">(optional)</span>
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com"
                            value={formData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    )}


                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            Organization Details
                          </h2>
                          <p className="text-slate-500 text-sm">
                            🎯 This helps us find better matches for you — be as specific as you can!
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Mission Statement *
                          </label>
                          <textarea
                            placeholder="Describe your organization's mission and goals"
                            rows={4}
                            value={formData.mission}
                            onChange={(e) => handleInputChange("mission", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"

                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Description *
                          </label>
                          <textarea
                            placeholder="Describe your organization's work and impact"
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Focus Areas *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {focusAreaOptions.map((area) => (
                              <label
                                key={area}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.focusAreas.includes(area)}
                                  onChange={(e) =>
                                    handleFocusAreaChange(area, e.target.checked)
                                  }
                                  className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm text-foreground">{area}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Region *
                          </label>
                          <select
                            value={formData.region}
                            onChange={(e) => handleInputChange("region", e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select region</option>
                            {regionOptions.map((region) => (
                              <option key={region} value={region}>
                                {region}
                              </option>
                            ))}
                          </select>
                        </div>

                        {formData.userRole === "funder" && (
                          <>
                            <div>
                              <label className="block text-sm font-semibold text-foreground mb-2">
                                Grant Budget Range
                              </label>
                              <select
                                value={formData.grantBudget || ""}
                                onChange={(e) =>
                                  handleInputChange("grantBudget", e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option value="">Select budget range</option>
                                <option value="0-100k">Under $100K</option>
                                <option value="100k-500k">$100K - $500K</option>
                                <option value="500k-1m">$500K - $1M</option>
                                <option value="1m+">$1M+</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-foreground mb-2">
                                Maximum Grant Size
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., $500,000"
                                value={formData.maxGrantSize || ""}
                                onChange={(e) =>
                                  handleInputChange("maxGrantSize", e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-foreground mb-2">
                                Preferred NGO Types
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {["NGO", "Social Enterprise", "Incubator", "Foundation"].map(
                                  (type) => (
                                    <label
                                      key={type}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={
                                          formData.preferredNGOTypes?.includes(type) ||
                                          false
                                        }
                                        onChange={(e) => {
                                          const types =
                                            formData.preferredNGOTypes || [];
                                          if (e.target.checked) {
                                            handleInputChange("preferredNGOTypes", [
                                              ...types,
                                              type,
                                            ]);
                                          } else {
                                            handleInputChange(
                                              "preferredNGOTypes",
                                              types.filter((t) => t !== type)
                                            );
                                          }
                                        }}
                                        className="w-4 h-4 rounded border-border"
                                      />
                                      <span className="text-sm text-foreground">
                                        {type}
                                      </span>
                                    </label>
                                  )
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-foreground mb-2">
                                Minimum Years in Operation
                              </label>
                              <input
                                type="number"
                                placeholder="e.g., 2"
                                value={formData.minYearsOperation || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "minYearsOperation",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                min="0"
                                max="100"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h2 className="text-heading-md text-foreground">
                          Upload Documents
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          Upload documents to verify your organization. (Optional for MVP)
                        </p>

                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="font-semibold text-foreground mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Registration documents, annual reports, or legal
                            certifications
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">
                            Document Types
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>✓ Registration Certificate</li>
                            <li>✓ Annual Report (last 2 years)</li>
                            <li>✓ Legal Documentation</li>
                            <li>✓ Proof of Operations</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <h2 className="text-heading-md text-foreground">
                          Review & Submit
                        </h2>
                        <p className="text-muted-foreground">
                          Please review your information before submitting. Your
                          organization will be listed immediately in search results.
                        </p>

                        <div className="bg-secondary rounded-lg p-6 space-y-4">
                          <div className="flex justify-between pb-4 border-b border-border">
                            <span className="text-muted-foreground">
                              Organization Name
                            </span>
                            <span className="font-semibold text-foreground">
                              {formData.name}
                            </span>
                          </div>
                          <div className="flex justify-between pb-4 border-b border-border">
                            <span className="text-muted-foreground">
                              Organization Type
                            </span>
                            <span className="font-semibold text-foreground">
                              {formData.type}
                            </span>
                          </div>
                          <div className="flex justify-between pb-4 border-b border-border">
                            <span className="text-muted-foreground">Headquarters</span>
                            <span className="font-semibold text-foreground">
                              {formData.headquarters}
                            </span>
                          </div>
                          <div className="flex justify-between pb-4 border-b border-border">
                            <span className="text-muted-foreground">Region</span>
                            <span className="font-semibold text-foreground">
                              {formData.region}
                            </span>
                          </div>
                          <div className="flex justify-between pb-4 border-b border-border">
                            <span className="text-muted-foreground">Focus Areas</span>
                            <span className="font-semibold text-foreground">
                              {formData.focusAreas.join(", ")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Verification Status
                            </span>
                            <span className="font-semibold text-accent">Verified</span>
                          </div>
                        </div>

                        <label className="flex items-center gap-3 p-4 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.confirmation}
                            onChange={(e) =>
                              handleInputChange("confirmation", e.target.checked)
                            }
                            className="w-4 h-4 rounded border-border"
                          />
                          <span className="text-sm text-slate-600">
                            I confirm that the information provided is accurate and
                            agree to the terms
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-4 mt-8">
                    <button
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      className="px-8 py-3 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {currentStep < getTotalSteps() - 1 ? (
                      <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-semibold shadow-lg shadow-primary/20"
                      >
                        Continue →
                      </button>
                    ) : currentStep === getTotalSteps() - 1 ? (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20"
                      >
                        {isSubmitting
                          ? (isEditMode ? "Updating..." : "Submitting...")
                          : (isEditMode ? "Update Organization" : "Submit for Verification ✓")}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

