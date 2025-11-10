
export interface Hero {
  id: number;
  name: string;
  slug?: string;
  powerstats?:  Powerstats;
  appearance?:  Appearance;
  biography:    Biography;
  work?:        Work;
  connections?: Connections;
  images?:       Image;
}

export interface Appearance {
  gender?:       string;
  race?:         string;
  height?:       string[];
  weight?:       string[];
  "eye-color"?:  string;
  "hair-color"?: string;
}

export interface Biography {
  fullName?:        string;
  alterEgos?:       string;
  aliases?:            string[];
  placeOfBirth?:   string;
  firstAppearance?: string;
  publisher:           string;
  alignment:           Alignment;
}

export interface Connections {
  "group-affiliation"?: string;
  relatives?:           string;
}

export interface Image {
  lg?: string;
}

export interface Powerstats {
  intelligence?: string;
  strength?:     string;
  speed?:        string;
  durability?:   string;
  power?:        string;
  combat?:       string;
}

export interface Work {
  occupation?: string;
  base?:       string;
}

export enum Response {
  SUCCESS = "success",
  ERROR = "error",
}

export enum Alignment {
  GOOD = "good",
  BAD = "bad",
}


export type AddHero = Omit<Hero, 'id'>;
export type RemoveHero = Hero['id'];
