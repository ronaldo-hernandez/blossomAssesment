

/* Manejo de datos de capturación o parse a traves de interfaces con objetos de inserción y mapeo. */


export interface CharacterFilter {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
    origin?: string;
  }
  
  export interface Character {
    id:number;
    name: string;
    status: string;
    species: string;
    type:string;
    gender: string;
    origin: {
      name: string;
    };
    location: {
      name: string;
    };
    image:string;
    created:string;
  }
  
export interface Characters {
    results : Character[];
  }


export type CharacterInPsgl = {
    id_char: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin_name: string;
    location_name: string;
    image: string;
    created: string;
}