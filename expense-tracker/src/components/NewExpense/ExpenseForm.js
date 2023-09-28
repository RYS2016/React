import React, {useState} from 'react';

import './ExpenseForm.css';

const ExpenseForm = (props) => {

    const [enteredTitle, setEnteredTitle] = useState("");
    const [enteredAmount, setEnteredAmount] = useState("");
    const [enteredDate, setEnteredDate] = useState("");

    const titleChangeHandler = (event) => {
        setEnteredTitle(event.target.value);
    }

    const amountChangeHandler = (event) => {
        setEnteredAmount(event.target.value);
    }

    const dateChangeHandler = (event) => {
        setEnteredDate(event.target.value);
    }

    const submitHandler = (event) => {
        event.preventDefault();

        const expenseData = {
            title: enteredTitle,
            amount: +enteredAmount,
            date: new Date(enteredDate)
        }

        props.onSaveExpenseData(expenseData);
        setEnteredTitle('');
        setEnteredAmount('');
        setEnteredDate('');
    }

    return (
        <form onSubmit={submitHandler}>
            <div className='new-expense__controls'>
                <div className='new-expense__controls'>
                    <label>Title</label>
                    <input type='text' 
                    value={enteredTitle}
                    onChange={titleChangeHandler}
                    />
                </div>
                <div className='new-expense__controls'>
                    <label>Amount</label>
                    <input type='number' 
                    value={enteredAmount} 
                    min='0.01' 
                    step="0.01" 
                    onChange={amountChangeHandler}
                    />
                </div>
                <div className='new-expense__controls'>
                    <label>Date</label>
                    <input type='date'
                    value={enteredDate} 
                    min='2019-01-01' 
                    max="2022-12-31" 
                    onChange={dateChangeHandler}
                    />
                </div>
            </div>
            <div className='new-expense__actions'>
                <button type='submit'>Add Expenses</button>
            </div>
        </form>
    );
}
export default ExpenseForm;

//-------------------------or another alternative----------------------
//const [userInput, setUserInput] = useState(
//    {
//        enteredTitle: '',
//        enteredAmount: '',
//        enteredDate: ''
//    }
//)
// const titleChangeHandler = (event) => {
//    setUserInput({
//    ...userIput, 
//    enteresTitle: event.target.value
//  });
//};
//-------An even better (safer way) approach to update the state-------
//----prevState always operates on the latest state snapshot-----------
//
//  const titleChangeHandler = (event) => {
//      setUserInput((prevState) => {
//          return {
//              ...prevState,
//                 enteresTitle: event.target.value
//         };
//    });
//}
// You will nees to do the same in all the event hanlers functions
//---------------------------------------------------------------------

//-----another approach to create only 1 event handler-------
//const inputChangeHandler = (identifier, value) => {
//    if(identifier === 'title'){
//        setEnteredTitle(value)
//    } else if (identifier === 'date'){
//        setEnteredDate(value);
//    } else {
//        setEnteredAmount(value);
//    }
//}
//---also need to change the onChange function:--------------
//onChange={(event) => inputChangehandler('title', event.target.value)}