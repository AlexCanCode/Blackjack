const deck = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]//need to build in Ace handling, should I put this in the game object? 
let cardNames = {1: "Ace", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", fCardPicker: function(){ 
    return cardNames.faceCards[(Math.floor(Math.random() * 4))]
}, faceCards: ["Ten", "Jack", "Queen", "King"]};


let game = {
 	plCards: [],
  dlCards: [],
  result: function (text){
    document.getElementById("log").innerHTML = text;
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
     this.bjDecider(this.sum(this.plCards),          this.sum(this.dlCards))
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
              return this.plCards.reduce((all, item) =>  all += item);//should I be using recursion here? returning sum(this.plCards);?
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
  bustText: function (str){//SHOULD just turn this into a "result" function that declares the outcome win or lose and then indicates the outcome by changing styling to winning or losing hand (or both with red being losing and green being winning - use border around cards?)
  this.busted.innerHTML = str + " Busts!";
  this.busted.style.visibility = "visible";
  },
  bjDecider: function (sum1, sum2){// IMPORTANT: change results for each conditional to trigger winner function
    if(sum1 === 21 && sum2 === 21){
      this.result("Push");
      }
    else if(sum1 === 21){
      this.result("BlackJack! You Win!");
      this.winner("pHand");
    }
    else if(sum2 === 21){
      this.result("Dealer Wins with BlackJack");
      this.winner("dHand");
    }
    else {//DO I NEED THIS OR CAN I JUST HAVE IT DO NOTHING? 
      return false
    }
  },
  decider: function(sum1, sum2){
      if(sum2 > sum1 && sum2 <= 21){
        this.result("Dealer Wins with Higher Hand");
        this.winner("dHand");
      }
      else if(sum2 >= 17 && sum2 <= 21){
        if(sum1 === sum2){
          this.result("Push")
        }
        else if(sum1 > sum2 && sum1 <= 21){
          this.result("You Win with Higher Hand");
          this.winner("pHand");
        }
        else if(sum2 > sum1 && sum2 <= 21){
          this.result("Dealer Wins with Higher Hand");
          this.winner("dHand");
        }
      }
    else {
      return false
    }
}, 
  bustCheck: function(sum1, sum2){//must write end game onto this function as this automatically ends the game
    if(sum1 > 21){
      this.result("You Busted, Dealer Wins");
      this.winner("dHand");
    }
    else if(sum2 > 21){
      this.result("Dealer Busts, You Win!");
      this.winner("pHand");
    }
}, 
  winner: function(handName){
  const handDiv= document.getElementById(handName).children;
  for(i = 0; i < (handDiv.length); i++){
    handDiv[i].className = "winningHand";
  }
}
  
}

//See Animation section of FCC to figure out how to have card animations 

//Need to write seperate logic for blackjacks vs having 21 and then need to seperate out the bust checker from the blackjack checker as if someone has 21 but not blackjack, the dealer will continue to their hand 

//hide one dealer card

//add sum display 

// add win or losing event that handles what is currenlty console logged for the decider 

/*function logging() {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    }
};*/

///upon winner or blackjack - should disable buttons - can currently hit them 














