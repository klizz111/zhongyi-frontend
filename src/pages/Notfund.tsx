import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Paper, Stack, Title } from "@mantine/core";
import "tailwindcss/tailwind.css";

export function NotFund() {
    return (
        <>
            <Helmet>
                <title>404 - 页面不存在</title>
            </Helmet>
            <Stack spacing={30}>
                <Paper shadow="sm" padding="xl" withBorder>
                    <Title order={2} style={{ textAlign: "center" }} className="text-red-500">
                        {""}
                        404 Not Found
                    </Title>
                </Paper>
            </Stack>
        </>
    );
}