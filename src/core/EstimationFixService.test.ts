import EstimationCrudService, {Estimation} from "./EstimationCrudService";
import EstimationFixService from "./EstimationFixService";
import JiraTimeService from "./JiraTimeService";

describe("EstimationFixService", () => {
    const minutesToJiraFormat = (minutes: number) => minutes + "m";

    JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(minutesToJiraFormat);

    describe("fixEstimationForIssue", () => {

        const baseEstimation: Estimation = {
            issueSummary: "some Summary",
            issueKey: "ISSUE-1234",
        };

        ([
            {
                description: "too much remaining",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(5),
                    remainingEstimateInMinutes: 5,
                    timeSpent: "8m",
                    timeSpentMinutes: 8,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(2),
                    remainingEstimateInMinutes: 2,
                    timeSpent: "8m",
                    timeSpentMinutes: 8,
                },
            }, {
                description: "not enough remaining",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(5),
                    remainingEstimateInMinutes: 5,
                    timeSpent: "2m",
                    timeSpentMinutes: 2,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(8),
                    remainingEstimateInMinutes: 8,
                    timeSpent: "2m",
                    timeSpentMinutes: 2,
                },
            }, {
                description: "undefined remaining",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: undefined,
                    remainingEstimateInMinutes: undefined,
                    timeSpent: "2m",
                    timeSpentMinutes: 2,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(8),
                    remainingEstimateInMinutes: 8,
                    timeSpent: "2m",
                    timeSpentMinutes: 2,
                },
            }, {
                description: "undefined timespent",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(3),
                    remainingEstimateInMinutes: 3,
                    timeSpent: undefined,
                    timeSpentMinutes: undefined,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(10),
                    remainingEstimateInMinutes: 10,
                    timeSpent: undefined,
                    timeSpentMinutes: undefined,
                },
            }, {
                description: "undefined original",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: undefined,
                    originalEstimateInMinutes: undefined,
                    remainingEstimate: minutesToJiraFormat(3),
                    remainingEstimateInMinutes: 3,
                    timeSpent: minutesToJiraFormat(2),
                    timeSpentMinutes: 2,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: undefined,
                    originalEstimateInMinutes: undefined,
                    remainingEstimate: minutesToJiraFormat(0),
                    remainingEstimateInMinutes: 0,
                    timeSpent: minutesToJiraFormat(2),
                    timeSpentMinutes: 2,
                },
            },
        ] as Array<{ description: string, estimationToFix: Estimation, fixedEstimation: Estimation }>)
            .map(({description, estimationToFix, fixedEstimation}) => {
                it("should shift estimation when there is " + description, async () => {
                    EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                        async issueKey => {
                            if (issueKey !== estimationToFix.issueKey) {
                                fail("Unexpected issue to load: " + issueKey);
                            }
                            return estimationToFix;
                        },
                    );
                    EstimationCrudService.updateEstimation = jest.fn();
                    await EstimationFixService.fixEstimationForIssue(estimationToFix.issueKey);

                    expect(EstimationCrudService.updateEstimation).toBeCalledWith(fixedEstimation);
                });
            });
        // TODO: marmer 27.09.2019 add negative cases (not able to load)
        // TODO: marmer 27.09.2019 add negative cases (not able to write)
        // TODO: marmer 27.09.2019 add tests with nothing todo
    });
});
