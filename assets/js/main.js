const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modalDetails = document.getElementById('modalDetails')
const modalBody = document.getElementById('modalBody')

let latestPokemons = [];
const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li id="selectPokemon-${pokemon.number}" class="transition-all delay-100 cursor-pointer rounded-lg shadow-lg flex flex-col ma-2 p-4 bg-${pokemon.type} hover:shadow-xl hover:opacity-[0.9]">
            <span class="text-white text-right text-xs opacity-[0.7] capitalize text-2xl font-bold">#${pokemon.number}</span>
            <span class="text-xl capitalize text-white font-extrabold mb-3">${pokemon.name}</span>

            <div class="flex flex-row items-center justify-between">
                <ol class="p-0 m-0">
                    ${pokemon.types.map((type) => `<li class="shadow-md capitalize text-sm text-[#eee] px-3 py-1 text-sm mx-1 my-0 rounded-2xl brightness-[1.1] text-center mb-1 bg-${type}">${type}</li>`).join('')}
                </ol>

                <img class="max-w-[80px] h-20 lg:max-w-[100px] lg:h-20" src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}


function showModalPokemonDetails(pokemon) {
    modalDetails.classList.toggle('hidden');

    const newModalBody = `
            <div class="flex flex-col px-0 pb-0 w-full transform overflow-hidden rounded-3xl bg-${pokemon.type} shadow-xl transition-all my-[0rem] xs:my-[5rem] sm:my-[6.5rem] md:my-[6.5rem] lg:md:my-[6.5rem] w-full max-w-md">
            <div class="flex flex-row items-center justify-end">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <svg id="closedModal" xmlns="http://www.w3.org/2000/svg" class="transform transition-all delay-100 cursor-pointer h-7 w-7 rounded-full hover:bg-white text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            </div>
            <div class="flex-[2_2_0%] flex flex-col ma-2 px-6 pb-0">
            <div class="flex flex-row items-center justify-between">
                <div class="flex flex-col">
                    <span class="text-left text-3xl capitalize text-white font-extrabold mb-1 z-10">${pokemon.name}</span>
                    <ol class="flex flex-row p-0 m-0 gap-1 z-10">
                        ${pokemon.types.map((type) => `<li class="pointer-events-none shadow-md capitalize text-sm text-[#eee] px-3 py-1 text-sm rounded-2xl brightness-[1.1] text-center mb-1 bg-${type}">${type}</li>`).join('')}
                    </ol>
                </div>
                <span class="text-white text-right opacity-[0.7] capitalize text-md font-bold z-10">#${pokemon.number}</span>
            </div>
            </div>

            <div class="flex-[2_2_0%] lg:flex-[3_3_0%] flex justify-center flex-col ma-2 px-8 bg-white w-full rounded-t-3xl">
            <div class="flex justify-center relative">
                <img class="w-[17rem] h-[29.5rem] absolute pointer-events-none top-[-26.0rem]" src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
            <ol class="flex flex-row gap-2 justify-between text-md font-normal mb-6">
                <li class="hover:bg-gray-100 transform transition-all delay-100 cursor-pointer flex items-center border-b-2 border-transparent">About</li>
                <li class="hover:bg-gray-100 transform transition-all delay-100 cursor-pointer flex items-center border-b-2 border-${pokemon.type}">Stats</li>
                <li class="hover:bg-gray-100 transform transition-all delay-100 cursor-pointer flex items-center border-b-2 border-transparent">Evolution</li>
                <li class="hover:bg-gray-100 transform transition-all delay-100 cursor-pointer flex items-center border-b-2 border-transparent">Movies</li>
            </ol>

            <ol class="m-0 gap-2 show-selected-option h-[11rem] About hidden">
                <li class="flex items-center py-1">
                    <span class="w-[150px] text-sm capitalize font-medium opacity-[0.7] mr-5">Height</span>
                    <span class="w-[100%] text-left text-md font-medium">${pokemon.height}</span>
                </li>
                <li class="flex items-center py-1">
                    <span class="w-[150px] text-sm capitalize font-medium opacity-[0.7] mr-5">Weight</span>
                    <span class="w-[100%] text-left text-md font-medium">${pokemon.weight}</span>
                </li>
                <li class="flex items-center py-1">
                    <span class="w-[150px] text-sm capitalize font-medium opacity-[0.7] mr-5">Base Happiness</span>
                    <span class="w-[100%] text-left text-md font-medium">${pokemon.baseHappiness}</span>
                </li>
                <li class="flex items-center py-1">
                    <span class="w-[150px] text-sm capitalize font-medium opacity-[0.7] mr-5">Habitat</span>
                    <span class="w-[100%] text-left text-md font-medium">${pokemon.habitat}</span>
                </li>
                <li class="flex items-center py-1">
                    <span class="w-[150px] text-sm capitalize font-medium opacity-[0.7] mr-5">Color</span>
                    <span class="w-[100%] text-left text-md font-medium">${pokemon.color.name}</span>
                </li>
                <li class="flex items-center py-1">
                    <span class="w-[150px] text-sm capitalize font-medium opacity-[0.7] mr-5">EggGroups</span>
                    <span class="w-[100%] text-left text-md font-medium">${pokemon.eggGroups.join(', ')}</span>
                </li>
            </ol>

            <ol class="m-0 gap-2 show-selected-option h-[11rem] Stats">
                ${pokemon.stats.map((stats) => `
                <li class="flex items-center py-1">
                    <span class="w-[150px] text-sm capitalize font-medium opacity-[0.7]">${stats.name}</span>
                    <span class="w-[40px] text-right text-md font-medium mr-2">${stats.baseStats}</span>
                    <div class="relative w-[100%] h-[11px] bg-transparent border-2 rounded-2xl">
                        <span class="absolute w-[${stats.statusBarPercentage}%] h-[7px] rounded-2xl ${stats.baseStats <= 50 ? 'bg-red-500' : stats.baseStats > 50 && stats.baseStats < 100 ? 'bg-orange-500' : 'bg-green-500'}"></span>
                    </div>
                </li>`).join('')}
            </ol>

            <ol class="m-0 gap-2 show-selected-option h-[11rem] Evolution hidden">
                ${pokemon.evolutionTo.map((evolution) =>`
                    <li class="flex items-center py-1">
                        <span class="w-[150px] text-left text-sm capitalize font-medium opacity-[0.7] mr-5">${evolution.id}</span>
                        <span class="w-[100%] text-left text-md font-medium">${evolution.name}</span>
                        <span class="w-[100%] text-left text-md font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" class="text-center transform transition-all delay-100 cursor-pointer h-7 w-7 rounded-full hover:bg-white text-blue-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                            </svg>
                        </span>
                    </li>
                `).join('')}
            </ol>

            <ol class="m-0 gap-2 show-selected-option h-[11rem] Movies hidden">
                ${pokemon.abilities.map((ability, index) =>`
                    <li class="flex items-center py-1">
                        <span class="w-[150px] text-sm capitalize font-medium opacity-[0.7] mr-5">Ability - ${index + 1}</span>
                        <span class="w-[100%] text-left text-md font-medium">${ability.name}</span>
                    </li>
                `).join('')}
            </ol>
            </div>
        </div>
    `
    modalBody.innerHTML = newModalBody

    closedModal()
    selectedOptions(pokemon)
}

