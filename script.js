const deck = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
const suits = {"spades": "♠", "diamonds": "♦", "clubs": "♣", "hearts": "♥"};


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
     this.addCardValues(this.deckRender(game.dlCards[1]), (suits[this.getSuit()]), "#dCardTwo"); 
     this.addCardValues(this.deckRender(game.plCards[0]), (suits[this.getSuit()]), "#pCardOne"); 
     this.addCardValues(this.deckRender(game.plCards[1]), (suits[this.getSuit()]), "#pCardTwo"); 
  
     game.bet = document.getElementById("bet-amount").value;
     this.bjDecider(this.sum(this.plCards),this.sum(this.dlCards));
      }
    },
  addCardValues: function(value, suit, location){
        const cardVals = document.querySelector(location).querySelectorAll('.cardVal');
        cardVals[0].innerHTML = value + "<br>" + suit;
        cardVals[1].innerHTML = suit + "<br>" + value;

        if(suit == "♥" || suit == "♦"){
          cardVals[0].style.color = "red";
          cardVals[1].style.color = "red";
        }
  },
  hit: function(arr, hand) {//Prevent Hit before deal (hide button?)
          	 if(this.plCards.length === 0){
            return false
            }
            else {
            const newNum = this.random();
            arr.push(newNum);
            game.newCards(newNum, hand, this.getSuit());
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
newCards: function(num, hand, suit){//**** This is messy. Investigate a better way to do this - Make sure it is supportable accross browsers
  const handCont = document.getElementById(hand);
  const divHand = document.createElement("div")
  const divOne = document.createElement("div");
  const divTwo = document.createElement("div");
  const divThree = document.createElement("div");
  const brkOne = document.createElement("br");
  const brkTwo = document.createElement("br");
  
  divHand.setAttribute("class", "hand")
  divOne.setAttribute("class", "card1 cardVal")
  divTwo.setAttribute("class", "card2")
  divThree.setAttribute("class", "card3 cardVal")

   if(suit == "hearts" || suit == "diamonds"){
      divOne.style.color = "red";
      divThree.style.color = "red";
          }

  const nodeNum = document.createTextNode((game.deckRender(num)));
  const nodeSuit = document.createTextNode(suits[suit]);

  divOne.appendChild(nodeNum);
  divOne.appendChild(brkOne);
  divOne.appendChild(nodeSuit);

  const nodeNumTwo = document.createTextNode((game.deckRender(num)));
  const nodeSuitTwo = document.createTextNode(suits[suit]);

  divThree.appendChild(nodeSuitTwo);
  divThree.appendChild(brkTwo);
  divThree.appendChild(nodeNumTwo);

  divHand.appendChild(divOne);
  divHand.appendChild(divTwo);
  divHand.appendChild(divThree);

  handCont.appendChild(divHand);
   
  


  },
  deckRender: function(num){
  if (num < 10){
    return num
  }
  else {
    if (num == 10){
      const faceCards = ["J", "Q", "K"]
      return faceCards[Math.floor(Math.random() * 2)];
    }
    else return "A";
  }
},
  reset: function(){ 
      this.zeroOut('pHand');
      this.zeroOut('dHand');
      document.querySelectorAll(".winningHand").forEach(x => x.className = "hand");
      document.querySelectorAll(".cardVal").forEach(x => x.style.color = "black");
      document.getElementById('log').innerHTML = "" //Resets on-screen info log
  }, 
  delete: function(nChild, nParent){
    return nChild.length
  }, 
  zeroOut: function(hand){ 
        let eCards = document.getElementById(hand).children;
        let eHand = document.getElementById(hand);

        document.querySelectorAll(".cardVal").forEach(x => x.innerHTML = "");
       if(eCards.length === 2){
        this.plCards.length = 0;
        this.dlCards.length = 0;
        
        
        }
        else {
        
        for(i= (eCards.length-1); i > 1; i--){
          eHand.removeChild(eCards[i]);
        }
        this.plCards.length = 0;
        this.dlCards.length = 0;
        
        }
        
  }, 
  random: function(){
    return deck[Math.floor(Math.random() * 13)];
  },
  bjDecider: function (sum1, sum2){
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
  bustCheck: function(sum1, sum2){
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
    handDiv[i].className = "hand winningHand";
  }
},
doubleDown: function(){
  game.bet = (game.bet * 2);
  game.hit(this.plCards, 'pHand');
  game.dlTurn();
  game.bet = (game.bet/2);
},


getSuit: function(){
  const suitChoice = ["spades", "diamonds", "clubs", "hearts"] // this feels redundent - may be able to just grab from suit array 
  return suitChoice[Math.floor(Math.random() * 3)];
}
  
}


//For all button issues - create states for buttons, have button greyed out and inclickable when not supposed to be pressed - also replace reset with delete after win state

//Should not be able to hit reset button in the middle of the game - hide, or disable while game is played 

//should only be able to hit doubledown on the first card, right? 

//need to add something to happen when pbank hits 0 - need to restart 

//See Animation section of FCC to figure out how to have card animations 

//add sum display 

///upon winner or blackjack - should disable buttons - can currently hit them - could create a "game over" state that disables or hides all but the deal buttons 

//needs to include zeroing out and ending the game at that point

//How do I remember who visited the site and keep their bankroll the same? Is this possible? 

//how do I hide the inputs from users to prevent manipulation? 















