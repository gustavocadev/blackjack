import './style.css';
import _ from 'underscore';

let deck: string[] = [];
const tipos: string[] = ['C', 'D', 'H', 'S'];
const especiales: string[] = ['A', 'J', 'Q', 'K'];
let puntosJugador = 0;
let puntosComputadora = 0;

// this function allows us to create a deck of cards
const createDeck = () => {
  for (let i = 2; i <= 10; i++) {
    for (const tipo of tipos) {
      deck.push(`${i}${tipo}`);
    }
  }

  for (const tipo of tipos) {
    for (const especial of especiales) {
      deck.push(`${especial}${tipo}`);
    }
  }

  console.log(deck);

  deck = _.shuffle(deck);

  console.log(deck);

  return deck;
};

createDeck();

// this function allows us to take a card
const pedirCarta = () => {
  if (deck.length === 0) {
    throw 'No hay cartas en el deck';
  }

  const carta = deck.pop();

  return carta;
};

const valorCarta = (carta: string | undefined) => {
  if (!carta) throw 'No existe carta';

  const valor = carta.substring(0, carta.length - 1);

  if (isNaN(Number(valor))) {
    const puntos = valor === 'A' ? 11 : 10;
    return puntos;
  }
  return Number(valor);
};

const computerPoints = document.querySelector('#computerPoints')!;
const computadora_cartas = document.querySelector('#computadora-cartas')!;
// turno de la computadora
const turnoComputadora = (puntosMinimos: number) => {
  do {
    const carta = pedirCarta();

    puntosComputadora += valorCarta(carta);

    computerPoints.textContent = String(puntosComputadora);
    const imgCarta = document.createElement('img');
    imgCarta.src = `/cartas/${carta}.png`;
    imgCarta.classList.add(
      'w-[150px]',
      'relative',
      'left-[100px]',
      'ml-[-75px]'
    );
    computadora_cartas.append(imgCarta);

    if (puntosMinimos > 21) {
      break;
    }
  } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

  setTimeout(() => {
    if (puntosComputadora === puntosMinimos) {
      alert('Nadie gana');
      return;
    }
    if (puntosMinimos > 21) {
      alert('Computadora gana');
      return;
    }
    if (puntosComputadora > 21) {
      alert('Jugador gana');
      return;
    }
  }, 10);
};

// events
const pedirButton = document.querySelector<HTMLButtonElement>('#pedirButton');
const detenerButton =
  document.querySelector<HTMLButtonElement>('#detenerButton');
const nuevoButton = document.querySelector<HTMLButtonElement>('#nuevoButton');
const playerPoints = document.querySelector('#playerPoints')!;
const jugador_cartas = document.querySelector('#jugador-cartas')!;

pedirButton?.addEventListener('click', () => {
  const carta = pedirCarta();

  puntosJugador += valorCarta(carta);
  playerPoints.textContent = puntosJugador.toString();

  const imgCarta = document.createElement('img');
  imgCarta.src = `/cartas/${carta}.png`;
  imgCarta.classList.add('w-[150px]', 'relative', 'left-[100px]', 'ml-[-75px]');
  jugador_cartas.append(imgCarta);

  if (puntosJugador > 21) {
    console.warn('Perdiste');
    pedirButton.classList.add('bg-blue-800');
    pedirButton.disabled = true;
    detenerButton!.disabled = true;

    turnoComputadora(puntosJugador);
    return;
  }

  if (puntosJugador === 21) {
    console.warn('21, Genial!');
    pedirButton.classList.add('bg-blue-800');
    pedirButton.disabled = true;
    detenerButton!.disabled = true;

    turnoComputadora(puntosJugador);
    return;
  }

  if (puntosJugador === puntosComputadora) {
    console.warn('Empate');
    pedirButton.classList.add('bg-blue-800');
    pedirButton.disabled = true;
    detenerButton!.disabled = true;

    turnoComputadora(puntosJugador);
    return;
  }
});

detenerButton?.addEventListener('click', () => {
  detenerButton.disabled = true;
  pedirButton!.disabled = true;
  turnoComputadora(puntosJugador);
});

nuevoButton?.addEventListener('click', () => {
  console.clear();
  deck = [];
  deck = createDeck();

  puntosJugador = 0;
  puntosComputadora = 0;

  playerPoints.textContent = '0';
  computerPoints.textContent = '0';

  jugador_cartas.innerHTML = '';
  computadora_cartas.innerHTML = '';

  pedirButton!.disabled = false;
  detenerButton!.disabled = false;
  pedirButton!.classList.remove('bg-blue-800');
});
