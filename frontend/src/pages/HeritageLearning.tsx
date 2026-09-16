import {
  ArrowLeft,
  BookOpen,
  Heart,
  HandHeart,
  ShieldCheck,
  Users,
  Sprout,
  Scale,
  Crown,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";

import MemberPortalLayout from "../components/member/MemberPortalLayout";

const HeritageLearning = () => {
  return (
    <MemberPortalLayout>
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          to="/ogboni-dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-purple-900 transition hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-purple-950 px-6 py-12 text-white shadow-xl sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-400/10" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-yellow-400/10" />

          <div className="relative max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-yellow-300">
              <BookOpen size={15} />
              Heritage & Learning
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              The Character, Responsibility & Legacy of an Ogboni
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-purple-100 sm:text-lg">
              Membership is not only a connection to a fraternity. It is a
              responsibility to live with good character, serve humanity,
              strengthen brotherhood, and preserve the heritage entrusted to us
              for generations to come.
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="mt-10 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-900">
              <ShieldCheck size={27} />
            </div>

            <h2 className="text-2xl font-bold text-purple-950 sm:text-3xl">
              A Life of Character and Responsibility
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
              An Ogboni should strive to be a person of peace, wisdom,
              discipline, compassion and integrity. In moments of difficulty, an
              Ogboni should seek understanding before reaction and wisdom before
              conflict.
            </p>

            <p className="mt-4 text-base leading-8 text-gray-600 sm:text-lg">
              The values we carry into our homes, communities, workplaces and
              relationships are part of the legacy we leave behind.
            </p>
          </div>
        </section>

        {/* Core Principles */}
        <section className="mt-10">
          <div className="mb-7 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-700">
              Core Principles
            </p>

            <h2 className="mt-2 text-2xl font-bold text-purple-950 sm:text-3xl">
              Principles to Live By
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              These principles should guide how we conduct ourselves within the
              fraternity and in society.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Calmness */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
                <Scale size={23} />
              </div>

              <h3 className="text-xl font-bold text-purple-950">
                Calmness in Chaos
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                When others are overwhelmed by anger, fear or confusion, an
                Ogboni should strive to remain calm. Think carefully, listen
                before responding, and seek peaceful solutions rather than
                adding to conflict.
              </p>
            </article>

            {/* Emotional Discipline */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
                <ShieldCheck size={23} />
              </div>

              <h3 className="text-xl font-bold text-purple-950">
                Keeping Emotions in Check
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                An Ogboni should strive to remain in control of their emotions
                in every situation. Whether facing anger, disappointment,
                provocation, pressure or disagreement, a member should avoid
                allowing emotions to dictate their words or actions. Pause,
                think carefully and respond with wisdom, dignity and
                self-control.
              </p>
            </article>

            {/* Character */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
                <Crown size={23} />
              </div>

              <h3 className="text-xl font-bold text-purple-950">
                Good Character
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Character should be demonstrated through honesty, respect,
                self-control, responsibility and compassion. A member's conduct
                should bring dignity to their family, community and fraternity.
              </p>
            </article>

            {/* Humanity */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
                <HandHeart size={23} />
              </div>

              <h3 className="text-xl font-bold text-purple-950">
                Service to Humanity
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We should look beyond ourselves. Helping a neighbour, supporting
                someone facing hardship, sharing knowledge and contributing
                positively to society are meaningful expressions of service.
              </p>
            </article>

            {/* Brotherhood */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
                <Heart size={23} />
              </div>

              <h3 className="text-xl font-bold text-purple-950">
                Brotherhood & Love
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Brotherhood grows through love, respect, loyalty and genuine
                concern for one another. Members should seek unity, encourage
                one another and avoid actions that unnecessarily divide the
                fraternity.
              </p>
            </article>

            {/* Member Growth */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
                <Users size={23} />
              </div>

              <h3 className="text-xl font-bold text-purple-950">
                Strengthening Fellow Members
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                A strong fraternity is built when members help one another grow.
                Share useful knowledge, encourage legitimate opportunities,
                mentor others and support initiatives that strengthen the lives
                of fellow members.
              </p>
            </article>

            {/* Legacy */}
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-900">
                <Sprout size={23} />
              </div>

              <h3 className="text-xl font-bold text-purple-950">
                Preserving the Legacy
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                The Ajangbile Heritage is a responsibility entrusted from one
                generation to another. We should protect its dignity, learn from
                its history and conduct ourselves in ways that allow the legacy
                to remain meaningful for those who come after us.
              </p>
            </article>
          </div>
        </section>

        {/* Society */}
        <section className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="grid lg:grid-cols-2">
            <div className="bg-purple-900 p-7 text-white sm:p-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-purple-950">
                <Users size={23} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-300">
                Our Place in Society
              </p>

              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Let Our Actions Speak
              </h2>

              <p className="mt-5 leading-8 text-purple-100">
                An Ogboni should strive to be a source of peace, wisdom and
                positive influence in the community. Our values should not
                remain within the walls of the fraternity; they should be
                reflected in how we treat our families, neighbours, colleagues
                and fellow human beings.
              </p>
            </div>

            <div className="p-7 sm:p-10">
              <ul className="space-y-5">
                {[
                  "Remain peaceful and thoughtful when conflict arises.",
                  "Treat people with dignity and respect.",
                  "Help those who genuinely need assistance.",
                  "Be trustworthy in personal and professional relationships.",
                  "Use knowledge and experience to uplift others.",
                  "Represent the heritage with dignity and responsibility.",
                ].map((principle) => (
                  <li
                    key={principle}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-900">
                      <ShieldCheck size={14} />
                    </div>

                    <span className="leading-7">{principle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Legacy */}
        <section className="mt-10 rounded-3xl border border-yellow-200 bg-yellow-50 p-7 shadow-sm sm:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-purple-900 text-yellow-400">
              <Sprout size={27} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-800">
              Our Responsibility
            </p>

            <h2 className="mt-2 text-2xl font-bold text-purple-950 sm:text-3xl">
              Build for Those Who Come After Us
            </h2>

            <p className="mt-5 text-base leading-8 text-gray-700 sm:text-lg">
              We are temporary custodians of a heritage that should outlive each
              generation. The choices we make today can determine what our
              children and future generations inherit tomorrow.
            </p>

            <p className="mt-4 text-base leading-8 text-gray-700 sm:text-lg">
              Let us preserve the values, dignity, knowledge, unity and
              brotherhood that make the Ajangbile Heritage meaningful, so that
              those who come after us can learn from it, benefit from it and
              continue its positive legacy.
            </p>
          </div>
        </section>

        {/* Brotherhood message */}
        <section className="mt-10 rounded-3xl bg-gray-900 px-7 py-10 text-center text-white shadow-xl sm:px-10 sm:py-14">
          <Quote className="mx-auto mb-5 text-yellow-400" size={34} />

          <h2 className="text-2xl font-bold sm:text-3xl">
            Brotherhood Is a Responsibility
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">
            Let our brotherhood be expressed through love, loyalty, respect,
            service and genuine support for one another. When members grow,
            communities grow. When communities grow, the legacy becomes
            stronger.
          </p>

          <div className="mx-auto mt-8 h-px max-w-xs bg-yellow-400/40" />

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-yellow-400">
            Character • Service • Brotherhood • Legacy
          </p>
        </section>
      </div>
    </MemberPortalLayout>
  );
};

export default HeritageLearning;
