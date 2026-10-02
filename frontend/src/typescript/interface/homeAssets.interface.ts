export type SectionType =
  | "hero"
  | "career_accelerator"
  | "category"
  | "featured"
  | "trending"
  | "footer";

export interface HomeSectionAsset {
  _id: string;
  section: SectionType | string;
  title: string;
  description: string;
  __v?: number;
}
