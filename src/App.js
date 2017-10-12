import React from 'react';
import FontAwesome from 'react-fontawesome';
var _ = require('underscore');

// bit.ly/s-pcs
 
var possibleCombinationSum = function(arr, n) {
  console.log('entra a posibles')
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
      arr.pop();
      return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount ; i++ ) {
      var combinationSum = 0;
      for (var j=0 ; j < listSize ; j++) {
        if (i & (1 << j)) { combinationSum += arr[j]; }
      }
      if (n === combinationSum) { return true; }
    }
    return false;
  };
   
  class App extends React.Component{
  render(){
     return(
       <div>
          <Game />
        </div>
      );
    };
  };
   
class Game extends React.Component{
    constructor(props) {
        super(props);
        this.state = {date: new Date(),
          selectedNumbers: [],
          usedNumbers: [],
          numberStars: this.randomNumber(),
          answerIsCorrect: null,
          redraws: 5,
          doneStatus: null,
        };
        this.selectNumber = this.selectNumber.bind(this);
        this.unSelectNumber = this.unSelectNumber.bind(this);
        this.validateNumbers = this.validateNumbers.bind(this);

        
        this.validateNumbers = this.validateNumbers.bind(this);
        this.reDraw = this.reDraw.bind(this);
        this.updateDoneStatus = this.updateDoneStatus.bind(this);
        this.resetGame = this.resetGame.bind(this);
      }

      resetGame(){
        alert('algo');
      };
      randomNumber() {
        return 1 + Math.floor(Math.random() * 9)
      };
      
      selectNumber(clickedNumber) {
        if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
          this.setState(prevState => ({
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
            answerIsCorrect: null,
          }));
      }; 
      
      unSelectNumber(clickedNumber){
          this.setState(prevState => ({
            selectedNumbers: _.without(prevState.selectedNumbers, clickedNumber),
            answerIsCorrect: null,
          }));
      }; 

      validateNumbers() {
        if(_.reduce(this.state.selectedNumbers, (memo, num) => {
          return memo + num;
        }) === this.state.numberStars){
          {
              this.setState(prevState => ({
                usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
                selectedNumbers: [],
                numberStars: this.randomNumber(),
                answerIsCorrect: true
                }), this.updateDoneStatus)
          }
        }
        else{
          {this.setState(prevState => ({
              answerIsCorrect: false
              }), this.updateDoneStatus)
          } 
        }
      }
        
      possibleSolutions({numberStars, usedNumbers}) {
        console.log('entra a posible 0')
        const possibleNumbers = _.range(1, 9).filter(number =>
          usedNumbers.indexOf(number) === -1
        );
        return possibleCombinationSum(possibleNumbers, numberStars);
      }
        
      reDraw() {
          this.setState(prevState => ({
            numberStars: this.randomNumber(),
            selectedNumbers: [],
            answerIsCorrect: null,
            redraws: prevState.redraws - 1,
          }), this.updateDoneStatus);
      }

      updateDoneStatus() {
        console.log('entra updatestatus');
        this.setState(prevState => {
          if(prevState.usedNumbers.length === 9) {
            return {doneStatus: 'Nice Done!!!'};
          }
          if(prevState.redraws === 0){
            console.log(prevState.redraws)
            if(!this.possibleSolutions(prevState)){
              console.log('entra validacion');
              return {doneStatus: 'Game Over!!!'};
            }
          }
        });
      }
      render() {
        const {selectedNumbers, numberStars, answerIsCorrect, redraws, doneStatus} = this.state
        return (
          <div className="container">
            <h3>Play Nine</h3>
              <hr />
            <div className="row">
              <Stars className="col-5" numberStars={numberStars} />
              <Button className="col-2" selectedNumbers={selectedNumbers} 
                validateNumbers={this.validateNumbers}
                answerIsCorrect={answerIsCorrect}
                reDraw={this.reDraw}
                redraws={redraws}
                updateDoneStatus = {this.updateDoneStatus}
              />
              <Answer className="col-5" selectedNumbers={selectedNumbers} 
                unSelectNumber={this.unSelectNumber} />
            
            <br />
            </div>
            {doneStatus ?
            <DoneFrame doneStatus={doneStatus} resetGame={resetGame}/> :
              <Numbers selectedNumbers={selectedNumbers} 
            selectNumber={this.selectNumber}
                      usedNumbers={this.state.usedNumbers} 
                      />
            }
          </div>
        );
      }
    }

    function Stars(props) {
        return(
        <div>
          {_.range(props.numberStars).map((i) => 
              <i key={i} className='fa fa-star' />
              )}
        </div>
        );
    }

    function Button(props) {
      let button;
        switch(props.answerIsCorrect) {
        case true:
          button = 
          <button className="btn btn-success"
              onClick={() => props.validateNumbers()} >
              <i className="fa fa-check" /> 
          </button>
        break;
        case false:
          button = 
          <button className="btn btn-danger"
              onClick={() => props.validateNumbers()} >
              <i className="fa fa-times"/> 
          </button>
        break;
        default:
          button = 
          <button className="btn"
              onClick={() => props.validateNumbers()} disabled={props.selectedNumbers.length === 0} >
              =
            </button>
        break;
        }
      return(
      <div className="text-center">
            {button}
            <br/><br/>
            <button className="btn btn-warning btn-sm" onClick={() => props.reDraw()}
              disabled={props.redraws === 0} >
              <i className="fa fa-refresh" /> {props.redraws}
            </button>
      </div>
      );
    }

    function Answer(props){
        return(
        <div >
          {props.selectedNumbers.map((number, i) => 
               <span key={i} 
                onClick={() => props.unSelectNumber(number)}
                >
                {number}
                </span>
              )}
        </div>
      );
    }
         
        function Numbers(props){
        const numberClassName = (number) => {
           if(props.selectedNumbers.indexOf(number) >= 0)
             return 'selected';
            if(props.usedNumbers.indexOf(number) >= 0)
             return 'used';
          }
          return(
            <div className="card text-center">
              <div>
               {_.range(1,10).map((number, i) =>
                <span key={i} className={numberClassName(number)}
                 onClick={() => props.selectNumber(number)} 
                              >
                              {number}
                      </span>)}
              </div>
            </div>
          );
        }
         

