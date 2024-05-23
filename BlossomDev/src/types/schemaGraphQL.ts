import { buildSchema } from 'graphql';

/* Construcción de esquema de tipo del modelo de querys que se recibirian y que serian integradas en la ruta de graphql para el manejo de solicitudes en la API externa.  */
const schema = buildSchema(`
  type Character {
    id: ID
    name: String
    status: String
    species: String
    type: String
    gender: String
    origin: Origin
    location: Location
    image: String
    created: String
  }

  type Origin {
    name: String
  }
  type Location {
    name: String
  }

  input CharacterFilter {
    name: String
    status: String
    species: String
    gender: String
    origin: String
  }
  type Characters {
    results: [Character]
  }
  type Query {
    charactersByFilter(filter: CharacterFilter): Characters
  }
`);

export default schema;
