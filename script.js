const player = (name, sign,isAi=false,score=0)=> ({
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

const gameController = (()=>{
    _boardGrid = [...document.querySelectorAll('.boardCell')]

})();