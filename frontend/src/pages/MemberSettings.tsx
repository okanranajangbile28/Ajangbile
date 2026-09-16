import MemberPortalLayout from "../components/member/MemberPortalLayout";
import ComingSoonPage from "../components/member/ComingSoonPage";

const MemberSettings = () => {
  return (
    <MemberPortalLayout>
      <ComingSoonPage
        title="Account Settings"
        description="Your account preferences, security options and member portal settings will be available here soon."
        icon="settings"
      />
    </MemberPortalLayout>
  );
};

export default MemberSettings;
