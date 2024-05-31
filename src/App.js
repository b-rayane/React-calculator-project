import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./buttons/DigitButton";
import OperationButton from "./buttons/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  DELETE_DIGIT: 'delete-digit',
  CLEAR: 'clear',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) { //bc we have diff actions and they all have a parameter

  switch (type) {
    //******************************ADD A DIGIT******************************
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand : payload.digit,
          overwrite: false,
        }

      }
      if (state.currentOperand === "0" && payload.digit === "0") { //to type one 0 and not multiple
        return state;
      }

      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,

      }

    //******************************CLEAR******************************
    case ACTIONS.CLEAR:
      return {}

    //******************************CHOOSE OPERATION******************************
    case ACTIONS.CHOOSE_OPERATION:

      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }

      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    //******************************EVALUATE******************************
    case ACTIONS.EVALUATE:
      if (state.currentOperand == null 
        && state.previousOperand == null 
        || state.currentOperand == null) {
        return state;
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand : state.currentOperand,
          currentOperand : null
        }
      }

      return {
        ...state,
        operation : null,
        overwrite : true,
        previousOperand : null,
        currentOperand : evaluate(state)
      }

    //******************************DELETE DIGIT******************************
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite){
        return {
          ...state,
          currentOperand : null,
          overwrite : false,
        }
      }

      if (state.currentOperand == null) {
        return state
      }

      if (state.currentOperand.length === 1){
        return {
          ...state,
          currentOperand : null,
        }
      }
      
      return {
        ...state,
        currentOperand : state.currentOperand.slice(0, -1),
      }


  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const current = parseFloat(currentOperand);
  const previous = parseFloat(previousOperand);

  if (isNaN(previous) || isNaN(current)) return "";

  let result;

  if (operation === "+") result = previous + current;
  if (operation === "-") result = previous - current;
  if (operation === "*") result = previous * current;
  if (operation === "÷") result = previous / current;

  return result.toString();

}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">

      <div className="output">
        <div className="previous-operand"> {previousOperand} {operation} </div>
        <div className="current-operand"> {currentOperand} </div>
      </div>

      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton dispatch={dispatch} operation="÷"></OperationButton>
      <DigitButton dispatch={dispatch} digit="1"></DigitButton>
      <DigitButton dispatch={dispatch} digit="2"></DigitButton>
      <DigitButton dispatch={dispatch} digit="3"></DigitButton>
      <OperationButton dispatch={dispatch} operation="*"></OperationButton>
      <DigitButton dispatch={dispatch} digit="4"></DigitButton>
      <DigitButton dispatch={dispatch} digit="5"></DigitButton>
      <DigitButton dispatch={dispatch} digit="6"></DigitButton>
      <OperationButton dispatch={dispatch} operation="+"></OperationButton>
      <DigitButton dispatch={dispatch} digit="7"></DigitButton>
      <DigitButton dispatch={dispatch} digit="8"></DigitButton>
      <DigitButton dispatch={dispatch} digit="9"></DigitButton>
      <OperationButton dispatch={dispatch} operation="-"></OperationButton>
      <DigitButton dispatch={dispatch} digit="0"></DigitButton>
      <DigitButton dispatch={dispatch} digit="."></DigitButton>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>


    </div>
  );
}


export default App;
