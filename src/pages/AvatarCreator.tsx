import { AvatarCreator as AvatarCreatorComponent } from "@/components/profile/avatar/AvatarCreator";

const AvatarCreator = () => {
  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-4xl font-playfair font-bold mb-8 text-center bg-gradient-to-r from-bright-pink via-bright-blue to-neon-green bg-clip-text text-transparent">
        Customise Your Avatar
      </h1>
      <AvatarCreatorComponent className="w-full" />
    </div>
  );
};

export default AvatarCreator;
