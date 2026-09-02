import { Link, useLocation } from "react-router-dom";

const MembershipPending = () => {
  const location = useLocation();

  const email = location.state?.email;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="bg-purple-950 px-8 py-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500">
              <span className="text-4xl">⏳</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
              Membership Pending
            </h1>

            <p className="mt-3 text-purple-100 text-lg">
              Your membership application is currently being reviewed.
            </p>
          </div>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <div className="p-8 md:p-10">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-purple-900 mb-3">
                Your account is not yet approved
              </h2>

              <p className="text-gray-700 leading-7">
                You have successfully created your member account, but your
                membership has not yet been approved by the administration.
              </p>

              {email && (
                <p className="text-gray-700 mt-4">
                  <strong>Email:</strong> {email}
                </p>
              )}
            </div>

            {/* ==================================================
                WHAT HAPPENS NEXT
            ================================================== */}

            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-purple-900">
                What happens next?
              </h2>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold">
                  1
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Application Review
                  </h3>

                  <p className="text-gray-600 mt-1 leading-6">
                    Our administration will review your membership application.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold">
                  2
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Membership Approval
                  </h3>

                  <p className="text-gray-600 mt-1 leading-6">
                    Once your application is approved, you will receive an
                    approval email with the next steps.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold">
                  3
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Complete Your Membership
                  </h3>

                  <p className="text-gray-600 mt-1 leading-6">
                    Follow the instructions in your approval email to continue
                    with the membership process.
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================
                NOTICE
            ================================================== */}

            <div className="mt-8 bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <p className="text-purple-900 leading-7">
                <strong>Please do not create another account.</strong> Your
                existing account will become available once your membership has
                been approved.
              </p>
            </div>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 text-center bg-purple-900 hover:bg-purple-800 text-white py-4 rounded-xl font-bold transition"
              >
                Return Home
              </Link>

              <Link
                to="/login"
                className="flex-1 text-center border-2 border-purple-900 text-purple-900 hover:bg-purple-50 py-4 rounded-xl font-bold transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPending;
