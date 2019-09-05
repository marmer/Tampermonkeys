import React, {Component} from 'react';
import WorklogService, {Worklog} from "../core/WorklogService";
import jiraFormat from "../core/jiraFormat";

interface WorklogSummarizerViewState {
    loadingState: "LOADING" | "DONE" | "ERROR",
    worklogs: Worklog[]
}


export interface WorklogSummarizerViewProps {

}

export default class WorklogSummarizerView extends Component<WorklogSummarizerViewProps, WorklogSummarizerViewState> {

    constructor(props: Readonly<WorklogSummarizerViewProps>) {
        super(props);
        this.state = {
            loadingState: "LOADING",
            worklogs: []
        };

        this.loadSummedBookings();
    }

    render(): React.ReactElement {
        switch (this.state.loadingState) {
            case "ERROR":
                return <div>Error. You could try to reaload</div>;
            case "LOADING":
                return <div>Loading. Be patient</div>
            case "DONE":
                return <div>
                    <h1 className="aui-nav-link aui-dropdown2-trigger aui-dropdown2-ajax">
                        Worklogs summarized per User
                    </h1>
                    <table>
                        <thead>
                        <tr>
                            <th>display name</th>
                            <th>time spent</th>
                        </tr>
                        </thead>
                        {this.state.worklogs.map(worklog =>
                            <tr key={worklog.author.displayName}>
                                <td>{worklog.author.displayName}</td>
                                <td>{jiraFormat(worklog.timeSpentInMinutes)}</td>
                            </tr>)}
                    </table>
                </div>
        }

    }

    private loadSummedBookings() {
        this.setState({
            loadingState: "LOADING",
            worklogs: []
        });
        WorklogService.getSummedWorklogsByUser()
            .then(worklogs => this.setState({
                loadingState: "DONE",
                worklogs: worklogs
            }))
            .catch(reason => {
                this.setState({loadingState: "ERROR"})
                return console.error(reason);
            })
    }

}
