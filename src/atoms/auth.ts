import { User } from "@junobuild/core-peer";
import { atom } from "recoil";

export const authState = atom({
  key: "auth",
  default: null as User | null,
});
