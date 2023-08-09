import email_styles from "./email.module.scss"

export default function EmailSettings() {
    const CheckboxData = [
        {
            "title": "Project updates",
            "text": "Emails about ReSeed’s projects—including descriptions, status updates, goals and achievements, and information about the  ReSeed Climate Portfolio. We recommend you stay subscribed to this group, in case there are significant changes to the project(s) you support."
        },
        {
            "title": "Produc updates",
            "text": "Emails about  ReSeed, the product—including how to use the  ReSeed dashboard, feature overviews, and information about our services."
        },
        {
            "title": "Company updates",
            "text": "Emails about ReSeed, the company—including our approach, fundraising news, financial reports, growth milestones, and structural changes."
        },
        {
            "title": "Newsletters & Climate Offers",
            "text": "Emails about general content—including ways to reduce your carbon footprint, general climate news, and how to grow your positive impact with ReSeed."
        },
        {
            "title": "Go plant-based Series (Unsubscribed)",
            "text": "Daily meatless recipes and tips for how to transition to a full-time plant-based diet."
        },
        {
            "title": "Daily Climate Habit Series (Unsubscribed)",
            "text": "A 5 day long series with short daily challenges that will help you build up a climate habit."
        },
        {
            "title": "Unsubscribe All",
            "text": "Select this option to unsubscribe from all emails. You’ll still receive crucial transactional messages related to payment and other account information."
        }
    ]

    return (
        <div id={email_styles["whiteContainer"]}>
            <div id={email_styles["sec1"]}>
                <h1>Email Settings</h1>
                <div className={email_styles["sect_btn"]}>
                    <button className={email_styles["btn_save"]}>Save Settings</button>
                    <button className={email_styles["btn_cancel"]}>Cancel</button>
                </div>
            </div>
            <hr />
            <div id={email_styles["sec2"]}>
                <p>By default, you’re opted in to the following email groups. Uncheck any groups you’d like to unsubscribe from, and click “Save settings” afterward. For more on your email preferences, take a look at our Privacy Policy.</p>
                <h3>Settings for alex@secondcrew.com</h3>
                <ul id={email_styles["list"]}>
                    {
                        CheckboxData.map((obj, id) => (
                            <li key={id}>
                                <label htmlFor={`chkb-${id}`} className={email_styles["list_label"]}><input type="checkbox" name={obj.title} id={`chkb-${id}`} />{obj.title}</label>
                                <p className={email_styles["list_text"]}>{obj.text}</p>
                            </li>
                        ))
                    }
                </ul>
                <div className={email_styles["sect_btn"]}>
                    <button className={email_styles["btn_save"]}>Save Settings</button>
                    <button className={email_styles["btn_cancel"]}>Cancel</button>
                </div>
            </div>
        </div>
    )
}