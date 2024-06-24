import { Box, Flex, Heading, IconButton } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import useTasksStore from "../stores/TodoStore";
import { TaskStatuses } from "../types/Todo";
import Task from "./Task";

const TaskList = () => {
    const { tasks, addTask } = useTasksStore()

    const onClickAddTaskButton = () => {
        addTask({
            id: tasks.length + 1,
            task: "You can edit this title",
            status: TaskStatuses.waiting,
            requiredCycles: 1
        })
    }

    return <Box>
        <Flex justify={"center"}>
            <IconButton onClick={onClickAddTaskButton}>
                <PlusIcon width="24" height="24" />
            </IconButton>
        </Flex>
        <Flex direction={"column"} gap={"4"} p={"4"}>
            {
                tasks.length > 0 ? tasks
                    .sort(
                        (a) =>
                            a.status === TaskStatuses.inprogress ? -1 : (a.status === TaskStatuses.waiting ? -1 : 1))
                    .map(
                        (task, i) =>
                            <Task
                                key={i}
                                task={task}
                            />
                    ) : <Box className="flex justify-center">
                    <Heading>Start by clicking plus button</Heading>
                </Box>
            }
        </Flex>
    </Box>
}
export default TaskList;