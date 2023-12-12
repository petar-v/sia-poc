import { SocketType } from "@/lib/socket";
import { AppStore } from "./store";
import {
    selectProjectPlan,
    setIssue,
    setProjectPlan,
} from "./store/projectSlice";
import { Issue, ProjectInfo, Task } from "@/lib/projectData";

export const hookUpSocketEventsToStore = (
    { dispatch, getState }: AppStore,
    socket: SocketType,
) => {
    socket.on("project-plan", (json: any) => {
        const state = getState();

        const projectPlan = selectProjectPlan(state);

        if (json.type === "Task") {
            const tasks = projectPlan?.tasks || [];
            dispatch(
                setProjectPlan({
                    ...projectPlan,
                    tasks: [...tasks, json as Task],
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
