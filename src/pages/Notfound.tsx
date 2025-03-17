import { Button, Container, Group, Text, Title } from '@mantine/core';
import { useEffect } from 'react';
// 导入tailwind
import 'tailwindcss/tailwind.css';

export function NotFound() {
  useEffect(() => {
    document.title = "404 Not Found";
  }, []);

  function goHome() {
    window.location.href = '/';
  }

  return (
    <Container fluid className='p-0 m-0 w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white'>
      <div className='font-extrabold text-9xl text-purple-400 animate-pulse mb-4 select-none'>404</div>
      <Title className='text-3xl md:text-4xl font-bold mb-4 text-center text-gray-100'>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className='mb-8 max-w-md text-gray-300 px-4'>
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
        been moved to another URL.
      </Text>
      <Group align='center' className='space-x-4'>
        <Button
          variant="subtle"
          size="md"
          onClick={goHome}
          className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 border border-purple-400'
        >
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}