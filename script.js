let player = (name, sign,isAi=false,score=0)=> ({
    name,
    sign,
    isAi,
    score,
})

const board = (()=> {
    let _board = new Array(9).fill(null)

    const getBoard = ()=> _board

    const makeMove = (grid,player)=> {
        const gridIndex = parseInt(grid.getAttribute('cellNumber'))
        if (!grid.textContent && !_board[gridIndex]) {
            _board[gridIndex] = player.sign
            grid.textContent = player.sign
        }
    }

    const cleanBoard = ()=> {
        let _board = new Array(9).fill(null)
    }

    return {
    makeMove,
    getBoard,
    cleanBoard,
    }
})();

const game = (()=>{
    // getting boards
   const _boardGrid = [...document.querySelectorAll('.boardCell')];
   const _htmlboard = document.querySelector('.board')

//    setting up players
   let playerX = player("","X")
   let playerO = player("","O")

   const getPlayerO = ()=> playerO
   const getPlayerX = ()=> playerX

    const getCurrentPlayer = () => {
        const moveCounter = board.getBoard().reduce((obj,arrayItem)=>{
            if (!obj[arrayItem]) {
                obj[arrayItem] = 0
            }
            obj[arrayItem]++
            return obj
        }, {});

        return moveCounter["X"] == moveCounter['O'] ? playerX : playerO
    }

    _boardGrid.forEach(grid => {
        grid.addEventListener('click',()=>{
            console.log(getCurrentPlayer())
        })
    })

   return {
        getPlayerO,
        getPlayerX,
        getCurrentPlayer,

   }
})();