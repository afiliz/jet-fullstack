export type Jet = {
  id: number;
  name: string;
  wingspan: number;
  engines: number;
  year: number;
};

export interface Jets extends Array<Jet> { }

export type Rank = {
  rank: number;
  name: string;
  value: string;
}

export interface Rankings extends Array<Rank> {}