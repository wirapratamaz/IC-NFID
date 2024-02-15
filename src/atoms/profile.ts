import { Doc, getDoc, setDoc } from "@junobuild/core-peer";
import { atom } from "recoil";

// Constants
const PROFILES_COLLECTION = "profiles";
const PROFILE_KEY = "profile";

// Type definition for a profile
export type Profile = {
  username: string;
  bio: string;
  avatarSvg: string;
  color: string;
  timezone: string;
  currency: string;
};

// State atom for a profile
export const profileState = atom({
  key: PROFILE_KEY,
  default: null as Profile | null,
});

/**
 * Fetch a profile based on a user key.
 * @param {string} userKey - The key of the user.
 * @return {Promise<Doc<Profile> | null>} The user's profile or null if not found.
 */
export async function fetchProfile(userKey: string): Promise<Doc<Profile> | null> {
  try {
    const _profile = await getDoc<Profile>({
      collection: PROFILES_COLLECTION,
      key: userKey,
    });

    console.log("fetchProfile", _profile);

    return _profile ? _profile : null;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

/**
 * Create or update a profile.
 * @param {string} authKey - The authentication key of the user.
 * @param {Profile} data - The profile data to set.
 * @return {Profile} The profile data that was set.
 */
export async function createOrUpdateProfile(authKey: string, data: Profile): Promise<Profile> {
  // validate to check all set
  if (!data.currency || !data.timezone){
    throw new Error("Currency and Timezone are required");
  }
  
  try {
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

    return data as Profile;
  } catch (error) {
    console.error("Failed to create or update profile:", error);
    throw data;
  }
}