cc.Class({
    extends: cc.Component,

    properties: {
		arriveTime:0
    },

    start () {

    },

	miss:function(){
		window.Global.lastNoteJudgement = 'miss';
		window.Global.missCount++;
		window.Global.combo=0;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Miss';
		window.Global.timer = 0;
	},
	
	bad:function(){
		window.Global.lastNoteJudgement = 'bad';
		window.Global.badCount++;
		window.Global.combo=0;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Bad';
	},
	
	good:function(){
		window.Global.lastNoteJudgement = 'good';
		window.Global.goodCount++;
		window.Global.combo=0;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Good';
	},
	
	great:function(){
		window.Global.lastNoteJudgement = 'great';	
		window.Global.greatCount++;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Great: '+(++window.Global.combo);
		if(window.Global.combo>window.Global.maxCombo)window.Global.maxCombo = window.Global.combo;
	},
	
	perfect:function(){
		window.Global.lastNoteJudgement = 'perfect';
		window.Global.perfectCount++;
		this.node.destroy();
		cc.find("Canvas/comboLabel").getComponent(cc.Label).string = 'Perfect: '+(++window.Global.combo);
		if(window.Global.combo>window.Global.maxCombo)window.Global.maxCombo = window.Global.combo;
	},

    update (dt) {
		if(window.Global.gameState === 'playing')
		{
			this.node.y -= dt* window.Global.gameSpeed;
		}
	},
});
