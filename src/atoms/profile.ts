import { Doc, getDoc, setDoc } from "@junobuild/core-peer";
import { atom } from "recoil";

export const PROFILES_COLLECTION = "profiles";

export type Profile = {
  username: string;
  bio: string;
  avatarSvg: string;
  color: string;
  timezone: string;
  currency: string;
};

export const profileState = atom({
  key: "profile",
  default: null as Profile | null,
});

export async function fetchProfile(
  userKey: string
): Promise<Doc<Profile> | null> {
  const _profile = await getDoc<Profile>({
    collection: PROFILES_COLLECTION,
    key: userKey,
  });

  console.log("fetchProfile", _profile);

  return _profile ? _profile : null;
}

export async function createOrUpdateProfile(authKey: string, data: Profile) {
  const prevProfile = await fetchProfile(authKey);

  await setDoc<Profile>({
    collection: PROFILES_COLLECTION,
    doc: {
      ...(prevProfile ? prevProfile : {}),
      key: authKey,
      description: `@${data.username}`,
      data,
    },
  });

  return data;
}
