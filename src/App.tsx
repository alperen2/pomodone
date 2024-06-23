import { TriangleRightIcon } from '@radix-ui/react-icons';
import { Container, Flex, Heading, IconButton, Section, } from '@radix-ui/themes';
import React, {  useEffect } from 'react';
import TaskList from './components/TaskList';
import './App.css'
import useTasksStore from './stores/TodoStore';
import { Toaster } from 'react-hot-toast';
import Timer from './components/Timer';


const App: React.FC = () => {

  const { tasks } = useTasksStore();

  useEffect(() => {
    window.localStorage.setItem('todo', JSON.stringify(tasks))
  }, [tasks])


  return (
    <>
      <Container className='h-screen'>
        <Section p={"5"}>
          <Flex gap={"5"} align={"center"}>
            <IconButton>
              <TriangleRightIcon width="18" height="18" />
            </IconButton>
            <Heading>Pomodone</Heading>
          </Flex>
        </Section>
        <Section>
          {/* {activeTask ? <Timer /> : <Heading className='flex justify-center'>Select a task to start timer </Heading>} */}
          <Timer />
        </Section>
        <Section>
          <TaskList />
        </Section>
      </Container>
      <Toaster />
    </>
  );
}

export default App;
