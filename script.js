const deck = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]//need to build in Ace handling, should I put this in the game object? 
let cardNames = {1: "Ace", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", fCardPicker: function(){ 
    return cardNames.faceCards[(Math.floor(Math.random() * 4))]
}, faceCards: ["Ten", "Jack", "Queen", "King"]};


let game = { 
 	plCards: [],
  dlCards: [],
  pBank: 1500,
  bet: 0, 
  result: function (num, text){
    document.getElementById("log").innerHTML = text; 
    if(num === 0){
      game.pBank -= game.bet;
    }
    else if(num === 1){
      game.pBank += parseInt(game.bet);
    }
    else if(num === 3){
      game.pBank += parseInt((game.bet * 1.5));
    }

    document.getElementById("pBank-num").innerHTML =  game.pBank;
  },
  deal: function(){
      if(this.plCards.length > 0){
        return false
      }
      else {
      for(i=1; i < 3; i++){
      this.plCards.push(this.random());
      this.dlCards.push(this.random());
      };
     document.getElementById("pCardOne").innerHTML = game.plCards[0];// CHANGE: Make this more scaleable. Doing it by ID is not best practice. template literals may help here.
     document.getElementById("pCardTwo").innerHTML = game.plCards[1];
     document.getElementById("dCardOne").innerHTML = game.dlCards[0];
     document.getElementById("dCardTwo").innerHTML = game.dlCards[1];
     game.bet = document.getElementById("bet-amount").value;
     this.bjDecider(this.sum(this.plCards),this.sum(this.dlCards));
      }
    },
  hit: function(arr, hand) {//Prevent Hit before deal (hide button?)
          	 if(this.plCards.length === 0){
            return false
            }
            else {
            const newNum = this.random();
            arr.push(newNum);
            game.newCards(newNum, hand);
            this.bustCheck(this.sum(this.plCards), this.sum(this.dlCards))
        }
  },
  sum: function(arr){
     	const sumHand = arr.reduce((all, item) =>	all += item);
      if(sumHand <= 21){
        return sumHand;
      }
      else if(arr.includes(11)){
        if(arr === this.plCards){
              this.plCards = this.plCards.filter(element => element === 11 ? false : true);
              this.plCards.push(1);
              return this.plCards.reduce((all, item) =>  all += item);
          }
          else if(arr === this.dlCards){
              this.dlCards = this.dlCards.filter(element => element === 11 ? false : true);
              this.dlCards.push(1);
              return this.dlCards.reduce((all, item) =>  all += item);
          }
      }
      else{
        return sumHand;
      }
    }, 
  dlTurn: function (){
      if(this.sum(this.plCards)> 21){
        return false
      }
         else {
         while (this.sum(this.dlCards) < 17){
           game.hit(this.dlCards, "dHand");
           }
        this.decider(this.sum(this.plCards), this.sum(this.dlCards));
        }
    },
newCards: function(num, hand){//May need to change later to reuse old removed nodes for performance purposes
  let newP = document.createElement('p');
  newP.setAttribute("class", "Hand");

  let node = document.createTextNode(num);
  newP.appendChild(node); 
  let element = document.getElementById(hand);
  element.appendChild(newP);
  },
  reset: function(){ 
      this.zeroOut('pHand');
      this.zeroOut('dHand');
      document.getElementById('log').innerHTML = "" //FOR DEMO PRUPOSES ONLY - REMOVE     
  }, 
  delete: function(nChild, nParent){
    return nChild.length
  }, 
  zeroOut: function(hand){ 
        let eCards = document.getElementById(hand).children;
        let eHand = document.getElementById(hand);
       if(eCards.length === 2){
        this.plCards.length = 0;
        this.dlCards.length = 0;
        document.getElementById("pCardOne").innerHTML = "";
        document.getElementById("pCardTwo").innerHTML = "";
        document.getElementById("dCardOne").innerHTML = "";
        document.getElementById("dCardTwo").innerHTML = "";
        }
        else {
        
        for(i= (eCards.length-1); i > 1; i--){
          eHand.removeChild(eCards[i]);
        }
        this.plCards.length = 0;
        this.dlCards.length = 0;
        document.getElementById("pCardOne").innerHTML = "";
        document.getElementById("pCardTwo").innerHTML = "";
        document.getElementById("dCardOne").innerHTML = "";
        document.getElementById("dCardTwo").innerHTML = "";
        }
        document.getElementById("pCardOne").className = "Hand";
        document.getElementById("pCardTwo").className = "Hand";
        document.getElementById("dCardOne").className = "Hand";
        document.getElementById("dCardTwo").className = "Hand";
  }, 
  random: function(){
    return deck[Math.floor(Math.random() * 13)];
  },
  bjDecider: function (sum1, sum2){// IMPORTANT: change results for each conditional to trigger winner function
    if(sum1 === 21 && sum2 === 21){
      this.result(2,"Push");
      }
    else if(sum1 === 21){
      this.result(3, "BlackJack! You Win!");
      this.winner("pHand");
    }
    else if(sum2 === 21){
      this.result(0, "Dealer Wins with BlackJack");
      this.winner("dHand");
    }
    else {//DO I NEED THIS OR CAN I JUST HAVE IT DO NOTHING? 
      return false
    }
  },
  decider: function(sum1, sum2){
      if(sum2 > sum1 && sum2 <= 21){
        this.result(0, "Dealer Wins with Higher Hand");
        this.winner("dHand");
      }
      else if(sum2 >= 17 && sum2 <= 21){
        if(sum1 === sum2){
          this.result(2, "Push")
        }
        else if(sum1 > sum2 && sum1 <= 21){
          this.result(1, "You Win with Higher Hand");
          this.winner("pHand");
        }
        else if(sum2 > sum1 && sum2 <= 21){
          this.result(0, "Dealer Wins with Higher Hand");
          this.winner("dHand");
        }
      }
    else {
      return false
    }
}, 
  bustCheck: function(sum1, sum2){//must write end game onto this function as this automatically ends the game
    if(sum1 > 21){
      this.result(0, "You Busted, Dealer Wins");
      this.winner("dHand");
    }
    else if(sum2 > 21){
      this.result(1, "Dealer Busts, You Win!");
      this.winner("pHand");
    }
}, 
winner: function(handName){//can fold into the result function
  const handDiv= document.getElementById(handName).children;
  for(i = 0; i < (handDiv.length); i++){
    handDiv[i].className = "winningHand";
  }
},
doubleDown: function(){
  game.bet = (game.bet * 2);
  game.hit(this.plCards, 'pHand');//need to double-down the bet once betting is added*****
  game.dlTurn();
  game.bet = (game.bet/2);
},
pBankSet: function(num){

}
  
}


//Should not be able to hit reset button in the middle of the game - hide, or disable while game is played 

//should only be able to hit doubledown on the first card, right? 

//need to add something to happen when pbank hits 0 - need to restart 

//See Animation section of FCC to figure out how to have card animations 

//hide one dealer card

//add sum display 

///upon winner or blackjack - should disable buttons - can currently hit them - could create a "game over" state that disables or hides all but the deal buttons 

//needs to include zeroing out and ending the game at that point

//How do I remember who visited the site and keep their bankroll the same? Is this possible? 

//how do I hide the inputs from users to prevent manipulation? 

//connect to CSS card library via internet as opposed to within the repository  













