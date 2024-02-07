import { atom } from "recoil";

export type Profile = {
  username: string;
};

export const authState = atom({
  key: "profile",
  default: null as Profile | null,
});
