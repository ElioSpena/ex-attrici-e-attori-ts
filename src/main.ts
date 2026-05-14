console.log("prova");

//TYPE ALIAS

type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality:
    | "American"
    | "British"
    | "Australian"
    | "South African"
    | "French"
    | "Indian"
    | "Spanish"
    | "South Korean"
    | "Chinese";
};

//TYPE GUARD

function isActress(data: unknown): data is Actress {
  if (
    data &&
    typeof data === "object" &&
    "id" in data &&
    typeof data.id === "number" &&
    "name" in data &&
    typeof data.name === "string" &&
    "birth_year" in data &&
    typeof data.birth_year === "number" &&
    (!("death_year" in data) || typeof data.death_year === "number") &&
    "biography" in data &&
    typeof data.biography === "string" &&
    "image" in data &&
    typeof data.image === "string" &&
    "most_famous_movies" in data &&
    Array.isArray(data.most_famous_movies) &&
    data.most_famous_movies.length === 3 &&
    "awards" in data &&
    typeof data.awards === "string" &&
    "nationality" in data &&
    typeof data.nationality === "string"
  ) {
    return true;
  }
  return false;
}

//FETCH CON GENERICS
async function getActress(id: number): Promise<Actress | null> {
  try {
    const resp = await fetch(`http://localhost:3333/actresses/${id}`);
    if (!resp.ok) {
      throw new Error(`Errore ${resp.status}`);
    }
    const data: unknown = await resp.json();
    if (!isActress(data)) {
      throw new Error("Dati non validi");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    return null;
  }
}

(async () => {
  const user = await getActress(4);

  console.log(user);
})();
