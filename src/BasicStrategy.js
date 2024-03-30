import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Card from "./Card";
import ActionButtons from "./ActionButtons";
import { determineAction } from "./determineAction";
import "./styles.css";

function BasicStrategy() {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const values = [
    "ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "jack",
    "queen",
    "king",
  ];

  const [deck, setDeck] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [isActionCorrect, setIsActionCorrect] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [score, setScore] = useState(0);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [dealBtn, setDealBtn] = useState(false);

  const handleActionSelected = (action) => {
    if (buttonsDisabled) return; // Prevents function execution if buttons are disabled

    setSelectedAction(action);
    const correct = action === correctOption;
    setIsActionCorrect(correct);
    setDealBtn(false);
    setButtonsDisabled(true); // Disable buttons after a selection

    if (correct) {
      setScore(score + 1);
    } else {
      setHighScore((currentHighScore) => Math.max(currentHighScore, score)); // Update high score if necessary
      setScore(0);
    }
  };

  const cardValue = (card) => {
    if (["jack", "queen", "king"].includes(card)) {
      return 10;
    } else if (card === "ace") {
      return 11;
    } else {
      return parseInt(card, 10);
    }
  };

  const generateDeck = () => {
    let newDeck = [];
    suits.forEach((suit) => {
      values.forEach((value) => {
        newDeck.push({
          id: `${value}_of_${suit}`,
          cardImage: `${value}_of_${suit}`,
        });
      });
    });
    return shuffle(newDeck);
  };

  const shuffle = (deck) => {
    let m = deck.length,
      t,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = deck[m];
      deck[m] = deck[i];
      deck[i] = t;
    }
    return deck;
  };

  const pickRandomCards = (deck, num) => {
    const shuffledDeck = shuffle([...deck]);
    const pickedCards = shuffledDeck.slice(0, num);
    determineOptions(pickedCards.slice(1));
    updateCorrectAction(pickedCards);
    return pickedCards.map((card, index) => ({
      ...card,
      animateToPosition:
        index === 0 ? [0, 3, 0] : index === 1 ? [-3, -3, 0] : [3, -3, 0],
      flip: true,
    }));
  };

  // IGNORE FOR NOW
  const updateCorrectAction = (cards) => {
    const playerCards = cards.slice(1).map((card) => card.id.split("_of_")[0]);
    const dealerCard = cards[0].id.split("_of_")[0];
    const action = determineAction(playerCards, dealerCard);
    setCorrectOption(action);
  };

  const determineOptions = (playerCards) => {
    if (
      playerCards.length === 2 &&
      cardValue(playerCards[0].id.split("_of_")[0]) ===
        cardValue(playerCards[1].id.split("_of_")[0])
    ) {
      setOptions(["Split", "Split (if doubling is allowed)", "No split"]);
    } else if (
      playerCards.some((card) => cardValue(card.id.split("_of_")[0]) === 11)
    ) {
      setOptions([
        "Blackjack",
        "Hit",
        "Stand",
        "Double if allowed, otherwise hit",
        "Double if allowed, otherwise stand",
      ]);
    } else {
      setOptions(["Hit", "Stand", "Double"]);
    }
  };

  const dealCards = () => {
    setDealBtn(true);
    setSelectedAction("");
    setIsActionCorrect(null);
    setButtonsDisabled(false);
    const newDeck = generateDeck();
    const randomCards = pickRandomCards(newDeck, 3);
    setDeck(randomCards);
  };

  useEffect(() => {
    dealCards();
  }, []);

  return (
    <div className="basic-strategy-main">
      <div className="header">Learn Card Counting and Basic Strategy</div>
      <p className="header">(refresh page to reset)</p>
      <div className="score-display">
        <div className="high-score">High Score: {highScore}</div>
        <div className="score">Score: {score}</div>
      </div>
      <Canvas camera={{ position: [0, 0, 20], fov: 35 }}>
        <Suspense fallback={null}>
          {deck.map((card) => (
            <Card
              key={card.id}
              animateToPosition={card.animateToPosition}
              flip={card.flip}
              cardImage={card.cardImage}
            />
          ))}
        </Suspense>
      </Canvas>
      <button className="deal-button" onClick={dealCards} disabled={dealBtn}>
        Deal
      </button>
      <ActionButtons
        options={options}
        onActionSelected={handleActionSelected}
        selectedAction={selectedAction}
        isActionCorrect={isActionCorrect}
        correctOption={correctOption}
        disabled={buttonsDisabled}
      />
    </div>
  );
}

export default BasicStrategy;
