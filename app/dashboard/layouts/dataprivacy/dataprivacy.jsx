import data_styles from "./dataprivacy.module.scss"

export default function DataPrivacy() {
    return (
        <div id={data_styles["whiteContainer"]}>
            <h1>Data Privacy</h1>
            <hr />
            <div>
                <h3>Privacy</h3>
                <p>By toggling this you can make your profile private. By default it is public.</p>
                <label htmlFor=""><input type="checkbox" name="" id="" />Public</label>
            </div>
            <hr />
            <div>
                <h3>Delete all data</h3>
                <p>This will cancel your subscription and permanently remove all identifying information from our systems, including the following:</p>
                <ul>
                    <li>Payment method(s)</li>
                    <li>Carbon footprint responses</li>
                    <li>Name and email</li>
                    <li>Password</li>
                    <button>Delete Account</button>
                </ul>
            </div>
        </div>
    )
}