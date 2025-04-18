let question, options, submitButton, result, inputField;
let questionData;
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

function preload() {
  // 載入 CSV 檔案
  questionData = loadTable('questions.csv', 'csv', 'header');
}

function setup() { //這是一個初始化函數，只會執行一次
  //產生一個全視窗大小的畫布
  createCanvas(windowWidth, windowHeight);
  //設定背景顏色 (在setup()裡面設定背景色，如同買回來的圖畫紙背景顏色)
  background("#fad2e1");

  // 產生題目
  question = createElement('h2', '');
  question.style('color', '#000000');
  question.style('font-size', '35px');

  // 產生選項
  options = createRadio();
  options.style('font-size', '35px');
  options.style('color', '#8da9c4');

  // 產生填空題輸入框
  inputField = createInput();
  inputField.style('font-size', '35px');
  inputField.style('color', '#8da9c4');
  inputField.hide();

  // 產生送出按鈕
  submitButton = createButton('下一題');
  submitButton.style('font-size', '35px');
  submitButton.style('color', '#8da9c4');
  submitButton.mousePressed(nextQuestion);

  // 產生結果顯示
  result = createElement('h2', '');
  result.style('color', '#000000');
  result.style('font-size', '35px');

  // 顯示第一題
  displayQuestion();

  // 更新元素位置
  updateElementPositions();
}

function draw() { //這是一個重複執行的函數，畫圖的函數
  background("#fad2e1"); //一直塗上整張圖畫紙的顏色
  
  // 設定填充顏色
  fill("#fde2e4");
  // 設定無邊框
  noStroke();
  // 畫一個矩形，位置在視窗的中間，寬為全視窗的1/2，高為視窗高的1/2
  rect(windowWidth / 4, windowHeight / 4, windowWidth / 2, windowHeight / 2);
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
  updateElementPositions();
}

function updateElementPositions() {
  // 更新題目位置
  question.position(windowWidth / 2 - 50, windowHeight / 2 - 100);

  // 更新選項位置
  options.position(windowWidth / 2 - 50, windowHeight / 2 - 50);

  // 更新填空題輸入框位置
  inputField.position(windowWidth / 2 - 50, windowHeight / 2 - 50);

  // 更新送出按鈕位置
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 60);

  // 更新結果顯示位置
  result.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
}

function displayQuestion() {
  let row = questionData.getRow(currentQuestionIndex);
  let questionText = row.getString('question');
  let type = row.getString('type');

  question.html(questionText);
  result.html('');

  if (type === 'choice') {
    let option1 = row.getString('option1');
    let option2 = row.getString('option2');
    let option3 = row.getString('option3');
    let option4 = row.getString('option4');

    options.html('');
    options.option(option1);
    options.option(option2);
    options.option(option3);
    options.option(option4);
    options.show();
    inputField.hide();
  } else if (type === 'fill') {
    options.hide();
    inputField.show();
  }
}

function nextQuestion() {
  checkAnswer();
  currentQuestionIndex++;
  if (currentQuestionIndex < questionData.getRowCount()) {
    displayQuestion();
  } else {
    displayResults();
  }
}

function checkAnswer() {
  let row = questionData.getRow(currentQuestionIndex);
  let type = row.getString('type');
  let correctAnswer = row.getString('answer');
  let selectedOption;

  if (type === 'choice') {
    selectedOption = options.value();
  } else if (type === 'fill') {
    selectedOption = inputField.value();
  }

  if (selectedOption === correctAnswer) {
    result.html("答對了");
    correctCount++;
  } else {
    result.html("答錯了");
    incorrectCount++;
  }
}

function displayResults() {
  question.html('測驗結束');
  options.html('');
  inputField.hide();
  submitButton.html('再試一次');
  submitButton.mousePressed(restartQuiz);
  result.html(`答對了 ${correctCount} 題，答錯了 ${incorrectCount} 題`);
}

function restartQuiz() {
  currentQuestionIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  submitButton.html('下一題');
  submitButton.mousePressed(nextQuestion);
  displayQuestion();
}
