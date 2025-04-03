import { Stack, Header, Group, Text, Button, TextInput, ActionIcon, Divider, Box, Container } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconSearch, IconUser, IconMessage } from '@tabler/icons-react';

function NavigationBar() {
  const navItems = [
    "关于我们", "莞香文化", "用户社区", "产品商城", 
    "体验活动", "校园合作", "联系我们", "文化探索"
  ];

  return (
    <Header height={60} p="xs">
      <Container size="xl">
        <Group position="apart">
          <Text weight={700} size="lg">莞香文化</Text>
          
          <Group spacing="md">
            {navItems.map((item, index) => (
              <Button key={index} variant="subtle" compact>{item}</Button>
            ))}
          </Group>
          
          <Group>
            <TextInput
              placeholder="搜索"
              icon={<IconSearch size={16} />}
              size="xs"
            />
            <Button leftIcon={<IconUser size={16} />} variant="outline" size="xs">
              登录/注册
            </Button>
            <ActionIcon variant="filled" color="blue" title="在线客服">
              <IconMessage size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </Header>
  );
}

function Home() {
    useEffect(() => {
        document.title = "首页";
    }, []);
    
    return (
        <>
            <NavigationBar />
            <Stack spacing="md" mt="md">
                <Container size="xl">
                    <Text align="center" size="xl" weight={700} mb="md">欢迎来到莞香文化网站</Text>
                    <Text align="center" color="dimmed">发现传统文化的魅力</Text>
                    
                    {/* 这里可以添加更多内容块 */}
                </Container>
            </Stack>
        </>
    );
}

export default Home;