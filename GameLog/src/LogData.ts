export default class LogData{
    public time:number;
    public gameVer:string;
    public code:string;
    public platform:string;
    public onlyId:string;
    public actionId:string;
    public content:string;
    public pName:string;

    constructor( str:string ) {
        let arr = str.split("\t");
        this.time = parseInt( arr[0]);
        this.gameVer = arr[1];
        this.code = arr[2];
        this.platform = arr[3];
        this.onlyId = arr[4];
        this.actionId = arr[5];
        this.content = arr[6];
        if( arr.length >= 8 ){
            this.pName = arr[7];
        }
    }

    public online():boolean{
        let a = Date.now();
        if( ( a - this.time ) < 5 * 60 * 1000 ){
            return true;
        }
        return false;
    }
}