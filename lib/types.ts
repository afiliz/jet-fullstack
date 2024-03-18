export type Jet = {
  id: number;
  name: string;
  wingspan: number;
  engines: number;
  year: number;
};

export interface Jets extends Array<Jet> { }
