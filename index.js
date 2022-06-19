var textarea = document.querySelector('textarea');
var result = document.querySelector('.result');
    
var decMap = {
  "a": "L",
  "b": "I",
  "c": "",
  "d": "S",
  "e": "r",
  "f": "w",
  "g": "",
  "h": "l",
  "i": "i",
  "j": "d",
  "k": "",
  "l": "x",
  "m": "",
  "n": "m",
  "o": "",
  "p": "",
  "q": "y",
  "r": "p",
  "s": "",
  "t": "",
  "u": "t",
  "v": "f",
  "w": "",
  "x": "",
  "y": "",
  "z": "",
  "A": "H",
  "B": "T",
  "C": "",
  "D": "e",
  "E": "a",
  "F": "",
  "G": "b",
  "H": "",
  "I": "Y",
  "J": "",
  "K": "s",
  "L": "",
  "M": "",
  "N": "W",
  "O": "n",
  "P": "h",
  "Q": "",
  "R": "",
  "S": "",
  "T": "",
  "U": "g",
  "V": "o",
  "W": "u",
  "X": "v",
  "Y": "",
  "Z": "",
  "_": "c"
};

const original = JSON.parse(JSON.stringify(decMap));

let usefulChars = {};

const changeValue = (ch, val) => {
  const ele = document.querySelector('.item.key-' + ch.charCodeAt());
  if (decMap[ch] !== val) {
    decMap[ch] = val;
    reveal();
  }
  if (val.length === 0) {
    if (usefulChars[ch] === true) {
      ele.classList.add('warn');
      ele.classList.remove('changed');
      ele.classList.remove('blank');
    }
    else {
      ele.classList.remove('warn');
      ele.classList.remove('changed');
      ele.classList.add('blank');
    }
  }
  else if (original[ch] === val) {
    ele.classList.remove('warn');
    ele.classList.remove('changed');
    ele.classList.remove('blank');
  }
  else {
    ele.classList.remove('warn');
    ele.classList.add('changed');
    ele.classList.remove('blank');
  }
}

const initMap = () => {
  let rev = '<div>';
  for (let x in decMap)
    if (decMap.hasOwnProperty(x))
      rev += `<div class='item key-${x.charCodeAt()} ${decMap[x].length === 0 ? `blank` : ''}'>${x} &gt;&gt;<input maxlength='1' oninput="value=value.replace(/[^0-9A-Za-z_]/g,''); changeValue(\'${x}\', value)" value="${decMap[x]}"></div> ${x === 'Z' || x === 'z' ? "</div><div style='width: 100%; height: 15px'></div><div>" : ""}`;
  rev += '</div>';
  document.querySelector('.map').innerHTML = rev;
};

initMap();

const reveal = () => {
  usefulChars = {};
  const lines = textarea.value.split('\n');
  let rev = '';
  let rawText = '';
  const space = '<span>&nbsp;</span>';
  for (let x in lines) {
    let line = lines[x];
    if (line.length === 0)
      continue;
    let html = '';
    let html2 = '';
    let secondLine = false;
    for (let i = 0; i < line.length; i ++) {
      let ch = line[i];
      if (ch.charCodeAt() >= 48 && ch.charCodeAt() <= 57) {
        html += space;
        html2 += `<span class='number'>${ch}</span>`;
        secondLine = true;
        rawText += ' ';
      }
      else if (!decMap.hasOwnProperty(ch)) {
        html += `<span class='wrong'>${ch}</span>`;
        html2 += space;
        rawText += ch;
      }
      else if (decMap[ch] === '') {
        usefulChars[ch] = true;
        html += `<span class='unknown'>${ch}</span>`;
        html2 += space;
        rawText += ch;
      }
      else {
        usefulChars[ch] = true;
        html += `<span class='match'>${decMap[ch]}</span>`;
        html2 += space;
        rawText += decMap[ch];
      }
    }
    rev += '<div>' + html + '</div>';
    if (secondLine)
      rev += '<div>' + html2 + '</div>';
    rev += `<div style='width: 100%; height: 5px;'></div>`;
    rawText += '\n';
  }
  result.innerHTML = rev;
  for (let i in decMap)
    if (decMap.hasOwnProperty(i))
      changeValue(i, decMap[i]);
};

reveal();

textarea.addEventListener('input', (e) => {
  textarea.style.height = '0px';
  textarea.style.height = e.target.scrollHeight + 'px';
  reveal();
});

const adjustWidth = () => {
  const num = document.body.clientWidth;
  const displays = Math.max(Math.floor(num / 150), 1);
  console.log(displays);
  document.body.style.setProperty('--item-percent', 'calc(' + (100 / displays) + '% - 10px)');
};

adjustWidth();

window.onresize = () => {
  adjustWidth();
};