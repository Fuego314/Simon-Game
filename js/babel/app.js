'use strict';

document.addEventListener("DOMContentLoaded", function () {
	var _this = this;

	var settings = {
		start: document.getElementById('start'),
		strictBtn: document.getElementById('strict-mode'),
		strictOn: false
	},
	    game = {
		sequence: [],
		userPick: [],
		compTurn: true,
		round: 0,
		justWrong: false,
		running: false
	},
	    board = {
		gameBtn: document.getElementsByClassName('game-btn'),
		sndTL: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
		sndTR: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
		sndBL: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
		sndBR: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
	};

	function getNext() {
		var rndmNum = Math.floor(Math.random() * (board.gameBtn.length - 1 - 0 + 1)) + 0,
		    next = board.gameBtn[rndmNum];
		return next;
	}

	function sequence() {
		if (game.running && game.round < 20) {
			var delay = 200,
			    timeOn = 1000;

			if (game.justWrong === false) {
				game.sequence.push(getNext());
				game.justWrong = false;
				game.round++;
				document.getElementById('round').innerHTML = 'Round: ' + game.round;
			}

			setTimeout(function () {
				(function (timeOut1, timeOut2) {
					var _loop = function _loop(i) {
						setTimeout(function () {
							if (game.running) {
								game.sequence[i].classList.add('lit');
								var btnClass = game.sequence[i].classList[0];
								compLight(btnClass);
							}
						}, timeOut1);
						setTimeout(function () {
							game.sequence[i].classList.remove('lit');
						}, timeOut2);
						timeOut1 += 1000;
						timeOut2 += 1000;
					};

					for (var i = 0; i < game.sequence.length; i++) {
						_loop(i);
					}
				})(delay, timeOn);
			}, 400);

			setTimeout(function () {
				game.userTurn = true;
			}, 1000 * game.sequence.length);
		}
	}

	function check() {
		if (game.running && game.round < 20) {
			if (game.userPick[game.userPick.length - 1] === game.sequence[game.userPick.length - 1]) {
				// Correct
				if (game.userPick.length === game.round) {
					// Correct & last in sequence
					if (game.round === 19) {
						winner();
					}
					game.justWrong = false;
					game.userPick = [];
					setTimeout(function () {
						game.userTurn = false;
					}, 150);
					game.round === 19 ? winner() : sequence();
				}
			}

			if (game.userPick[game.userPick.length - 1] !== game.sequence[game.userPick.length - 1]) {
				// Wrong
				game.userPick = [];
				wrongLights();
				if (settings.strictOn === true) {
					// Strict mode reset
					game.round = 0;
					game.sequence = [];
					game.running = false;
					game.userTurn = false;
					settings.start.classList.remove('start-active');
				} else {
					setTimeout(function () {
						game.justWrong = true;
						sequence();
					}, 2000);
				}
			}
		}
	}

	function wrongLights() {
		var delay = 350,
		    timeOn = 500,
		    error = new Audio('https://notificationsounds.com/soundfiles/ad972f10e0800b49d76fed33a21f6698/file-sounds-1056-i-saw-you.wav');

		error.play();
		(function (timeOut1, timeOut2) {
			for (var j = 0; j < 3; j++) {
				var _loop2 = function _loop2(i) {
					setTimeout(function () {
						board.gameBtn[i].classList.add('lit');
					}, timeOut1);
					setTimeout(function () {
						board.gameBtn[i].classList.remove('lit');
					}, timeOut2);
					timeOut1 += 100;
					timeOut2 += 100;
				};

				for (var i = 0; i < board.gameBtn.length; i++) {
					_loop2(i);
				}
			}
		})(delay, timeOn);
	}

	function winner() {
		document.getElementById('round').innerHTML = 'Winner!';
	}

	// Add light effect to click when users turn
	(function () {
		var snds = [board.sndTL, board.sndBL, board.sndTR, board.sndBR];

		var _loop3 = function _loop3(i) {
			board.gameBtn[i].addEventListener('mousedown', function () {
				if (game.userTurn === true && game.running) {
					this.classList.add('lit');
					snds[i].currentTime = 0;
					snds[i].play();
					game.userPick.push(this);
					check();
				}
			});
			board.gameBtn[i].addEventListener('mouseup', function () {
				_this.classList.remove('lit');
			});
		};

		for (var i = 0; i < board.gameBtn.length; i++) {
			_loop3(i);
		}
	})();

	function compLight(btnsClass) {
		if (btnsClass === 'topL') {
			board.sndTL.currentTime = 0;
			board.sndTL.play();
		} else if (btnsClass === 'topR') {
			board.sndTR.currentTime = 0;
			board.sndTR.play();
		} else if (btnsClass === 'bottomL') {
			board.sndBL.currentTime = 0;
			board.sndBL.play();
		} else if (btnsClass === 'bottomR') {
			board.sndBR.currentTime = 0;
			board.sndBR.play();
		}
	}

	settings.strictBtn.addEventListener('click', function (e) {
		e.preventDefault();
		if (game.running === false) {
			this.classList.toggle('strict-active');
			settings.strictOn = !settings.strictOn;
		}
	});

	settings.start.addEventListener('click', function (e) {
		e.preventDefault();
		this.classList.toggle('start-active');
		if (game.running === false) {
			game.sequence = [];
			game.running = true;
			sequence();
		} else {
			game.running = false;
			game.round = 0;
			game.userPick = [];
			game.justWrong = false;
			game.compTurn = true;
		}
	});
});