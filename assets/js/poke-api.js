
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {

    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.stats = pokeDetail.stats.map((stats) => ({ 
        name: stats.stat.name === 'special-attack' ? 'Special-Atk': stats.stat.name === 'special-defense' ? 'Special-Def' : stats.stat.name, 
        baseStats: stats.base_stat,
        statusBarPercentage: (stats.base_stat / 150) * 100 
    }))

    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight
    pokemon.abilities = pokeDetail.abilities.map((ability) => ({ name: ability.ability.name, url: ability.ability.url }))
    pokemon.eggGroups = pokeDetail.eggGroups.map((eggGroup) => (eggGroup.name))
    pokemon.color = pokeDetail.color
    pokemon.baseHappiness = pokeDetail.baseHappiness
    pokemon.shape = pokeDetail.shape
    pokemon.habitat = pokeDetail.habitat
    pokemon.evolutionTo = pokeDetail.evolutionChain.map((evolution) => ({ name: evolution.name, id: evolution.id }))

    console.log(pokemon)
    return pokemon
}

pokeApi.getPokemonEvolutionChain = async (evolutionChainUrl) => {
    if (!evolutionChainUrl) {
        return { evolutionChain: [] };
    }

    const response = await fetch(evolutionChainUrl);
    const pokeEvolutionChain = await response.json();

    const evolutionChain = pokeEvolutionChain.chain.evolves_to.flatMap((two) => {
        const envolves = [
            { name: pokeEvolutionChain.chain.species.name, id: pokeEvolutionChain.chain.species.url.split('/').slice(-2, -1)[0] },
            { name: two.species.name, id: two.species.url.split('/').slice(-2, -1)[0] },
            ...two.evolves_to.flatMap((three) => [
                { name: three.species.name, id: three.species.url.split('/').slice(-2, -1)[0] },
                ...three.evolves_to.map((four) => ({
                    name: four.species.name,
                    id: four.species.url.split('/').slice(-2, -1)[0],
                })),
            ]),
        ];

        return envolves;
    });

    return { evolutionChain };
};


pokeApi.getPokemonSpecie = async (pokeDetail) => {
    const response = await fetch(pokeDetail.species.url)
    const pokeSpecie = await response.json()

    return {
        eggGroups: pokeSpecie.egg_groups,
        color: pokeSpecie.color,
        baseHappiness: pokeSpecie.base_happiness,
        shape: pokeSpecie.shape.name,
        habitat: pokeSpecie.habitat.name,
        evolutionChain: pokeSpecie.evolution_chain.url
    }
}


pokeApi.getPokemonDetail = async (pokemon) => {
    const response = await fetch(pokemon.url)
    const pokeDetail = await response.json()
    const specieRequests = await pokeApi.getPokemonSpecie(pokeDetail)
    const EvolutionChainRequests = await pokeApi.getPokemonEvolutionChain(specieRequests.evolutionChain)
    return convertPokeApiDetailToPokemon({...pokeDetail, ...specieRequests, ...EvolutionChainRequests})
}

pokeApi.getPokemons = async (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    const response = await fetch(url)
    const jsonBody = await response.json()
    const pokemons = jsonBody.results
    const detailRequests = pokemons.map(pokeApi.getPokemonDetail)
    const pokemonsDetails = await Promise.all(detailRequests)
    return pokemonsDetails
}
