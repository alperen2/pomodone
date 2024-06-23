import { Box, Button, Flex, Heading, IconButton, SegmentedControl, Text } from '@radix-ui/themes'
import useTasksStore from '../stores/TodoStore'
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import CircleProgressBar from './CircleProgressBar';
import usePomodoroTimer, { TimerPhase } from '../hooks/usePomodoroTimer';
import { useEffect, useState } from 'react';

const Timer = () => {
    const { activeTask } = useTasksStore();

    const { timeLeft, resume, start, status, stop, percentage, reset, updatePhase, phase, cycles } = usePomodoroTimer({
        workTime: 1 * 60 * 1000,  // 25 minutes
        shortBreakTime: 10 * 1000,  // 5 minutes
        longBreakTime: 2 * 60 * 1000,  // 15 minutes
        autoNextCycle: true,
        autoSwitch: true,
        cyclesBeforeLongBreak: 4,
        onTimerFinish: () => console.log('Pomodoro finished!')
    })

    const [currentPhase, setCurrentPhase] = useState(phase);

    useEffect(() => {
        setCurrentPhase(phase)
    }, [phase])
    
    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };


    return <Flex direction={'column'} align={"center"} className='py-20 '>
        <Box mb={"5"}>
            <SegmentedControl.Root value={currentPhase} onValueChange={(e: TimerPhase) => {
                updatePhase(e);
            }} defaultValue={currentPhase}>
                <SegmentedControl.Item value="work">Work time</SegmentedControl.Item>
                <SegmentedControl.Item value="shortBreak">Short Break</SegmentedControl.Item>
                <SegmentedControl.Item value="longBreak">Long Break</SegmentedControl.Item>
            </SegmentedControl.Root>
        </Box>
        <Box mb={"4"}>
            <Flex direction={"column"} gap={"3"} align={"center"}>
                <Heading size={"4"}>{activeTask?.task}</Heading>
            </Flex>
        </Box>
        <Box>
            <Flex direction={'column'} gap={"5"} align={"center"}>
                <CircleProgressBar percent={percentage} strokeWidth={30} size={200}>
                    <Flex align={"center"} direction={'column'} gap={"2"}>
                        {/* <Text className=' text-center text-[#b3b3b3] px-4 rounded-sm'>{activeTask ? "1 / 4" : `#${cycles}`}</Text> */}
                        {cycles > 0 && <Text className=' text-center text-[#b3b3b3] px-4 rounded-sm'>{`#${cycles}`}</Text>}
                        <Heading color='bronze'>{formatTime(timeLeft)}</Heading>
                        {
                            status === "running" ?
                                <IconButton onClick={stop}><PauseIcon /></IconButton> : (
                                    status === "paused" ? <IconButton onClick={resume}><PlayIcon /></IconButton>
                                        : <IconButton onClick={start}><PlayIcon /></IconButton>
                                )
                        }
                    </Flex>
                </CircleProgressBar>
                {/* <Flex gap={"6"}>
                    <Button onClick={start}>Start</Button>
                    <Button onClick={stop}>Pause</Button>
                    <Button onClick={resume}>Resume</Button>
                    <Button onClick={reset}>Reset</Button>
                </Flex> */}
            </Flex>
        </Box>
    </Flex>
}


export default Timer