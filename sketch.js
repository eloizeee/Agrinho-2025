let cards;
let card;
var colNum = 4;
var rowNum = 4;
let selected = [];
let flippedCards = [];
let picked;
let img1, img2, img3, img4, img5, img6, img7, img8;
let faceCards, faceCardsCopy;
let randomIndex;
let numFlipped = 0;
let timer = -1;
let delay = 60;
let set = 0;
let match = false;
let confetti = [];

let dinheiro = 0;
let jogoFinalizado = false;

// Feira atualizada
let feiraItens = [
  { nome: "Maçã", preco: 5.00 },
  { nome: "Bolo Caseiro", preco: 7.00 },
  { nome: "Pão de Forma", preco: 6.00 },
  { nome: "Manteiga Caseira", preco: 5.50 },
  { nome: "Doce de Leite Caseiro", preco: 6.00 },
];
let itensComprados = [];
let mensagemCompra = "";

function preload() {
  img1 = loadImage("square-01.png");
  img2 = loadImage("square-02.png");
  img3 = loadImage("square-03.png");
  img4 = loadImage("square-04.png");
  img5 = loadImage("square-05.png");
  img6 = loadImage("square-06.png");
  img7 = loadImage("square-07.png");
  img8 = loadImage("square-08.png");
}

function setup() {
  createCanvas(950, 550);

  faceCards = [
    img1, img2, img3, img4, img5, img6, img7, img8,
    img1, img2, img3, img4, img5, img6, img7, img8,
  ];

  myShuffle();

  cards = [];

  for (let i = 0; i < colNum; i++) {
    for (let j = 0; j < rowNum; j++) {
      var cardX = 190 + i * 70;
      var cardY = j * 70 + 90;
      var cardFace = selected.pop();
      card = new Card(cardX, cardY, 50, 50, cardFace);
      cards.push(card);
    }
  }

  for (i = 0; i < 50; i++) {
    confetti[i] = new Confetti();
  }
}

function draw() {
  background(220);

  fill(0);
  textSize(20);
  textAlign(LEFT);
  text("Dinheiro: R$ " + dinheiro.toFixed(2), 20, 30);

  if (!match && numFlipped === 2 && frameCount - timer > delay) {
    for (let card of cards) {
      if (!card.set) card.isFaceUp = false;
    }
    flippedCards = [];
    numFlipped = 0;
    timer = -1;
  }

  for (let i = 0; i < cards.length; i++) {
    cards[i].body();
    cards[i].hover();
    cards[i].display();
  }

  if (jogoFinalizado) {
    drawFeira();

    textAlign(CENTER);
    textSize(22);
    fill("green");
    text("Parabéns! Você ganhou R$" + dinheiro.toFixed(2) + " para gastar na feira!", width / 2, 60);

    for (let i = 0; i < confetti.length; i++) {
      confetti[i].body();
      confetti[i].fall();
    }

    fill(0);
    textSize(18);
    text("Itens comprados: " + (itensComprados.length > 0 ? itensComprados.join(", ") : "nenhum"), width / 2, height - 40);
    text(mensagemCompra, width / 2, height - 20);
  }
}

function mouseClicked() {
  if (jogoFinalizado) {
    for (let i = 0; i < feiraItens.length; i++) {
      let x = 50 + i * 180;
      let y = 120;
      let w = 160;
      let h = 80;

      if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        let item = feiraItens[i];
        if (dinheiro >= item.preco) {
          dinheiro -= item.preco;
          itensComprados.push(item.nome);
          mensagemCompra = "Você comprou: " + item.nome;
        } else {
          mensagemCompra = "Dinheiro insuficiente para " + item.nome;
        }
      }
    }

    return;
  }

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].hoverBool && !cards[i].isFaceUp && !cards[i].set) {
      if (numFlipped < 2) {
        cards[i].isFaceUp = true;
        flippedCards.push(cards[i]);
        numFlipped++;

        if (flippedCards.length === 2) {
          if (flippedCards[0].picked === flippedCards[1].picked) {
            flippedCards[0].set = true;
            flippedCards[1].set = true;
            match = true;
            set++;
            dinheiro += 5;
            flippedCards = [];
            numFlipped = 0;

            if (set === 8) {
              jogoFinalizado = true;
            }
          } else {
            match = false;
            timer = frameCount;
            dinheiro = max(0, dinheiro - 1);
          }
        }
      }
    }
  }
}

function drawFeira() {
  for (let i = 0; i < feiraItens.length; i++) {
    let x = 50 + i * 180;
    let y = 120;
    let w = 160;
    let h = 80;

    fill(255);
    stroke(0);
    rect(x, y, w, h, 10);

    fill(0);
    noStroke();
    textAlign(CENTER);
    textSize(16);
    text(feiraItens[i].nome + "\nR$" + feiraItens[i].preco.toFixed(2), x + w / 2, y + h / 2 + 5);
  }
}

class Card {
  constructor(x, y, w, h, picked) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.col = color(200);
    this.picked = picked;
    this.isFaceUp = false;
    this.set = false;
    this.hoverBool = false;
  }

  body() {
    rectMode(CENTER);
    fill(this.col);
    rect(this.x, this.y, this.w, this.h, 10);
  }

  hover() {
    if (
      mouseX > this.x - this.w / 2 &&
      mouseX < this.x + this.w / 2 &&
      mouseY < this.y + this.h / 2 &&
      mouseY > this.y - this.h / 2
    ) {
      this.col = color(160);
      this.hoverBool = true;
    } else {
      this.col = color(200);
      this.hoverBool = false;
    }
  }

  display() {
    if (this.isFaceUp) {
      imageMode(CENTER);
      image(this.picked, this.x, this.y, this.w, this.h);
    }
  }
}

function myShuffle() {
  for (let i = 0; i < 16; i++) {
    let randomIndex = floor(random(faceCards.length));
    let picked = faceCards.splice(randomIndex, 1)[0];
    selected.push(picked);
  }
}

class Confetti {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.w = 10;
    this.col = random(255);
    this.speed = random(1, 5);
  }

  body() {
    fill(this.col);
    circle(this.x, this.y, this.w);
  }

  fall() {
    this.y += this.speed;
  }
}