function DoneFrame(props) {
  return(
    <div className="text-center">
      <h2>
        {props.doneStatus}
      </h2>
      <br />
      <button onClick={props.resetGame}>Play Again!</button>
    </div>
    )
}

//   render(){
//     const {selectedNumbers, numberStars, answerIsCorrect, redraws, doneStatus} = this.state
//      return(
//        <div className="container">
//         <h3>Play Nine</h3>
//           <hr />
//           <div className="row"> 
//             <Stars numberStars={numberStars}/>
//             <Button selectedNumbers={selectedNumbers} 
//              validateNumbers={this.validateNumbers}
//                     answerIsCorrect={answerIsCorrect}
//                     reDraw={this.reDraw}
//                     redraws={redraws}
//                     updateDoneStatus = {this.updateDoneStatus}
//                     />
//             <Answer selectedNumbers={selectedNumbers} 
//              unSelectNumber={this.unSelectNumber}
//                     />
//           </div>
//           <br />
//           {doneStatus ?
//            <DoneFrame doneStatus={doneStatus} /> :
//             <Numbers selectedNumbers={selectedNumbers} 
//            selectNumber={this.selectNumber}
//                     usedNumbers={this.state.usedNumbers} 
//                     />
//           }
//   </div>
//       );
//     };
//   };
   
//   const Stars = (props) => {
//   return(
//   <div className="col-5">
//     {_.range(props.numberStars).map((i) => 
//          <i key={i} className='fa fa-star' />
//         )}
//   </div>
//   );
//   }
   
//   const Button = (props) => {
//   let button;
//     switch(props.answerIsCorrect) {
//     case true:
//      button = 
//       <button className="btn btn-success"
//          onClick={() => props.validateNumbers()} >
//          <i className="fa fa-check" /> 
//       </button>
//     break;
//     case false:
//      button = 
//       <button className="btn btn-danger"
//          onClick={() => props.validateNumbers()} >
//          <i className="fa fa-times"/> 
//       </button>
//     break;
//     default:
//      button = 
//      <button className="btn"
//          onClick={() => props.validateNumbers()} disabled={props.selectedNumbers.length === 0} >
//          =
//         </button>
//     break;
//     }
//   return(
//   <div className="col-2 text-center">
//        {button}
//         <br/><br/>
//         <button className="btn btn-warning btn-sm" onClick={() => props.reDraw()}
//          disabled={props.redraws === 0} >
//           <i className="fa fa-refresh" /> {props.redraws}
//         </button>
//   </div>
//   );
//   }
   
//   const Answer = (props) => {
//   return(
//   <div className="col-5">
//     {props.selectedNumbers.map((number, i) => 
//          <span key={i} 
//           onClick={() => props.unSelectNumber(number)}
//           >
//           {number}
//           </span>
//         )}
//   </div>
//   );
//   }
   
//   const Numbers = (props) => {
//   const numberClassName = (number) => {
//      if(props.selectedNumbers.indexOf(number) >= 0)
//        return 'selected';
//       if(props.usedNumbers.indexOf(number) >= 0)
//        return 'used';
//     }
//     return(
//       <div className="card text-center">
//         <div>
//          {_.range(1,10).map((number, i) =>
//           <span key={i} className={numberClassName(number)}
//            onClick={() => props.selectNumber(number)} 
//                         >
//                         {number}
//                 </span>)}
//         </div>
//       </div>
//     );
//   }
   
//   const DoneFrame = (props) => {
//   return(
//     <div className="text-center">
//       <h2>
//         {props.doneStatus}
//       </h2>
//     </div>
    
//     )
   
//   }

export default App;