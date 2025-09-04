import Banner from "../../components/banner/banner";
import './home.scss'
import {globalVariables} from "../../config";

export function Home(){
    return (<>
        <Banner/>
        <div className={"logos-container"}>
            <a href={globalVariables.LINK_VIEW_1} target={"_blank"} className={"logo"}>
                <img src={"/resources/view-1.png"}/>
            </a>
            <a href={globalVariables.LINK_VIEW_2} target={"_blank"} className={"logo"}>
                <img src={"/resources/view-2.png"}/>
            </a>
            <a href={globalVariables.LINK_VIEW_3} target={"_blank"} className={"logo"}>
                <img src={"/resources/view-3.png"}/>
            </a>
            <a href={globalVariables.LINK_VIEW_4} target={"_blank"} className={"logo"}>
                <img src={"/resources/view-4.png"}/>
            </a>
        </div>
    </>)
}