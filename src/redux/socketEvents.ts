import { SocketType } from "@/lib/socket";
import { AppStore } from "./store";
import {
    selectProjectPlan,
    setAwaitingProjectPlan,
    setIssue,
    setProjectPlan,
} from "./store/projectSlice";
import { Issue, ProjectInfo, Task } from "@/lib/projectData";

export const hookUpSocketEventsToStore = (
    { dispatch, getState }: AppStore,
    socket: SocketType,
) => {
    socket.on("done", (process: string) => {
        if (process === "project-plan") {
            dispatch(setAwaitingProjectPlan(false));
        }
    });
    socket.on("project-plan", (json: any) => {
        const state = getState();
        const projectPlan = selectProjectPlan(state) || {
            tasks: [],
        };

        if (json.type === "Task") {
            dispatch(
                setProjectPlan({
                    ...projectPlan,
                    tasks: [...projectPlan.tasks, json as Task],
                }),
            );
        } else if (json.type === "Issue") {
            dispatch(setIssue(json as Issue));
        } else {
            dispatch(
                setProjectPlan({
                    ...projectPlan,
                    info: json as ProjectInfo,
                }),
            );
        }
    });
};
