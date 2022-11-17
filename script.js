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

const gameLogic = (()=>{
    const winningConditions = [
        // winning coloumsn
        [0,1,2],
        [3,4,5],
        [6,7,8],
        // winning rows
        [0,3,6],
        [1,4,7],
        [2,5,8],
        // winning diagnol
        [0,4,8],
        [2,4,6]
    ];

    const hasWon = () => {
        return winningConditions.some(winningCondition => (
            (board.getBoard()[winningCondition[0]] === board.getBoard()[winningCondition[1]]) && (
             board.getBoard()[winningCondition[0]] === board.getBoard()[winningCondition[2]]) && (
             board.getBoard()[winningCondition[0]] === "X" || board.getBoard()[winningCondition[0]] === "O"
            )
        ));
    };

    return {
        hasWon,
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
        return moveCounter["X"] == moveCounter["O"] ? playerX : playerO
    }

    _boardGrid.forEach(grid => {
        grid.addEventListener('click',event=>{
            board.makeMove(event.target,getCurrentPlayer())
            
        })
    })

   return {
        getPlayerO,
        getPlayerX,
        getCurrentPlayer,
   }
})();

