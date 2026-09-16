import { ArrowLeft, Bell, Images, Settings, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: "gallery" | "notifications" | "settings";
}

const ComingSoonPage = ({ title, description, icon }: ComingSoonPageProps) => {
  const Icon =
    icon === "gallery" ? Images : icon === "notifications" ? Bell : Settings;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
      <div className="w-full overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200">
        <div className="relative overflow-hidden bg-purple-950 px-6 py-14 text-center text-white sm:px-10 sm:py-16">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow-400/10" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-yellow-400/10" />

          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-yellow-400 text-purple-950 shadow-lg">
              <Icon size={38} />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-yellow-300">
              <Sparkles size={14} />
              Coming Soon
            </div>

            <h1 className="mt-5 text-3xl font-bold sm:text-4xl">{title}</h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-purple-100 sm:text-lg">
              {description}
            </p>
          </div>
        </div>

        <div className="px-6 py-8 text-center sm:px-10">
          <p className="text-sm leading-7 text-gray-600">
            We are preparing this section of the member portal to provide you
            with a better experience. Please check back soon for updates.
          </p>

          <Link
            to="/ogboni-dashboard"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-purple-900 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-purple-800"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
