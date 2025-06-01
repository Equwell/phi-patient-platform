import type { Language } from '~core/enums/language.enum';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  language: Language;
  favouritePokemonId: number;
  caughtPokemonIds: number[];
};
