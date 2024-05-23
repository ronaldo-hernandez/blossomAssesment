import axios from 'axios';
import {CharacterFilter, Characters} from '../types/schemaEntryData';

const BASE_URL = 'https://rickandmortyapi.com/graphql';


/* Construccion de resolver para realizar consultas en la web a partir de axios. */

const resolvers = {
  charactersByFilter: async ({ filter }: { filter: CharacterFilter }): Promise<Characters> => {
    try {
      const query = `
        query GetCharacterByFilter($filter: FilterCharacter) {
          characters(filter: $filter) {
            results {
              id
              name
              status
              species
              type
              gender
              origin {
                name
              }
              location {
                name
              }
              image
              created
            }
          }
        }
      `;
      const variables = { filter };
      const response = await axios.post(BASE_URL, { query, variables });
      const character = response.data.data.characters;
      return character;
    } catch (error) {
      throw new Error('Error fetching character by filter');
    }
  },
};

export default resolvers;


