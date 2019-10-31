import GameConfig from "./GameConfig";
import LogData from "./LogData";
import { ui } from "./ui/layaMaxUI";
import MyData from "./MyData";
import ListCell from "./ListCell";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
		
		if( Laya.Browser.onPC == false ){
			Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
		}else{
			Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
		}

		Laya.stage.alignH = "center";

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
		this.nameMap["VZGU"] = "胡老总";
		this.nameMap["igoY"] = "刘跃进";
		this.nameMap["o2X0"] = "达叔";
	}

	public nameMap:any = {};

	public onlyMap:object = {};

	public useMap:object = {};

	onConfigLoaded(): void {
		this.onlyMap["1"] = {};
		this.onlyMap["11"] = {};

		this.useMap["20"] = {};

		//加载IDE指定的场景
		// Laya.Scene.open( "MainScene.scene" , false , null, new Laya.Handler(this,this.comFun)  );

		this.logTypeMap[1001] = "打开游戏";
		this.logTypeMap[1002] = "打开钥匙不足界面";
		this.logTypeMap[1003] = "关闭钥匙不足界面";
		this.logTypeMap[1004] = "打开跳过界面";
		this.logTypeMap[1005] = "关闭跳过界面";
		this.logTypeMap[1006] = "获得钥匙总量";
		this.logTypeMap[1007] = "消耗钥匙总量";
		this.logTypeMap[1008] = "播放激励视频";
		this.logTypeMap[1009] = "播放激励视频完成";
		this.logTypeMap[1010] = "播放钥匙不足激励视频";
		this.logTypeMap[1011] = "播放钥匙不足激励视频完成";
		this.logTypeMap[1012] = "播放跳过激励视频";
		this.logTypeMap[1013] = "播放跳过激励视频完成";
		this.logTypeMap[1014] = "打开胜利界面";
		this.logTypeMap[1015] = "关闭胜利界面";
		this.logTypeMap[1016] = "胜利界面激励视频";
		this.logTypeMap[1017] = "胜利界面激励视频完成";
		this.logTypeMap[1018] = "分享";

		
		for(let i = 1; i <= 50;i++)
		{
			this.logTypeMap[2000 + i] = "开始第" + i + "关";
			this.logTypeMap[3000 + i] = "结束第" + i + "关";
		}

		this.allMap = {};
		let key:string;
		for(key in this.logTypeMap)
		{
			let myData:MyData = new MyData();
			myData.id = key;
			myData.content = this.logTypeMap[key];
			myData.count = 0;
			this.allMap[key] = myData;
		}

		this.comFun();
	}

	public main:ui.MainSceneUI = null;

	public comFun():void{
		this.main = new ui.MainSceneUI();
		Laya.stage.addChild(this.main);
		this.main.selectBtn.clickHandler = new Laya.Handler( this,this.selectFun );
		this.main.input.text = this.getNowString();

		this.list = new Laya.List();
        this.list.pos(this.main.box.x,this.main.box.y);
        this.main.addChild(this.list);
        this.list.itemRender = ListCell;
        this.list.repeatX = 1;
        this.list.repeatY = 40;
        this.list.vScrollBarSkin = "";
		this.list.renderHandler = new Laya.Handler(this, this.updateItem);
		this.list.array = [];
		this.list.width = 750;
	}

	private updateItem(cell: ListCell, index: number):void
	{
		let data:MyData = this.list.getItem(index);
		cell.update( data );
	}

	private list:Laya.List;

	public getName( s:string ):string{
		for ( let i in this.nameMap ){
			if( s.substr( s.length - 4  ) == i ){
				return this.nameMap[i];
			}
		}
		return this.pNameMap[s];
	}

	selectFun():void{
		this.loadByDate( this.main.input.text );
	}

	loadNow():void {
		this.loadByDate( this.getNowString() );
	}

	public getNowString():string{
		var d:Date = new Date();
		var y:number = d.getFullYear();
		var m:number = d.getMonth() + 1;
		var day:number = d.getDate();
		var str:string = this.v(y) + "-" + this.v(m) + "-" + this.v(day);
		return str;
	}

	private loadByDate( str:string ):void{
		// this.main.txt2.text = ""; 
		let url:string = "";
		if( this.main.cb1.selectedIndex == 0 ){
			url = "https://s1.kuwan511.com";
		}else if( this.main.cb1.selectedIndex == 1 ){
			url = "https://s1.kuwan511.com";
		}
		Laya.loader.load( url + "/gamex3." + str + ".log?ver=" + Math.random() ,new Laya.Handler(this,this.txtCom) , null, Laya.Loader.TEXT , 1, false, "" , true  );		
	}

	public v(a:number):String {
		return (a<10)?("0" + a):(a + "");
	}

	public logArr:Array<LogData> = [];
	public logTypeMap:any = {};
	public pNameMap:any = {};

	private allMap:any = {};

	public txtCom( text:String ):void {
		this.logArr.length = 0;

		let key:string;
		for(key in this.allMap)
		{
			let myData:MyData = this.allMap[key];
			myData.count = 0;
		}

		let arr = text.split("\n");
		for( let i of arr  ){
			let log = new LogData(i);

			let myData:MyData = this.allMap[log.actionId];
			if(myData)
			{
				myData.count++;
			}
		}
		this.showResult();
	}

	private showResult():void
	{
		let key:string;
		let arr = [];
		for(key in this.allMap)
		{
			let myData:MyData = this.allMap[key];
			arr.push(myData);
		}
		this.list.array = arr;
	}
}
//激活启动类
new Main();