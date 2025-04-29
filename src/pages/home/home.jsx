import Banner from "../../components/banner/banner";
import './home.scss'

export function Home(){
    return (<>
        <Banner/>
        <div className={"logos-container"}>
            <a href={"#"} target={"_blank"} className={"logo"}>
                <img src={"/resources/hisystems.png"}/>
            </a>
            <a href={"#"} target={"_blank"} className={"logo"}>
                <img src={"/resources/ivao.png"}/>
            </a>
            <a href={"#"} target={"_blank"} className={"logo"}>
                <img src={"/resources/ivao.png"}/>
            </a>
            <a href={"#"} target={"_blank"} className={"logo"}>
                <img src={"/resources/ivao.png"}/>
            </a>
        </div>
    </>)
}