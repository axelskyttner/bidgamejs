import p1 from './player1'
import p2 from './player2'
import p3 from './player3'
import p4 from './player4'

const bidFunctions = [p1, p2, p3, p4]
const playerGenerator = function (id: number, bidFunction: (GameState) => number) {

  return {
    id: id,
    bid: bidFunction
  }
}



export default bidFunctions.map((func, index) => {
  return playerGenerator(index, func)
})