function closedModal() {
    const closedModal = document.getElementById('closedModal')
    closedModal.addEventListener('click', () => modalDetails.classList.toggle('hidden'))
}

function selectedOptions(pokemon){
    const options = document.querySelector('.flex.flex-row.gap-2.justify-between.text-md.font-normal.mb-6')
    const showSelectedOption = document.querySelectorAll('.m-0.gap-2.show-selected-option')

    options.addEventListener('click', (event) => {
        const selectedOption = event.target

        const correspondingContent = document.querySelector(`.${selectedOption.outerText}`)

        if (selectedOption.nodeName != 'OL') {
            options.querySelectorAll('li').forEach(option => {
                option.classList.add(`border-transparent`)
                option.classList.remove(`border-${pokemon.type}`)
            });
    
            selectedOption.classList.add(`border-${pokemon.type}`)

            showSelectedOption.forEach(option => {
                option.classList.add(`hidden`)
            })

            correspondingContent.classList.remove(`hidden`)
        }
    })
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        latestPokemons = [ ...latestPokemons, ...pokemons ]

        latestPokemons.forEach(pokemon => {
            const getPokemon = document.getElementById(`selectPokemon-${pokemon.number}`);
            getPokemon.removeEventListener('click', () => showModalPokemonDetails(pokemon));
            getPokemon.addEventListener('click', () => showModalPokemonDetails(pokemon));
        });
        
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
