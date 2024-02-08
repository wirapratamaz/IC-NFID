import { Doc, getDoc, setDoc } from "@junobuild/core-peer";
import { atom } from "recoil";
import { nanoid } from "nanoid";

export const PASTES_COLLECTION = "pastes";

export type Paste = {
  title: string;
  language: string;
  content: string;
};

export const pastState = atom({
  key: "paste",
  default: "",
});

export async function fetchPaste(id: string): Promise<Doc<Paste> | null> {
  const _paste = await getDoc<Paste>({
    collection: PASTES_COLLECTION,
    key: id,
  });

  return _paste ? _paste : null;
}

export async function createPaste(data: Paste): Promise<Doc<Paste>> {
  const key = nanoid();
  const doc = await setDoc<Paste>({
    collection: PASTES_COLLECTION,
    doc: {
      key,
      data,
    },
  });

  return doc;
}
