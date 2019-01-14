export default function (gameState) {

  // gameState.history
  // gameState.currentPortfolio
  // gameState.moneyLeft
  // gameState.history

  return Math.round(Math.random() * 90); // * gameState.moneyLeft
}
