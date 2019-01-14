module.exports = function (gameState) {

  // gameState.history
  // gameState.currentPortfolio
  // gameState.moneyLeft
  // gameState.history

  return Math.round(Math.random() * 100); // * gameState.moneyLeft
}
