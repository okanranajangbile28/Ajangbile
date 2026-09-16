import MemberPortalLayout from "../components/member/MemberPortalLayout";
import ComingSoonPage from "../components/member/ComingSoonPage";

const Gallery = () => {
  return (
    <MemberPortalLayout>
      <ComingSoonPage
        title="Member Gallery"
        description="A dedicated space for photos, memories, fraternity activities and important moments will be available here soon."
        icon="gallery"
      />
    </MemberPortalLayout>
  );
};

export default Gallery;
