export interface SecretSanta {
  id?: number
  participants: Participant[]
}

export interface Participant {
  name: string,
  excludes: string[];
  to?: string;
}
