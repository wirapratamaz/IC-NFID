import { atom } from "recoil";

export type Profile = {
  username: string;
  avatarSvg: string;
  color: string;
};

export const profileState = atom({
  key: "profile",
  default: null as Profile | null,
});
