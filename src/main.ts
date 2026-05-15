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
    | "Chinese"
    | "Israeli-American"
    | "Israeli";
};

//TYPE GUARD

function isActress(data: unknown): data is Actress {
  const validNationalities = [
    "American",
    "British",
    "Australian",
    "South African",
    "French",
    "Indian",
    "Spanish",
    "South Korean",
    "Chinese",
    "Israeli-American",
    "Israeli",
  ];

  if (
    data &&
    typeof data === "object" &&
    data !== null &&
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
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every((m) => typeof m === "string") &&
    "awards" in data &&
    typeof data.awards === "string" &&
    "nationality" in data &&
    typeof data.nationality === "string" &&
    validNationalities.includes(data.nationality)
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

async function getAllActresses(): Promise<Actress[]> {
  try {
    const resp = await fetch(`http://localhost:3333/actresses`);
    if (!resp.ok) {
      throw new Error(`Errore HTTP ${resp.status}: ${resp.statusText}`);
    }
    const data: unknown = await resp.json();
    if (!(data instanceof Array)) {
      throw new Error("Dati non validi");
    }

    const validateActresses: Actress[] = data.filter(isActress);

    return validateActresses;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    return [];
  }
}

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const resp = await Promise.all(ids.map((id) => getActress(id)));
    return resp;
    
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error);
    }
    return [];
  }
}

(async () => {
  const actress = await getActress(4);
  const allActresses = await getAllActresses();
  const actresses = await getActresses([1, 6, 4]);
  console.log(actress, allActresses, actresses);
})();
