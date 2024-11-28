

import { Elm } from './Main.elm';

const $root = document.createElement('div');
document.body.appendChild($root);

Elm.Main.init({
  node: $root
});



import { Elm2 } from './Main2.elm';


document.createElement('br');
document.createElement('br');
document.createElement('br');

const $root2 = document.createElement('div');
document.body.appendChild($root2);

Elm2.Main2.init({
  node: $root2
});
