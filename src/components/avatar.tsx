import { Profile } from "@/atoms/profile";

type AvatarProps = {
  profile: Profile;
};

export function Avatar({ profile }: AvatarProps) {
  return (
    <div
      className="w-8 h-8 rounded-md"
      dangerouslySetInnerHTML={{ __html: profile.avatarSvg }}
      style={{ backgroundColor: profile.color }}
    ></div>
  );
}
