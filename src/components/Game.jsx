import React from "react";

import "./Game.css";

export default function Game() {

    // Global States

    //state to keep and change the history changes of moves
    const [history, setHistory] = React.useState([Array(10).fill(null)])
    //state to keep and change the current move 
    const [currentMove, SetCurrentMove] = React.useState(0);
    //constant to decide which plays the next move by the use of current move state
    const isX = (currentMove % 2 === 0);
    //constant to save the current array of values of squares from the history for the current move 
    const currentSquareValues = history[currentMove];
    
    // Square Component child of Board Component
    function Square({ id, squareValue, onSquareClick, winnersIndex }) {
        //this is the square component used to make each square and calling handleclick function when clicked on any square 
        return (
            <div id={`sqaure-${id}`} className="square">
                <button onClick={onSquareClick} className={winnersIndex ? ((id===winnersIndex[0] || id===winnersIndex[1] || id===winnersIndex[2]) ? "winner-square" : "") : "" }>
                    {squareValue}
                </button>
            </div>
        )
    }


    //Board Component child of Game Component
    function Board({ squareValues, onPlay, isX, winnersIndex }) {
        /* this is the main component board that used to make the board handling clicks on square by handleclick function
        rendering each square by SqaureElement functional component , rendering each row and whole board by BoardElement functional component
        */
        function handleClick(i) {
            if (calculateWinner(squareValues) || squareValues[i]) {
                return;
            }
            let newSquareValues = squareValues.slice();
            newSquareValues[i] = isX ? "X" : "O";
            onPlay(newSquareValues);
        }

        function SquareElement({ i }) {
            return (
                <Square id={i} squareValue={squareValues[i]} onSquareClick={() => handleClick(i)} winnersIndex={winnersIndex} />

            )
        }

        function BoardElement() {
            let boardRows = [];
            for (let row = 0; row < 3; row++) {
                let boardRow = [];
                for (let col = 0; col < 3; col++) {
                    boardRow.push(<SquareElement key={(row * 3) + col} i={(row * 3) + col} />)

                }

                boardRows.push(
                    <div id={`board-row${row}`} key={row} className="board-row">
                        {boardRow}
                    </div>
                )
            }

            return (
                <div id="board" className="board" >
                    {boardRows}
                </div>
            )
        }

        return (
            <div>
                <BoardElement />
            </div>
        )
    }


    //History Component child component of Game that show the history
    function History() {
        //functional component to render the history element returns from mapping history state array 
        return (
            <ol className="history-ol">
                {historyItems}
            </ol>
        )
    }

    // Winner Checking Function

    function calculateWinner(squareValues) {
        /*function to check the winner by providing an array of winning conditions and looping over each value in 
        history to decide the winner, and returning winning player, & winning indexes if wins or return null.
        */
        const conditionLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < conditionLines.length; i++) {
            const [a, b, c] = conditionLines[i];

            if (squareValues[a] && squareValues[a] === squareValues[b] && squareValues[a] === squareValues[c]) {
                return [squareValues[a], a, b, c];
            }
        }
        return null;
    }
    //constant to storet the winning condition, and winner's indexes
    const winner = calculateWinner(currentSquareValues);
    //variable to store the status string for each condition 
    let status;
    if (winner) {
        status = "Winner : " + winner[0];

    }
    else {

        status = currentMove===9 ? "Match Draw" : ("Next turn : " + (isX ? "X" : "O"));
    }


    //onplay function is used to set the 
    function handlePlay(newSquareValues) {
    //function to update the history array's values state, and update current move state

        const NextHistory = [...history.slice(0, currentMove + 1), newSquareValues];
        setHistory(NextHistory);
        SetCurrentMove(NextHistory.length - 1);

    }

    //function to jump to any previous steps to undo or redu
    function jumpTo(moovTo) {
        //function to set current move to desird move where user clicked by changing currentmove state
        SetCurrentMove(moovTo);

    }

    //creates the history as the steps played
    const historyItems = history.map((values, i) => {
        let listContent;
        if (i > 0) {
            
            listContent = currentMove === i ? `You are at move ${i}` : `Go to move : ${i}`;
        }
        else {
            listContent = "Go to start game";
        }

        return (
            <li key={i} className="history-li">

                <button onClick={() => jumpTo(i)} > {listContent} </button>
            </li>
        )
    })

   
//rendering all the components
    return (
        <div id="container" className="container">
            <h1 className="title"> Tic Tac Toe </h1>
            <p className="status">{status}</p>
            <div className="main-container">
                <Board squareValues={currentSquareValues} isX={isX} onPlay={handlePlay} winnersIndex={winner ? [winner[1], winner[2], winner[3]] : [] }/>
                <History />
            </div>
            
        </div>
    )
}