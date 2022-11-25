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
    let play = false;

    const changePlayState = ()=>{
        play = !play
    }

    const playStatus = ()=> {
        return play
    }

    const hasWon = (theBoard) => {
        const currentPlayer = gamefunctionality.getPreviousPlayer(board.getBoard())

        const winningCondition = _winningConditions.find(winningCondition => {
            if  ((theBoard[winningCondition[0]] === theBoard[winningCondition[1]]) && (
                theBoard[winningCondition[0]] === theBoard[winningCondition[2]]) && (
                theBoard[winningCondition[0]] === "X" || theBoard[winningCondition[0]] === "O"
            )) return true
        })
        return !!winningCondition ? [winningCondition,currentPlayer] : [false]
    }

    const _updateWinnerScore = winnerSign => {
        if (winnerSign ==="X") gamefunctionality.getPlayerX().score++
        else if(winnerSign === "O") gamefunctionality.getPlayerO().score++
    }

    const AIMakeMove = (currentPlayer) =>{
        _htmlboard.style.pointerEvents = "none"
        setTimeout(()=>{
            if (play) if (currentPlayer.isAi && board.getBoard().includes(null)) {
                board.makeMove(document.querySelector(`[cellNumber = "${
                    findBestMove(board.getBoard() , currentPlayer.sign)}"]`), currentPlayer)
            };
        _htmlboard.style.pointerEvents = "auto"
        },400)
    }
    
    const boardObserver = new MutationObserver(entries=>{

        const winningCombination = hasWon(board.getBoard())[0]
        const currentPlayer = gamefunctionality.getCurrentPlayer(board.getBoard())

        if (!winningCombination && play && currentPlayer.isAi) AIMakeMove(currentPlayer)
        if (!winningCombination && !board.getBoard().includes(null)) {
            nonGameFuncionality.displayWinner("no one");
            changePlayState()
        }
        if (!winningCombination) return;

        const winner = entries[0].target.textContent === "X" ? 
            gamefunctionality.getPlayerX() : gamefunctionality.getPlayerO();
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

    // AI stuff
    const isMovesLeft = (theBoard)=> {
        for (let i = 0; i<9; i++) {
            if (theBoard[i] == null) return true
        }
        return false
    }

    const evaluate = (theBoard, currentPlayer)=> {
        if (!!hasWon(theBoard)[0]) {
            const winningPlayer = document.querySelector(`[cellNumber = "${hasWon(theBoard)[0][0]}"]`).textContent
            if (currentPlayer === winningPlayer) 
                return 10
            return -10
        }
        return 0
    }

    const miniMax = (theBoard, depth, isMax) => {
        const score = evaluate(theBoard ,"X")

        if (score == 10 || score == -10) return score
        if (!isMovesLeft(theBoard)) return 0;

        if (isMax) {
            let bestScore = -Infinity

            for (let i = 0; i < 9; i++) {
                if(theBoard[i] == null) {
                    theBoard[i] = "O";
                    bestScore = Math.max(bestScore,miniMax(theBoard,depth++, !isMax))
                    theBoard[i] = null
                }
            };
            return bestScore
        } 
        else {
            let bestScore = Infinity
            for (let i = 0; i < 9; i++) {
                if(theBoard[i] == null) {
                    theBoard[i] = "X";
                    bestScore = Math.min(bestScore,miniMax(theBoard,depth++, !isMax))
                    theBoard[i] = null
                };
            };
            return bestScore
        };

    };

    const findBestMove = (theBoard)=>{
        let bestVal = -Infinity
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if(theBoard[i] == null) {
                theBoard[i] = "O";
                let moveVal = miniMax(theBoard,0, true)
                theBoard[i] = null
                
                if (moveVal > bestVal) {
                    bestVal = moveVal
                    bestMove = i
                }
            }
        };
        return bestMove
    }

    return {
        hasWon,
        startBoardObserve,
        changePlayState,
        AIMakeMove,

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
    const updatePlayers = (Xname,XAi,Oname,OAi)=> {
        playerO.name = Oname
        playerO.isAi = OAi
        playerX.name = Xname
        playerX.isAi = XAi
    }
    const resetPlayers = ()=>{
        playerO.isAi = false
        playerO.name = undefined
        playerO.score = 0

        playerX.isAi = false
        playerX.name = undefined
        playerX.score = 0
    }

    // setting up board
    gameLogic.startBoardObserve()

     const getCurrentPlayer = (theBoard) => {
         const moveCounter = theBoard.reduce((obj,arrayItem)=>{
             if (!obj[arrayItem]) {
                 obj[arrayItem] = 0
             }
             obj[arrayItem]++
             return obj
         }, {});
         return moveCounter["X"] == moveCounter["O"] ? playerX : playerO
     } 

     const getPreviousPlayer = (theBoard)=>{
        const moveCounter = theBoard.reduce((obj,arrayItem)=>{
            if (!obj[arrayItem]) {
                obj[arrayItem] = 0
            }
            obj[arrayItem]++
            return obj
        }, {});

        return moveCounter["X"] == moveCounter["O"] ? playerO : playerX
     }

     _boardGrid.forEach(grid => {
         grid.addEventListener('click',event=>{
             board.makeMove(event.target,getCurrentPlayer(board.getBoard()))  
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
         getPreviousPlayer,
         updatePlayers,
         resetPlayers,

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
        gameLogic.changePlayState()
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
                            setTimeout(()=>{
                                gameLogic.changePlayState()
                                if (gamefunctionality.getPlayerX().isAi) 
                                    gameLogic.AIMakeMove(gamefunctionality.getPlayerX());
                            },1)
                        },500)
                    },300)
                },300)
            },300)
        },200);
    };

    _startBtn.addEventListener("click",()=>{
        const __inputX = document.querySelector("#nameInput1")
        const __inputO = document.querySelector("#nameInput2")
        const __playerOAi = document.querySelector("#OAi")
        const __playerXAi = document.querySelector("#XAi")

        if (!__inputO.value || !__inputX.value || (__inputX.value === __inputO.value)) {
            if (!__inputO.value){
                _errorMessageO.textContent = "must enter a name"
                setTimeout(()=>{
                    _errorMessageO.textContent = undefined
                },2000)
            } ;
            if (!__inputX.value) {
                _errorMessageX.textContent = "must enter a name"
                setTimeout(()=>{
                    _errorMessageX.textContent = undefined
                },2000)
            }
            if (__inputO.value && __inputX.value && __inputO.value === __inputX.value) {
                _errorMessageX.textContent = "cant have the same name"
                _errorMessageO.textContent = "cant have the same name"
                setTimeout(()=>{
                    _errorMessageX.textContent = undefined
                    _errorMessageO.textContent = undefined
                },2000)
            };
            return
        };

        gameLogic.changePlayState()

        gamefunctionality.updatePlayers(
            __inputX.value,
            __playerXAi.checked,
            __inputO.value,
            __playerOAi.checked,
        );

        _menu.classList.add("hidden")
        setTimeout(()=>{
            _menu.style.display = "none"
            _board.style.display = "grid"
            _backButton.style.visibility = "visible"
            setTimeout(()=>{
                // cant be executed at the same time as chaning the display of the board
                _board.classList.remove("hiddenBoard")
                __inputX.value = ""
                __inputO.value = ""
                __playerXAi.checked = false
                __playerOAi.checked = false
                if (gamefunctionality.getPlayerX().isAi) 
                    gameLogic.AIMakeMove(gamefunctionality.getPlayerX());
            },1)
        },900)
    })

    _rematchBtn.addEventListener("click",restartGame)
    _backButton.addEventListener("click",()=>{
        gameLogic.changePlayState()
        _board.classList.add("hiddenBoard")
        board.cleanBoard()
        setTimeout(()=>{
            _menu.style.display="flex"
            _board.style.display="none"
            _backButton.style.visibility = "hidden"
            gamefunctionality.resetPlayers()

            _boardGrid.forEach(grid=>{
                grid.textContent = undefined
                grid.classList.remove("winningSquare")
            });
            setTimeout(() => {
                _menu.classList.remove("hidden")
            }, 1);
        },800)
    })

    return {
        displayWinner,
        displayWinnerCombo,
        
    }
})();
