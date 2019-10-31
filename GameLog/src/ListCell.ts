import { ui } from "./ui/layaMaxUI";
import MyData from "./MyData";

export default class ListCell extends ui.txtCellUI{
    constructor() { super(); }

    update(data:MyData):void
    {
        this.idTxt.text = data.id;
        this.strTxt.text = data.content;
        this.countTxt.text = data.count + "";
    }

}