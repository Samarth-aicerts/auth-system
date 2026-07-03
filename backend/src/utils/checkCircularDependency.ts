import Task from "../models/Task";

export const checkCircularDependency = async (
    taskId: string,
    dependencyId: string
): Promise<boolean> => {

    if (taskId === dependencyId) {
        return true;
    }

    const dependencyTask =
        await Task.findById(dependencyId);

    if (!dependencyTask) {
        return false;
    }

    for (const dependency of dependencyTask.dependencies ?? []) {

        const hasCycle =
            await checkCircularDependency(
                taskId,
                dependency.toString()
            );

        if (hasCycle) {
            return true;
        }
    }
        
    return false;
};

