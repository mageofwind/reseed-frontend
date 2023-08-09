import home_styles from "./home.module.scss"

export default function Home({ user, handlerNewProject }) {
    return (
        <div id={home_styles["whiteContainer"]}>
            <div>
                <h1>Welcome to ReSeed!</h1>
            </div>
            <hr />
        </div>
    )
}