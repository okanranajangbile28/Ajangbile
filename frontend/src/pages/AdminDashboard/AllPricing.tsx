import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Save, DollarSign, RefreshCw } from "lucide-react";

interface Pricing {
  applicationFee: number;
  basicInitiation: number;
  standardInitiation: number;
  premiumInitiation: number;
  opeleConsultation: number;
  ikinConsultation: number;
  oneHourConsultation: number;
}

const defaultPricing: Pricing = {
  applicationFee: 12,
  basicInitiation: 224,
  standardInitiation: 450,
  premiumInitiation: 750,
  opeleConsultation: 10,
  ikinConsultation: 15,
  oneHourConsultation: 100,
};

const AllPricing = () => {
  const [pricing, setPricing] = useState<Pricing>(defaultPricing);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const loadPricing = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(`${serverUrl}/api/pricing`, {
        withCredentials: true,
      });

      if (response.data?.pricing) {
        setPricing({
          applicationFee: Number(response.data.pricing.applicationFee),
          basicInitiation: Number(response.data.pricing.basicInitiation),
          standardInitiation: Number(response.data.pricing.standardInitiation),
          premiumInitiation: Number(response.data.pricing.premiumInitiation),
          opeleConsultation: Number(response.data.pricing.opeleConsultation),
          ikinConsultation: Number(response.data.pricing.ikinConsultation),
          oneHourConsultation: Number(
            response.data.pricing.oneHourConsultation,
          ),
        });
      }
    } catch (error) {
      console.error("❌ Load pricing error:", error);

      setMessage("Unable to load pricing.");
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    void loadPricing();
  }, [loadPricing]);

  const handleChange = (field: keyof Pricing, value: string) => {
    setPricing((current) => ({
      ...current,
      [field]: value === "" ? 0 : Number(value),
    }));
  };

  const handleSave = async () => {
    const prices = Object.values(pricing);

    if (prices.some((price) => !Number.isFinite(price) || price < 0)) {
      setMessage("Please enter valid prices.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await axios.put(`${serverUrl}/api/pricing`, pricing, {
        withCredentials: true,
      });

      if (response.data?.pricing) {
        setPricing({
          applicationFee: Number(response.data.pricing.applicationFee),
          basicInitiation: Number(response.data.pricing.basicInitiation),
          standardInitiation: Number(response.data.pricing.standardInitiation),
          premiumInitiation: Number(response.data.pricing.premiumInitiation),
          opeleConsultation: Number(response.data.pricing.opeleConsultation),
          ikinConsultation: Number(response.data.pricing.ikinConsultation),
          oneHourConsultation: Number(
            response.data.pricing.oneHourConsultation,
          ),
        });
      }

      setMessage("Pricing updated successfully.");
    } catch (error) {
      console.error("❌ Save pricing error:", error);

      setMessage(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Unable to update pricing."
          : "Unable to update pricing.",
      );
    } finally {
      setSaving(false);
    }
  };

  const membershipPricing = [
    {
      label: "Application Fee",
      field: "applicationFee" as const,
    },
    {
      label: "Basic Initiation Package",
      field: "basicInitiation" as const,
    },
    {
      label: "Standard Initiation Package",
      field: "standardInitiation" as const,
    },
    {
      label: "Premium Initiation Package",
      field: "premiumInitiation" as const,
    },
  ];

  const consultationPricing = [
    {
      label: "Opele Consultation",
      field: "opeleConsultation" as const,
    },
    {
      label: "Ikin Consultation",
      field: "ikinConsultation" as const,
    },
    {
      label: "1-Hour Consultation & Discussion",
      field: "oneHourConsultation" as const,
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 text-purple-900">
          <RefreshCw className="animate-spin" size={22} />
          <span className="font-semibold">Loading pricing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-900 text-yellow-400 p-3 rounded-xl">
              <DollarSign size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-purple-950">
                All Pricing
              </h1>

              <p className="text-gray-600 mt-1">
                Manage membership and consultation prices.
              </p>
            </div>
          </div>
        </div>

        {/* MEMBERSHIP */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-950">Membership</h2>

            <p className="text-gray-500 mt-1">
              Membership application and initiation pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {membershipPricing.map((item) => (
              <div key={item.field}>
                <label
                  htmlFor={item.field}
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {item.label}
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    $
                  </span>

                  <input
                    id={item.field}
                    type="number"
                    min="0"
                    step="0.01"
                    value={pricing[item.field]}
                    onChange={(event) =>
                      handleChange(item.field, event.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl py-3 pl-9 pr-4 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONSULTATIONS */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-950">
              Consultations
            </h2>

            <p className="text-gray-500 mt-1">
              Manage the prices for your consultation services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {consultationPricing.map((item) => (
              <div key={item.field}>
                <label
                  htmlFor={item.field}
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {item.label}
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    $
                  </span>

                  <input
                    id={item.field}
                    type="number"
                    min="0"
                    step="0.01"
                    value={pricing[item.field]}
                    onChange={(event) =>
                      handleChange(item.field, event.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl py-3 pl-9 pr-4 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-6 rounded-xl p-4 font-semibold ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 border border-green-300 text-green-800"
                : "bg-red-100 border border-red-300 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* SAVE */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-purple-900 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed text-white px-7 py-4 rounded-xl font-bold transition shadow-lg"
          >
            <Save size={20} />

            {saving ? "Saving..." : "Save Pricing"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllPricing;
