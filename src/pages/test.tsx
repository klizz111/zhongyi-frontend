import { Helmet } from "react-helmet-async";
import { Paper, Stack, Title, Text } from "@mantine/core";

export default function TestPage() {
  return (
    <>
      <Helmet>
        <title>测试页面</title>
      </Helmet>

      <Paper shadow="sm" p="xl" withBorder>
        <Stack spacing="md">
          <Title order={1}>测试页面</Title>
          <Text>这是一个测试页面，用于演示路由功能。</Text>
        </Stack>
      </Paper>
    </>
  );
}
