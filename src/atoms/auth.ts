import { User } from "@junobuild/core-peer";
import { atom } from "recoil";
import { AuthClient} from '@dfinity/auth-client';

export const authState = atom({
  key: "auth",
  default: null as User | null,
});
