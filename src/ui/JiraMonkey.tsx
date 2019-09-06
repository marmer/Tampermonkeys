import React, {useState} from 'react';
import "./JiraMonkey.css"
import TabPannel from "./TabPannel";
import WorklogSummarizerView from "./WorklogSummarizerView";
// TODO: marmer 05.09.2019 make the component refresh/reload if the "site changes" (the site content gets replaced by jira)
export default (): React.ReactElement => {
    const [state, setState] = useState({
        toolsVisible: false
    });

    return <div>
        <input id="JiraMonkeyToggle" type="checkbox"
               checked={state.toolsVisible}
               onClick={() => setState({toolsVisible: !state.toolsVisible})}
               title="Jira Monkeys"/>
        {state.toolsVisible &&
        <div id="JiraMonkeyContainer">
            <TabPannel>
                {{
                    title: "Summarized Worklogs",
                    pane: <WorklogSummarizerView/>
                }}
                {{
                    title: "Dummy Component",
                    pane: <div>Just a Dummy</div>
                }}
            </TabPannel>
        </div>
        }
    </div>
}


// #### update ticket estimations
// fetch("***/rest/api/2/issue/***", {
//     "method": "PUT",
//     "headers": {
//         "content-type": "application/json",
//         "accept": "application/json"
//     },
//     "body": {
//         "fields": {
//             "timetracking": {
//                 "originalEstimate": "2d",
//                 "remainingEstimate": "3h"
//             }
//         }
//     }
// })

// #### create a new worklog
// fetch("https://jira.schuetze.ag/rest/api/2/issue/****/worklog", {
//     "method": "POST",
//     "headers": {
//         "content-type": "application/json",
//         "accept": "application/json"
//     },
//     "body": {
//         "comment": "Somethign really new",
//         "timeSpent": "2d 1h 10m"
//     }
// })


// #### Update/delete worklog
// fetch("https://jira.schuetze.ag/rest/api/2/issue/****/worklog/*****", {
//     "method": "PUT",
//     "headers": {
//         "content-type": "application/json",
//         "accept": "application/json",
//     },
//     "body": {
//         "comment": "Möp with update",
//         "timeSpent": "2d"
//     }
// })