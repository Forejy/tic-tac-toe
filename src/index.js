import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let propsSquare = this.props.squares[i];
    let printedSquare;
    const winnerSquares = calculateWinner(this.props.squares);

    printedSquare = winnerSquares && winnerSquares.includes(i) ? <span style={{color: "red"}}>{propsSquare}</span> : propsSquare;

    return (
      <Square
        key={i}
        value={ printedSquare }
        onClick={ () => this.props.onClick(i) } />
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {

      let currentRow = [];
      for (let j = 0; j < 3; j++) {
        currentRow.push(this.renderSquare((i * 3) + j));
      }

      rows.push(
        <div
        key={i}
         className="board-row">
          {currentRow}
        </div>
      )
    }

    return(rows)
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moves: [],
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moves = current.moves.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    else {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      moves.push([i % 3, Math.floor(i / 3)]);
    }
    this.setState({
      history: history.concat([{
        squares: squares,
        moves: moves
    }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const winner = calculateWinner(current.squares);
    let status;

    if (winner) {
      status = (this.state.xIsNext ? 'O' : 'X') + " a gagné";
    }
    else if (history.length === 10 && !winner) {
      status = <b>"It's a Draw"</b>;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    const moves = history.map((step, move) => {
      let desc, part1, part2;
      if (move) {
        desc = (move === this.state.stepNumber) ? (<b>{move}</b>) : move
        part1 = 'Revenir au tour n°'
        part2 = ' - Mouvement [' + step.moves.slice(-1) + ']'
      }
      else {
        desc = 'Revenir au début de la partie';
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{part1}{desc}{part2}</button>
        </li>
      );
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
