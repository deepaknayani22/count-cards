// Import the ruleset from a JSON file
const ruleset = require("./ruleset.json");
const { originalCases, edgeCases } = ruleset;

const determineAction = (playerCards, dealerCard) => {
  // Simplify the player's hand to check for pairs or an ace

  //   console.log("Player cards = ", playerCards[0], playerCards[1]);
  //   console.log("Dealer cards = ", dealerCard);

  // prettier-ignore
  const cardValMap = {
    "2" : 2,
    "3" : 3,
    "4" : 4,
    "5" : 5,
    "6" : 6,
    "7" : 7,
    "8" : 8,
    "9" : 9,
    "10" : 10,
    "jack" : 10,
    "queen" : 10,
    "king" : 10,
    "ace" : 11
  }
  const playerHandType =
    playerCards.length === 2 &&
    cardValMap[playerCards[0]] === cardValMap[playerCards[1]]
      ? "pairs"
      : playerCards.includes("ace")
      ? "acePresent"
      : "other";

  function determineAceAction(playerCards, dealerCard) {
    const nonAceCard = playerCards.find((card) => card !== "ace");
    const acePresentCases = ruleset.edgeCases.acePresent;
    const rules = acePresentCases.filter(
      (caseItem) => caseItem.playerCard === nonAceCard
    );

    for (let i = 0; i < rules.length; i++) {
      if (rules[i].dealerCards.includes(dealerCard)) {
        return rules[i].action;
      }
    }
  }

  function determinePairAction(playerCards, dealerCard) {
    // console.log("In Pair");
    const cardValue = cardValMap[playerCards[0]].toString();
    const pairPresentCases = ruleset.edgeCases.pairs;
    const rules = pairPresentCases.filter((caseItem) => {
      return caseItem.playerCards.toString() === cardValue;
    });
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].dealerCards.includes(dealerCard)) {
        // console.log(rules[i].action);
        return rules[i].action;
      }
    }
  }

  function determineOtherAction(playerCards, dealerCard) {
    const playerSumValue =
      cardValMap[playerCards[0]] + cardValMap[playerCards[1]];
    const otherCases = ruleset.other;
    const rules = otherCases.filter(
      (caseItem) => caseItem.playerSum === playerSumValue
    );
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].dealerCards.includes(dealerCard)) {
        // console.log(rules[i].action);
        return rules[i].action;
      }
    }
  }
  // Determine action for pairs
  //   console.log(playerHandType);

  function evaluateCases(playerCards, dealerCard) {
    if (playerHandType === "pairs") {
      return determinePairAction(playerCards, dealerCard);
    } else if (playerHandType === "acePresent") {
      return determineAceAction(playerCards, dealerCard);
    } else {
      return determineOtherAction(playerCards, dealerCard);
    }
  }
  return evaluateCases(playerCards, dealerCard);
};

module.exports = { determineAction };
