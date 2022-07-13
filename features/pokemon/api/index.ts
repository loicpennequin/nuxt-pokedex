import {
  INamedApiResourceList,
  IPokemonSpecies,
  IPokemon,
  IChainLink,
  IEvolutionChain
} from 'pokeapi-typescript';
import { POKEAPI_BASE_URL, POKEAPI_ENDPOINTS } from '../constants';
import { createPokemon } from '../factories/pokemonFactory';
import { FindAllPokemonsDto } from './dtos';

const pokemonApi = <T>(url: string, options?: any): Promise<T> =>
  $fetch<T>(url, {
    ...options,
    baseURL: POKEAPI_BASE_URL
  }) as Promise<T>;

export type Pokemon = ReturnType<typeof createPokemon>;
export type EvoltutionChain = Pokemon[][];

export const findAllPokemons = ({ limit, offset }: FindAllPokemonsDto) =>
  pokemonApi<INamedApiResourceList<IPokemonSpecies>>(
    POKEAPI_ENDPOINTS.SPECIES,
    {
      params: {
        limit,
        offset
      }
    }
  );

export const findPokemonByName = async (name: string) => {
  const species = await pokemonApi<IPokemonSpecies>(
    `${POKEAPI_ENDPOINTS.SPECIES}/${name}`
  );
  const pokemon = await pokemonApi<IPokemon>(species.varieties[0].pokemon.url);

  return createPokemon({ species, pokemon });
};

export const findPokemonsByEvolutionLink = (links: IChainLink[]) => {
  return Promise.all(
    links.map(link => {
      return findPokemonByName(link.species.name);
    })
  );
};

export const findEvolutionChain = async (evolutionChainId: number) => {
  const data = await pokemonApi<IEvolutionChain>(
    `${POKEAPI_ENDPOINTS.EVOLUTION_CHAIN}/${evolutionChainId}`
  );

  const chain: EvoltutionChain = [
    [await findPokemonByName(data.chain.species.name)]
  ];

  let link = data.chain.evolves_to;
  while (link.length) {
    chain.push(await findPokemonsByEvolutionLink(link));
    link = link[0].evolves_to;
  }

  return chain;
};
