"use strict";
cc._RF.push(module, 'a4ccaZSYg9Lj7VmWAXq5gz+', 'game');
// scripts/game.js

'use strict';

cc.Class({
	extends: cc.Component,

	properties: {
		noteBar: {
			default: null,
			type: cc.Prefab
		},

		startBtn: {
			default: null,
			type: cc.Node
		},

		settingBtn: {
			default: null,
			type: cc.Node
		},

		combo: { //目前combo数
			default: 0,
			visible: false
		}
	},

	// LIFE-CYCLE CALLBACKS:

	gamePause: function gamePause() {
		//cc.game.pause();//游戏主循环暂停
		window.Global.gameState = 'pause';
		this.getComponent(cc.AudioSource).pause(); //音乐暂停
	},

	gameResume: function gameResume() {
		//cc.game.resume();
		window.Global.gameState = 'playing';
		this.getComponent(cc.AudioSource).resume(); //音乐恢复
	},

	gamePauseOrResume: function gamePauseOrResume() {
		if (window.Global.gameState === 'pause') {
			this.gameResume();
		} else if (window.Global.gameState === 'playing') {
			this.gamePause();
		}
	},

	onLoad: function onLoad() {
		//初始化
		window.Global.timePassed = 0; //初始化游戏时间
		window.Global.timer = 0;
		window.Global.combo = 0;
		window.Global.perfectCount = 0;
		window.Global.greatCount = 0;
		window.Global.goodCount = 0;
		window.Global.badCount = 0;
		window.Global.missCount = 0;
		window.Global.maxCombo = 0;
		window.Global.gameState = 'manu';
		var self = this;

		cc.loader.loadRes('beatMap.json', function (err, object) {
			if (err) {
				alert(err);
				return;
			}
			// 读取的数据返回在object中
			//初始化各个轨道
			self.initBars(object.json.beatMap);
		});

		//esc暂停
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

		var startBtn = this.startBtn;
		startBtn.on('touchend', self.gameStart, this);

		//为设置按钮添加监听函数
		var settingBtn = this.settingBtn;
		var settingPanel = this.node.getChildByName('settingPanel');
		settingBtn.on('touchend', function () {
			speedLabel.getComponent(cc.Label).string = "游戏速度：" + window.Global.gameSpeed + "(pixel/s)";
			offsetLabel.getComponent(cc.Label).string = "游戏偏移：" + window.Global.offset * 1000 + "(ms)";
			speedSlider.getComponent(cc.Slider).progress = parseFloat(window.Global.gameSpeed - 300) / 1000;
			offsetSlider.getComponent(cc.Slider).progress = window.Global.offset * 10 + 0.5;
			switch (window.Global.accuracyOffset) {
				case 0:
					cc.find('accuracyArea/accuracyToggleContainer/accurate', settingPanel).getComponent(cc.Toggle).isChecked = true;
					break;
				case 0.01:
					cc.find('accuracyArea/accuracyToggleContainer/normal', settingPanel).getComponent(cc.Toggle).isChecked = true;
					break;
				case 0.02:
					cc.find('accuracyArea/accuracyToggleContainer/fuzzy', settingPanel).getComponent(cc.Toggle).isChecked = true;
					break;
				default:
			}
			settingPanel.y = 0;
		}, settingBtn);

		//完善设置界面
		var returnBtn = cc.find('buttonArea/returnBtn', settingPanel);
		var confirmBtn = cc.find('buttonArea/confirmBtn', settingPanel);
		var speedSlider = cc.find('speedArea/speedSlider', settingPanel);
		var speedLabel = cc.find('speedArea/speedLabel', settingPanel);
		var offsetSlider = cc.find('offsetArea/offsetSlider', settingPanel);
		var offsetLabel = cc.find('offsetArea/offsetLabel', settingPanel);

		this.speed = window.Global.gameSpeed;
		this.offset = window.Global.offset;

		speedSlider.on('slide', function (slider) {
			slider.progress = slider.progress.toFixed(1);
			var speed = 800 + (slider.progress - 0.5) * 1000;
			speedLabel.getComponent(cc.Label).string = "游戏速度：" + speed + "(pixel/s)";
			this.speed = speed;
		}, this);

		offsetSlider.on('slide', function (slider) {
			slider.progress = slider.progress.toFixed(2);
			var offset = parseInt(slider.progress * 100) - 50;
			offsetLabel.getComponent(cc.Label).string = "游戏偏移：" + offset + "(ms)";
			this.offset = offset;
		}, this);

		returnBtn.on('touchend', function () {
			settingPanel.y = 10000;
		}, returnBtn);
		confirmBtn.on('touchend', function () {
			settingPanel.y = 10000;
			window.Global.gameSpeed = self.speed;
			window.Global.offset = parseFloat(self.offset) / 1000;
			if (cc.find('accuracyArea/accuracyToggleContainer/accurate', settingPanel).getComponent(cc.Toggle).isChecked) {
				window.Global.accuracyOffset = 0;
			} else if (cc.find('accuracyArea/accuracyToggleContainer/fuzzy', settingPanel).getComponent(cc.Toggle).isChecked) {
				window.Global.accuracyOffset = 0.015;
			} else {
				window.Global.accuracyOffset = 0.01;
			}
			window.Global.perfectTime = (window.Global.perfectTimeModel + window.Global.accuracyOffset).toFixed(2);
			window.Global.greatTime = (window.Global.greatTimeModel + window.Global.accuracyOffset).toFixed(2);
			window.Global.goodTime = (window.Global.goodTimeModel + window.Global.accuracyOffset).toFixed(2);
			window.Global.badTime = (window.Global.badTimeModel + window.Global.accuracyOffset).toFixed(2);
			window.Global.missTime = (window.Global.missTimeModel + window.Global.accuracyOffset).toFixed(2);
			cc.director.loadScene('game');
		}, confirmBtn);

		//为暂停按钮添加监听函数
		var pauseButton = this.node.getChildByName('pauseButton');

		var pausePanel = this.node.getChildByName('pausePanel'); //暂停弹窗

		pauseButton.on('touchend', function () {
			if (window.Global.gameState === 'playing') {
				self.gamePauseOrResume();
				pausePanel.opacity = 0;
				pausePanel.setPosition(cc.v2(0, 0));
				pausePanel.runAction(cc.fadeIn(0.2));
			}
		}, pauseButton);

		var continueBtn = pausePanel.getChildByName('continueBtn');
		var back2manuBtn = pausePanel.getChildByName('back2manuBtn');
		var daojishi = this.node.getChildByName('daojishi');

		continueBtn.on('touchend', function () {
			pausePanel.runAction(cc.fadeOut(0.2));
			setTimeout(function () {
				//倒计时
				daojishi.y = 0; //3
				daojishi.getComponent(cc.Label).string = "倒计时：3";
			}, 200);
			setTimeout(function () {
				daojishi.getComponent(cc.Label).string = "倒计时：2";
			}, 1200);
			setTimeout(function () {
				daojishi.getComponent(cc.Label).string = "倒计时：1";
			}, 2200);
			setTimeout(function () {
				daojishi.getComponent(cc.Label).string = "倒计时：0";
				daojishi.y = 10000;
				pausePanel.x = 10000; //隐藏
				self.gamePauseOrResume();
			}, 3200);
		}, continueBtn);

		back2manuBtn.on('touchend', function () {
			cc.director.loadScene('game');
		}, back2manuBtn);

		//为结束界面添加监听函数
		var finishPanel = this.node.getChildByName('finishPanel');
		finishPanel.on('touchend', function () {
			cc.director.loadScene('game');
		}, finishPanel);
	},


	gameStart: function gameStart() {
		//开始按钮的功能
		var self = this;
		window.Global.musicDuration = this.node.getComponent(cc.AudioSource).getDuration();
		this.timePassed = 0; //初始化游戏时间
		this.node.getChildByName('manu').x = 10000; //主菜单隐藏
		this.node.getChildByName('songInfo').setPosition(cc.v2(0, 0)); //显示歌曲信息
		this.node.getChildByName('songInfo').opacity = 0; //先设置透明度为零
		this.node.getChildByName('songInfo').runAction(cc.fadeIn(1)); //然后淡入
		setTimeout(function () {
			self.node.getChildByName('songInfo').runAction(cc.fadeOut(1)); //两秒后淡出
		}, 2000); //延迟2000毫秒执行function

		setTimeout(function () {
			//信息提示结束后一秒钟开始游戏
			self.node.getChildByName('songInfo').x = 10000; //歌曲信息隐藏
			self.getComponent(cc.AudioSource).play(); //播放音乐
			window.Global.gameState = 'playing'; //设置游戏状态为playing
		}, 4000); //延迟4000毫秒执行function
	},

	initBars: function initBars(beatMap) {
		//初始化各个轨道
		var numOfBars = beatMap.length;
		for (var bar = 0; bar < numOfBars; bar++) {
			var newNoteBar = cc.instantiate(this.noteBar);
			this.node.getChildByName('noteBarArea').addChild(newNoteBar);
			newNoteBar.getComponent('noteBar').beatMap = beatMap[bar];
			newNoteBar.name = '' + bar;
		}
	},

	onKeyDown: function onKeyDown(event) {
		if (event.keyCode == cc.macro.KEY.escape) {
			this.gamePauseOrResume(); //暂停或恢复
		}
	},

	start: function start() {},
	update: function update(dt) {
		if (window.Global.gameState === 'playing') {
			if (window.Global.musicDuration - window.Global.timePassed < 0.2) {
				window.Global.gameState = 'finish';
				var self = this;
				var finishPanel = this.node.getChildByName('finishPanel');
				setTimeout(function () {
					finishPanel.getChildByName('perfectCount').getComponent(cc.Label).string = 'Perfect：' + window.Global.perfectCount;
					finishPanel.getChildByName('greatCount').getComponent(cc.Label).string = 'Great：' + window.Global.greatCount;
					finishPanel.getChildByName('goodCount').getComponent(cc.Label).string = 'Good：' + window.Global.goodCount;
					finishPanel.getChildByName('badCount').getComponent(cc.Label).string = 'Bad：' + window.Global.badCount;
					finishPanel.getChildByName('missCount').getComponent(cc.Label).string = 'Miss：' + window.Global.missCount;
					finishPanel.getChildByName('maxCombo').getComponent(cc.Label).string = 'MaxCombo：' + window.Global.maxCombo;
					finishPanel.setPosition(cc.v2(0, 0));
				}, 3000);
			}
			window.Global.timePassed = this.getComponent(cc.AudioSource).getCurrentTime(); //记录音乐播放的时间	
			//miss信息三秒消失
			if (window.Global.lastNoteJudgement === 'miss') {
				window.Global.timer += dt;
			} else {
				window.Global.timer = 0;
			}
			if (window.Global.timer > 3) {
				this.node.getChildByName('comboLabel').getComponent(cc.Label).string = '';
			}
		}
	}
});

cc._RF.pop();