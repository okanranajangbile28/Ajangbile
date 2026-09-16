import MemberPortalLayout from "../components/member/MemberPortalLayout";
import ComingSoonPage from "../components/member/ComingSoonPage";

const Notifications = () => {
  return (
    <MemberPortalLayout>
      <ComingSoonPage
        title="Notifications"
        description="Important member alerts, reminders, updates and personalized notifications will appear here soon."
        icon="notifications"
      />
    </MemberPortalLayout>
  );
};

export default Notifications;
