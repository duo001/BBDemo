"use strict";
cc._RF.push(module, '8bb31p9H4hLx7PE++tgr1wJ', 'note');
// scripts/note.js

'use strict';

cc.Class({
	extends: cc.Component,

	properties: {
		arriveTime: 0
	},

	start: function start() {},


	miss: function miss() {
		window.Global.lastNoteJudgement = 'miss';
		window.Global.missCount++;
		window.Global.combo = 0;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Miss';
		window.Global.timer = 0;
	},

	bad: function bad() {
		window.Global.lastNoteJudgement = 'bad';
		window.Global.badCount++;
		window.Global.combo = 0;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Bad';
	},

	good: function good() {
		window.Global.lastNoteJudgement = 'good';
		window.Global.goodCount++;
		window.Global.combo = 0;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Good';
	},

	great: function great() {
		window.Global.lastNoteJudgement = 'great';
		window.Global.greatCount++;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Great: ' + ++window.Global.combo;
		if (window.Global.combo > window.Global.maxCombo) window.Global.maxCombo = window.Global.combo;
	},

	perfect: function perfect() {
		window.Global.lastNoteJudgement = 'perfect';
		window.Global.perfectCount++;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Perfect: ' + ++window.Global.combo;
		if (window.Global.combo > window.Global.maxCombo) window.Global.maxCombo = window.Global.combo;
	},

	update: function update(dt) {
		if (window.Global.gameState === 'playing') {
			this.node.y -= dt * window.Global.gameSpeed;
		}
	}
});

cc._RF.pop();