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
        _board = new Array(9).fill(null)
    }

    return {
    makeMove,
    getBoard,
    cleanBoard,
    }
})();

const gameLogic = (()=>{
    const _htmlboard = document.querySelector('.board')
    const _winningConditions = [
        // winning coloumns
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
        const winningCondition = _winningConditions.find(winningCondition => {
            if  ((board.getBoard()[winningCondition[0]] === board.getBoard()[winningCondition[1]]) && (
                board.getBoard()[winningCondition[0]] === board.getBoard()[winningCondition[2]]) && (
                board.getBoard()[winningCondition[0]] === "X" || board.getBoard()[winningCondition[0]] === "O"
            )) return true
        })
        return !!winningCondition ? winningCondition : false
    }

    const _updateWinnerScore = winnerSign => {
        if (winnerSign ==="X") gamefunctionality.getPlayerX().score++
        else if(winnerSign === "O") gamefunctionality.getPlayerO().score++
    }
    
    const boardObserver = new MutationObserver(entries=>{
        const winningCombination = hasWon()
        if (!winningCombination) return
        const winner = entries[0].target.textContent === "X" ? 
            gamefunctionality.getPlayerX() : gamefunctionality.getPlayerX();
        _updateWinnerScore(entries[0].target.textContent);
        nonGameFuncionality.displayWinner(winner.name);
        nonGameFuncionality.displayWinnerCombo(winningCombination)


    });

    const startBoardObserve = ()=>{
        boardObserver.observe(_htmlboard, {
            subtree: true,
            childList: true,
            characterData:true
        });
    };

    
    
    return {
        hasWon,
        startBoardObserve,

    }
})();

const gamefunctionality = (()=>{
    // getting boards
    const _boardGrid = [...document.querySelectorAll('.boardCell')]; 

     // setting up players
    let playerX = player("","X")
    let playerO = player("","O")
  
    const getPlayerO = ()=> playerO
    const getPlayerX = ()=> playerX 

    // setting up board
    gameLogic.startBoardObserve()

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

     _boardGrid.forEach(grid => {
         grid.addEventListener('input',event=>{
             console.log(event)
         })
     }) 
 

    return {
         getPlayerO,
         getPlayerX,
         getCurrentPlayer,
 }
})();

const nonGameFuncionality = (()=>{
    const _endModal = document.querySelector('.endModal')
    const _winner = document.querySelector('.winner')
    const _score = document.querySelector('.score')
    const _rematchBtn = document.querySelector(".rematchBtn")
    const _modaBlocker = document.querySelector('.endModalBlocker')
    const _board = document.querySelector(".board")
    const _boardGrid = [...document.querySelectorAll('.boardCell')]; 
    const _menu = document.querySelector('.menu')
    // menu stuff
    const _startBtn = document.querySelector(".startBtn")
    const _errorMessageO= document.querySelector(".errormessageO")
    const _errorMessageX= document.querySelector(".errormessageX")
    const _backButton = document.querySelector(".fa-arrow-left")





    const displayWinner = (winnerName)=> {
        _endModal.style.visibility = "visible" 
        _modaBlocker.classList.add("modalHidden")

        _winner.textContent = `${winnerName} wins!`
        _score.textContent = `${gamefunctionality.getPlayerX().name} : ${gamefunctionality.getPlayerX().score} 
            VS ${gamefunctionality.getPlayerO().name} : ${gamefunctionality.getPlayerO().score}`

        setTimeout(()=>{
            _winner.classList.add("visible")
            setTimeout(()=>{
                _score.classList.add("visible")
                setTimeout(()=>{
                    _rematchBtn.classList.add("visible")
                },300)
            },300)
        },200)
    }
    const displayWinnerCombo = (winningCombination)=>{
        winningCombination.forEach(sqaureIndex=>{
            document.querySelector(`[cellNumber="${sqaureIndex}"]`).classList.add("winningSquare")
        });
    };

    const restartGame = ()=>{
        setTimeout(()=>{
            _rematchBtn.classList.remove("visible")
            setTimeout(()=>{
                _score.classList.remove("visible")
                setTimeout(()=>{
                    _winner.classList.remove("visible")
                    setTimeout(()=>{
                        _endModal.style.visibility = "hidden" 
                        _modaBlocker.classList.remove("modalHidden")
                        _board.classList.add("hidden")
                        board.cleanBoard()
                        setTimeout(()=>{
                            _boardGrid.forEach(grid=>{
                                grid.textContent = undefined
                                grid.classList.remove("winningSquare")
                            });
                            _board.classList.remove("hidden");
                        },500)
                    },300)
                },300)
            },300)
        },200);
    };

    _startBtn.addEventListener("click",()=>{
        const inputX = document.querySelector("#nameInput1")
        const inputO = document.querySelector("#nameInput2")

        if (!inputO.value || !inputX.value || (inputX.value === inputO.value)) {
            if (!inputO.value){
                _errorMessageO.textContent = "must enter a name"
                setTimeout(()=>{
                    _errorMessageO.textContent = undefined
                },2000)
            } ;
            if (!inputX.value) {
                _errorMessageX.textContent = "must enter a name"
                setTimeout(()=>{
                    _errorMessageX.textContent = undefined
                },2000)
            }
            if (inputO.value && inputX.value && inputO.value === inputX.value) {
                _errorMessageX.textContent = "cant have the same name"
                _errorMessageO.textContent = "cant have the same name"
                setTimeout(()=>{
                    _errorMessageX.textContent = undefined
                    _errorMessageO.textContent = undefined
                },2000)
            };
            return
        };
        
        _menu.classList.add("hidden")
        setTimeout(()=>{
            _menu.style.display = "none"
            _board.style.display = "grid"
            _backButton.style.visibility = "visible"
            setTimeout(()=>{
                // cant be executed at the same time as chaning the display of the board
                _board.classList.remove("hiddenBoard")
            },1)
        },900)
    })


    _rematchBtn.addEventListener("click",restartGame)

    return {
        displayWinner,
        displayWinnerCombo,

    }
})();