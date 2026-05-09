import {
  initializeGame,
  makeGuess,
  createDeck,
  shuffleDeck,
} from "../lib/game";

describe("Game Logic", () => {
  test("createDeck creates 52 cards", () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
  });

  test("initializeGame sets up correct initial state", () => {
    const state = initializeGame();
    expect(state.deck).toHaveLength(51); // One card drawn
    expect(state.currentCard).toBeDefined();
    expect(state.score).toBe(0);
    expect(state.faceValues).toEqual({ J: 5, Q: 5, K: 5 });
    expect(state.reshufflesLeft).toBe(1);
    expect(state.gameOver).toBe(false);
  });

  test("makeGuess updates score correctly for higher guess", () => {
    const state = initializeGame();
    // Force specific cards for testing
    state.currentCard = { suit: "hearts", rank: "2", value: 2 };
    state.deck = [
      { suit: "diamonds", rank: "3", value: 3 },
      ...state.deck.slice(1),
    ];

    const newState = makeGuess(state, "higher");
    expect(newState.score).toBe(1);
  });

  test("makeGuess does not update score for wrong guess", () => {
    const state = initializeGame();
    state.currentCard = { suit: "hearts", rank: "3", value: 3 };
    state.deck = [
      { suit: "diamonds", rank: "2", value: 2 },
      ...state.deck.slice(1),
    ];

    const newState = makeGuess(state, "higher");
    expect(newState.score).toBe(0);
  });

  test("equal values result in incorrect guess", () => {
    const state = initializeGame();
    state.currentCard = { suit: "hearts", rank: "5", value: 5 };
    state.deck = [
      { suit: "diamonds", rank: "5", value: 5 },
      ...state.deck.slice(1),
    ];

    const newState = makeGuess(state, "higher");
    expect(newState.score).toBe(0);
  });

  test("face card values update correctly", () => {
    const state = initializeGame();
    state.currentCard = { suit: "hearts", rank: "J", value: 5 };
    state.deck = [
      { suit: "diamonds", rank: "K", value: 5 },
      ...state.deck.slice(1),
    ];

    const newState = makeGuess(state, "higher"); // K > J, correct
    expect(newState.faceValues.J).toBe(6); // Involved in correct guess
    expect(newState.faceValues.K).toBe(6); // Involved in correct guess
  });

  test("face card values are bounded", () => {
    const state = initializeGame();
    state.faceValues = { J: 10, Q: 5, K: 5 };
    state.currentCard = { suit: "hearts", rank: "J", value: 10 };
    state.deck = [
      { suit: "diamonds", rank: "K", value: 5 },
      ...state.deck.slice(1),
    ];

    const newState = makeGuess(state, "higher"); // K < J, wrong
    expect(newState.faceValues.J).toBe(9); // Involved in wrong guess
    expect(newState.faceValues.K).toBe(4); // Involved in wrong guess
  });
});
