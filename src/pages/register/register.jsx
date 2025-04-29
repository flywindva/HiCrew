import './register.scss'
import {Form, Link} from "react-router-dom";
export function Register() {
    return(<>
        <div class="container-register">
            <div class="div-img"><img src={"resources/background-banner.png"} alt={"Image Register"}/></div>
            <div class="div-form">
                <h1>Say hi!</h1>
                <h3>to your new adventure</h3>

                <p><Link to={"/login"}>Have an account? Log in Here </Link> </p>
            </div>
        </div>
    </>)
}