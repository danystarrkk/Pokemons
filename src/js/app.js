document.addEventListener("DOMContentLoaded", () => {

  // #region Generate generation
  const navegation = document.getElementById('nav')
  const generations = ["Generation 1", "Generation 2", "Generation 3", "Generation 4", "Generation 5", "Generation 6", "Generation 7",];
  var navHtml = "";

  generations.forEach((generation, index) => {
    navHtml += `<input name="option" class="option" id="${index + 1}" type="radio"></input> <label for="${index + 1}">${generation}</label>`;
  })
  navegation.innerHTML = navHtml;
  // #endregion

  // #region Fetch Pokemons
  const fetchPokemons = async endpoint => {
    let pokemons;
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "aplication/json"
        }
      });

      pokemons = await response.json();
    } catch (error) {
      console.log('Error en la comunicación');
    }
    return pokemons.pokemon_species;
  }
  // #endregion

  //#region Insert Pokemons in HTML
  async function insertPokemons(numberGeneration) {
    const main = document.querySelector(".main");
    let mainPokemon = "";
    let endpoint = `https://pokeapi.co/api/v2/generation/${numberGeneration}/`
    let pokemons = [];
    pokemons = await fetchPokemons(endpoint);
    pokemons.sort((a, b) => {
      return a.url.substring(a.url.lastIndexOf("s/") + 2, a.url.lastIndexOf("/")) - b.url.substring(b.url.lastIndexOf("s/") + 2, b.url.lastIndexOf("/"));
    });

    pokemons.forEach((pokemon, index) => {
      mainPokemon += `
      <div class="contPokemon"> 
        <h3 class="pokemonName">${pokemon.name}</h3> 
      </div>`
    })

    main.innerHTML = mainPokemon;

    // # region Intersect Observ

    const imgOptions = {};
    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          var dataImage = img.getAttribute("data-image");
          img.src = dataImage;
          imgObserver.unobserve(img);
        } else {
          return;
        }
      })
    });

    // # endregion

    // #region Image
    let urlImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
    let urlGifLoad = "https://i.ibb.co/b4HPfpw/4xjS.gif"
    const pokemonsHTML = document.querySelectorAll(".contPokemon");

    pokemons.forEach((pokemon, index) => {
      let number = pokemon.url.substring(pokemon.url.lastIndexOf("s/") + 2, pokemon.url.lastIndexOf("/"));
      let img = new Image();
      img.setAttribute('src', urlGifLoad);
      img.setAttribute("data-image", urlImage + number + ".png");
      img.setAttribute("class", "pokemonimg");
      img.setAttribute("alt", pokemon.name);
      img.setAttribute("loading", "lazy");
      img.setAttribute("width", "70px");
      img.setAttribute("height", "70px");
      pokemonsHTML[index].appendChild(img);
      imgObserver.observe(img);
    });

  }
  // #endregion

  // # region Click Detect
  let options = document.querySelectorAll('.option');
  let generationOption = 1;

  options.forEach((option, index) => {
    insertPokemons(generationOption);
    option.onclick = () => {
      generationOption = index + 1;
      insertPokemons(generationOption);
    }
  })
  // #endregion
});