import Image from "next/image";

const AnnouncementBar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="group relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-[url('/images/announcementbar/announcementbar-bg.jpg')] bg-cover bg-center bg-no-repeat" />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
