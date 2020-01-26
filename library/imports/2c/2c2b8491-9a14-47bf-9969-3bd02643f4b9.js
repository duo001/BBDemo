"use strict";
cc._RF.push(module, '2c2b8SRmhRHv5lpO9AmQ/S5', 'noteBar');
// scripts/noteBar.js

'use strict';

cc.Class({
	extends: cc.Component,

	properties: {
		note: { //note预制件
			default: null,
			type: cc.Prefab
		},

		notes: { //进入轨道的所有note
			default: [],
			type: [cc.Node]
		},

		beatMap: { //该轨道的所有note的谱面
			default: [],
			visible: false
		},

		noteGenerateTimes: { //生成note的时间
			default: [],
			visible: false
		},

		currentNote: 0, //下一个待加入轨道的note

		noteToJudge: 0, //下一个被触发的note
		lastNoteToJudge: 0 //队列尾
	},

	onLoad: function onLoad() {
		//计算note出现的位置和在轨道上的时间（最佳判定时间）
		this.top = this.node.height + this.node.y;
		var judgePoint = this.node.getChildByName('judgeArea').y;
		var nodeSlideLength = Math.abs(this.top / 2 - judgePoint);
		this.nodePerfectTime = nodeSlideLength / window.Global.gameSpeed;
		//注册键盘监听函数
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		var keyArea = this.node.getChildByName('keyArea');
		keyArea.on('touchstart', function () {
			this.judgeNote();
		}, this);
	},

	onKeyDown: function onKeyDown(event) {
		switch (event.keyCode) {
			case cc.macro.KEY.d:
				if (this.node.name === '0') {
					this.judgeNote();
				}
				break;
			case cc.macro.KEY.f:
				if (this.node.name === '1') {
					this.judgeNote();
				}
				break;
			case cc.macro.KEY.j:
				if (this.node.name === '2') {
					this.judgeNote();
				}
				break;
			case cc.macro.KEY.k:
				if (this.node.name === '3') {
					this.judgeNote();
				}
				break;
			default:
				;
		}
	},

	judgeNote: function judgeNote() {
		//当下标小于数组长度且游戏出于playing状态
		if (this.noteToJudge < this.lastNoteToJudge && window.Global.gameState === 'playing') {
			//取当前游戏时间与谱面要求的判定时间的差值的绝对值作为判定标准
			var judgeTime = Math.abs(this.beatMap[this.noteToJudge] - window.Global.timePassed);

			if (judgeTime < window.Global.missTime) {
				if (judgeTime < window.Global.perfectTime) {
					this.notes[this.noteToJudge++].getComponent('note').perfect();
				} else if (judgeTime < window.Global.greatTime) {
					this.notes[this.noteToJudge++].getComponent('note').great();
				} else if (judgeTime < window.Global.goodTime) {
					this.notes[this.noteToJudge++].getComponent('note').good();
				} else {
					this.notes[this.noteToJudge++].getComponent('note').bad();
				}
			}
		}
	},

	start: function start() {
		this.node.getChildByName('keyArea').getChildByName('keyLabel').getComponent(cc.Label).string = window.Global.keySetting[parseInt(this.node.name)];
		for (var tmp = 0; tmp < this.beatMap.length; tmp++) {
			//生成note的时间是最佳判定时间减去在轨道上的运动时间加上自定义偏移
			this.noteGenerateTimes[tmp] = this.beatMap[tmp] - this.nodePerfectTime + window.Global.offset;
		}
	},


	generateNote: function generateNote() {
		//生成note
		//当下标小于数组长度且当下一个待加入轨道的note的生成时间小于当前时间
		if (this.currentNote < this.beatMap.length && this.noteGenerateTimes[this.currentNote] < window.Global.timePassed) {
			var newNote = cc.instantiate(this.note); //创建note
			newNote.setPosition(cc.v2(0, this.top / 2)); //设置位置为轨道顶部
			this.node.addChild(newNote); //加入作为轨道的子节点
			this.notes.push(newNote); //加入待判定note队列
			this.lastNoteToJudge++;
			this.currentNote++; //下标加1
		}
	},

	update: function update(dt) {
		if (window.Global.gameState === 'playing') {
			this.generateNote();
			var judgeTime = window.Global.timePassed - this.beatMap[this.noteToJudge];
			if (judgeTime > window.Global.missTime) {
				this.notes[this.noteToJudge++].getComponent('note').miss();
			}
		}
	}
});

cc._RF.pop();