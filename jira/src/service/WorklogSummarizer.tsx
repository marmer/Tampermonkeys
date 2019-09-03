import * as ReactDOM from "react-dom";
import * as React from "react";

export default class WorklogSummarizer {
    register() {
        // TODO: marmer 02.09.2019 Read /projects/ISBJRD/repos/isbj-redesign-frontend-components/browse/src/Modal/FocusCapture.ts for MutationCallbacks to get out whether my injected elements are gone

        console.log("#Worklog Summerizer started to register")

        const issueTabContainer = document.getElementById("issue-tabs");

        performFancyFetch();

        if (!issueTabContainer) {
            console.error("No element found with id: issue-tabs");
            return;
        }
        document.querySelectorAll("#issue-tabs>li").forEach(issueTab => console.log("####" + issueTab.id));

        let customElement = document.createElement("li");
        customElement.id = "customContainer";
        customElement.setAttribute("exists", "true")
        customElement.classList.add("menu-item");
        customElement.classList.add("active-tab");
        // TODO: marmer 01.09.2019 add focus, blur and clicklistener
        // TODO: marmer 01.09.2019 find and add "hover" class/functionality
        customElement.id = "summarizer-tab";

        new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    console.log("####################################### ");
                    console.log("### type:" + mutation.type);
                    const id = (mutation.target as any)["id"];
                    console.log("### ElementID " + id);
                    const elementById = document.getElementById(id);
                    console.log("### Existiert1: " + elementById);
                    if (elementById)
                        console.log("### Existiert2: " + elementById.getAttribute("exists"));

                    console.log("### Attribute Name: " + mutation.attributeName);
                    console.log("### Attribute oldValue: " + mutation.oldValue);
                    console.log("#######################################");
                })
            }
        ).observe(customElement, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: false
        });

        issueTabContainer.append(customElement);

        ReactDOM.render(<SomeNiceReactContainer/>, customElement);
    }

    private stringify(value: any) {
        return "{" + Object.keys(value).map(value1 => value1 + ": " + value[value1]).join(",\n") + "}";
        // return value && value.id ?
        //     value.id :
        //     JSON.stringify(Object.getOwnPropertyNames(value));
    }
}

const SomeNiceReactContainer = () => {
    return <a id="my-observable-element">Doc cakes</a>
};

function performFancyFetch() {
    fetch(window.location.origin + "/rest/api/2/issue/" + window.location.pathname.replace("/browse/", ""), {
        "method": "GET"
    })
        .then(response => {
            response.json().then(value => {
                console.log("############# " + value.key);
                console.log("############# " + value.fields.worklog.worklogs[0].timeSpentSeconds);
                console.log("############# " + value.fields.worklog.worklogs[0].author.displayName)
            });
        })
        .catch(err => {
            console.log("#### " + err);
        });
}
