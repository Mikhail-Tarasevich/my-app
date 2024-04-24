import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// функциональный компонент Клетка
function Square(props) {
  return (
    // при нажатии на кнопку вызывается props.onClick, который передан через props из Board
    <button className="square" onClick={props.onClick}>
      {props.value}  
    </button>
  );
}

// компонент Доска
class Board extends React.Component {
  renderSquare(i) {
    return <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// основной компонент Игра
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // Это гарантирует, что если мы «вернёмся назад», а затем сделаем новый шаг из этой точки, мы удалим всю «будущую» историю, которая перестала быть актуальной.
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // текущий ход
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // если определен победитель или это первый ход, то на выход
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // определяем игрока
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // записываем в историю текущий ход
      history: history.concat([{
        squares: squares,
      }]),
      // номер хода
      stepNumber: history.length,
      // следующий игрок: true='X', false='O'
      xIsNext: !this.state.xIsNext,
    });
  }

  // переход на указанный ход step
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
    // рисуем кнопки перехода к предыдущим ходам и к началу игры
    const moves = history.map((step, move) => {
      const desc = move ?
      'Перейти к ходу №' + move :
      'К началу игры';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Выйграл ' + winner;
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }

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

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
      return squares[a];
    }
  }
  return null;
}