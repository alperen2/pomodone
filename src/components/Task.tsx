import { FC } from "react";
import { Box, Checkbox, Flex, IconButton, Text, TextField, Popover, Badge } from "@radix-ui/themes";
import { ClockIcon, PlayIcon, TrashIcon } from "@radix-ui/react-icons";
import { ITask, TaskStatuses } from "../types/Todo";
import useTasksStore from "../stores/TodoStore";


interface TaskProps {
    task: ITask;
}

const Task: FC<TaskProps> = (props) => {
    const { updateTaskStatus, updateTask, removeTask } = useTasksStore()
    const onCheckedChange = (v: boolean) => updateTaskStatus(props.task.id, v ? TaskStatuses.done : TaskStatuses.waiting)

    return <Box className="justify-center border-2 p-2">
        <Flex justify={"between"}>
            <Text as="label" size="5" className="w-full px-3">
                <Flex gap="4" className={`${props.task.status === TaskStatuses.done ? 'line-through' : 'no-underline'}`}>
                    <Checkbox
                        onCheckedChange={onCheckedChange}
                        size={"3"}
                        defaultChecked={props.task.status === TaskStatuses.done}
                    />
                    <TextField.Root
                        className="w-full border-none outline-none focus:ring-0 ring-0"
                        defaultValue={props.task.task}
                        onBlur={(v) => {
                            if (v.currentTarget.value === props.task.task) return;
                            props.task.task = v.currentTarget.value;
                            updateTask(props.task)
                        }}
                    />
                </Flex>
            </Text>
            <Flex gap={"2"}>
                {props.task.status !== TaskStatuses.done && <PomodoroSetButton taskId={props.task.id} pomodoroCount={props.task.requiredCycles} />}
                {props.task.status !== TaskStatuses.done &&
                    <StartPomodoroButton
                        id={props.task.id}
                    />
                }
                <IconButton onClick={() => removeTask(props.task.id)}><TrashIcon /></IconButton>
            </Flex>
        </Flex>
    </Box>
}

export default Task;

interface StartPomodoroButtonProps {
    id: number;
}

const StartPomodoroButton: FC<StartPomodoroButtonProps> = (props) => {
    const { setActiveTask } = useTasksStore()
    const onClick = () => {
        setActiveTask(props.id)
    }

    return <IconButton onClick={onClick}>
        <PlayIcon />
    </IconButton>
}

interface PomodoroSetButtonProps {
    taskId: number;
    pomodoroCount: number;
}

const PomodoroSetButton: FC<PomodoroSetButtonProps> = (props) => {
    const { setTaksPomodoroCount, getTask} = useTasksStore();

    return <Popover.Root>
        <Popover.Trigger>
            <IconButton className="w-12">
                <Badge variant="solid" radius="none" >
                    {props.pomodoroCount}
                </Badge>
                <ClockIcon />
            </IconButton>
        </Popover.Trigger>
        <Popover.Content>
            <TextField.Root
                className="w-20"
                type="number"
                defaultValue={props.pomodoroCount}
                onBlur={
                    (v) => {
                        const value = parseInt(v.target.value);
                        if (value === getTask(props.taskId)?.requiredCycles) return;
                        setTaksPomodoroCount(props.taskId, value)
                    }}
            >
                <TextField.Slot>Count</TextField.Slot>
            </TextField.Root>
        </Popover.Content>
    </Popover.Root>
}
