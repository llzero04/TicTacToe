import React , { useEffect, useState } from "react";

import Board from "./Board";

const Container = function()
{
    const initialBoard = [
        [{id : 1 , val : `-` , x : 0 , y : 0} , {id : 2 , val : `-` , x : 0 , y : 1} , {id : 3 , val : `-` , x : 0 , y : 2}],
        [{id : 4 , val : `-` , x : 1 , y : 0} , {id : 5 , val : `-` , x : 1 , y : 1} , {id : 6 , val : `-` , x : 1 , y : 2}],
        [{id : 7 , val : `-` , x : 2 , y : 0} , {id : 8 , val : `-` , x : 2 , y : 1} , {id : 9 , val : `-` , x : 2 , y : 2}]
    ];

    
    const [gameMessage , setGameMessage] = useState("Select a Game Mode");
    const [board , setBoard] = useState(JSON.parse(JSON.stringify(initialBoard)));
    const [gameMode , setGameMode] = useState(0);
    const [turn , setTurn] = useState("X");
    const [moveCount , setMoveCount] = useState(0);

    function checkWinningMove(b , t)
    {
        let count = 0;
        for(let i = 0 ; i < 3 ; i++)
        {
            count = 0;
            for(let j = 0 ; j < 3 ; j++)
            {
                if(b[i][j].val === t) count += 1;
            }
            if(count == 3) return true;
        }

        for(let j = 0 ; j < 3 ; j++)
        {
            count = 0;
            for(let i = 0 ; i < 3 ; i++)
            {
                if(b[i][j].val === t) count += 1;
            }
            if(count == 3) return true;
        }

        if(b[0][0].val === t && b[1][1].val === t && b[2][2].val === t) return true;
        if(b[0][2].val === t && b[1][1].val === t && b[2][0].val === t) return true;

        return false;
    }

    function getBestMoveUtil(b , t , mc)
    {
        if(mc == 9)
        {
            if(checkWinningMove(b , String("X"))) return +1;
            if(checkWinningMove(b , String("O"))) return -1;
            return 0;
        }

        if(checkWinningMove(b , t === "X" ? "O" : "X"))
        {
            return (t === "X" ? -1 : +1);
        }

        if(t === "X")
        {
            let max = -9999;
            let tmp;
            
            for(let i = 0 ; i < 3 ; i++)
            {
                for(let j = 0 ; j < 3 ; j++)
                {
                    if(b[i][j].val !== "-") continue;

                    b[i][j].val = "X";

                    tmp = getBestMoveUtil(b , String("O") , Number(mc + 1));
                    max = max >= tmp ? max : tmp;

                    b[i][j].val = "-";
                }
            }
            return max;
        }
        else
        {
            let min = 9999;
            let tmp;

            for(let i = 0 ; i < 3 ; i++)
            {
                for(let j = 0 ; j < 3 ; j++)
                {
                    if(b[i][j].val !== "-") continue;

                    b[i][j].val = "O";

                    tmp = getBestMoveUtil(b , String("X") , Number(mc + 1));
                    min = min <= tmp ? min : tmp;

                    b[i][j].val = "-";
                }
            }
            return min;
        }
        return 0;
    }

    function getBestMove(b , t , mc)
    {
        let bestMove = {x : -1 , y : -1};
        let min = 9999 , tmp;

        for(let i = 0 ; i < 3 ; i++)
        {
            for(let j = 0 ; j < 3 ; j++)
            {
                if(b[i][j].val.localeCompare("-") !== 0) continue;

                b[i][j].val = String("O");

                tmp = getBestMoveUtil(b , String("X") , Number(mc + 1));

                if(min > tmp)
                {
                    min = tmp;

                    bestMove.x = i;
                    bestMove.y = j;
                }

                b[i][j].val = String("-");
            }
        }
        return bestMove;
    }

    useEffect(() => 
    {
        if(gameMode === 0)
        {
            return;
        }

        if(checkWinningMove([...board] , String(turn === "X" ? "O" : "X")))
        {
            setGameMode(0);
            setGameMessage(`Player ${turn === "X" ? "O" : "X"} Won the Game`);
            return;
        }

        if(gameMode === 1)
        {
            setMoveCount(moveCount + 2);
            setGameMessage(`It is Player ${turn} Now`);
            if(moveCount >= 9)
            {
                setGameMessage("It is a Draw");
                setGameMode(0);
            } 
            return;  
        }

        setMoveCount(moveCount + 1);
        setGameMessage(`It is Player ${turn} Now`);
        console.log(moveCount)
        if(moveCount >= 9)
        {
            setGameMessage("It is a Draw");
            setGameMode(0);
        }
    } , [board]);

    function changeGameMode(e)
    {
        setGameMode(e.target.options.selectedIndex);
        setBoard(initialBoard);
        setGameMessage("It is Player X Turn Now");
        setMoveCount(0);
        setTurn("X");
    }
    
    function handlePlayerMove(pos)
    {
        if(gameMode === 0)
        {
            setGameMessage("Select a Game Mode!!");
            return;
        }
        if(board[pos.x][pos.y].val !== "-")
        {
            setGameMessage("Select an Empty Sqaure");
            return;
        }
        let newBoard = [...board];
        if(turn.localeCompare("X") === 0)
        {
            newBoard[pos.x][pos.y].val = turn;
            setTurn("O");

            if(gameMode === 1)
            {
                if(checkWinningMove([...board] , String("X")))
                {
                    setGameMode(0);
                    setGameMessage(`Player X Won the Game`);
                    return;
                }
                // I really dont know why i have to pass moveCount - 1 :|
                let bestMove = getBestMove([...newBoard] , String("O") , Number(moveCount - 1));
                if(bestMove.x === -1 || bestMove.y === -1)
                {
                    return;
                }
                newBoard[bestMove.x][bestMove.y].val = "O";
                setTurn("X");
            }

        }
        else if(turn.localeCompare("O") === 0)
        {
            newBoard[pos.x][pos.y].val = turn;
            setTurn("X");
        }
        setBoard(newBoard);
    }

    return(
        <div className="container">
            <div className="game-options">
                <h3>Game Mode</h3>
                <select onChange={(e) => changeGameMode(e)}>
                    <option> </option>
                    <option>Single Player</option>
                    <option>Two Player</option>
                </select>
                { gameMode == 1 && <h3>Difficulty</h3>}
                { gameMode == 1 && <select disabled>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </select>}
            </div>
            <div className="game-message">{ gameMessage }</div>
            <Board board = {board} handlePlayerMove = {handlePlayerMove}/>
        </div>
    );
}

export default Container;