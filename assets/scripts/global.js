window.Global = {
	gameSpeed:800,//note速度
	offset:0
	,//note偏移单位为秒
	
	keySetting:['D','F','J','K'],
	
	timer:0,//用于miss提示清零
	
	musicDuration:0,//歌曲长度
	
	gameState:'manu',
	timePassed:0,
	lastNoteJudgement:'',
	combo:0,
	//判定区间 提前或者滞后n秒都在区间内，单位是秒方便与update中的dt单位统一
	perfectTime:0.02,
	greatTime:0.05,
	goodTime:0.09,
	badTime:0.11,
	missTime:0.11,
	
	//判定计数，用于统计
	perfectCount:0,
	greatCount:0,
	goodCount:0,
	badCount:0,
	missCount:0,
	maxCombo:0
}