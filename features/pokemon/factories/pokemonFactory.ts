import type {
  IPokemon,
  IPokemonSpecies,
  IFlavorText
} from 'pokeapi-typescript';
import { POKEMON_TYPE_COLORS } from '../constants';

export type NamedApiResource = {
  name: string;
  url: string;
};

export type PokemonStat = NamedApiResource & {
  baseStat: number;
};

export type PokemonSprites = {
  default: string;
  shiny: string;
};

export type PokemonDto = {
  pokemon: IPokemon;
  species: IPokemonSpecies;
};

export const createPokemon = (dto: PokemonDto) => {
  const { pokemon, species } = dto;

  return {
    id: pokemon.id,
    name: species.name,
    height: pokemon.height,
    weight: pokemon.weight,
    types: pokemon.types.map(type => ({
      ...type.type,
      ...POKEMON_TYPE_COLORS[type.type.name as keyof typeof POKEMON_TYPE_COLORS]
    })),
    stats: pokemon.stats.map(stat => ({
      baseStat: stat.base_stat,
      ...stat.stat
    })),
    sprites: {
      default: pokemon.sprites.front_default,
      shiny: pokemon.sprites.front_shiny
    },

    description: (
      species.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      ) as IFlavorText
    ).flavor_text.replace('\u000C', ' '),

    evolutionChainId: species.evolution_chain
      ? parseInt(species.evolution_chain.url.split('/').reverse()[1])
      : null
  };
};
