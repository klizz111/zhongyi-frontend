import { Box, Paper, Stack, Title, Image } from "@mantine/core";
import ReactMarkdown from "react-markdown";

interface MarkdownResultProps {
  title: string;
  content: string;
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
  reference?: React.RefObject<HTMLDivElement>;
}

export function MarkdownResult({
  title,
  content,
  imageSrc,
  imageAlt = "图片",
  imageCaption,
  reference,
}: MarkdownResultProps) {
  return (
    <Paper ref={reference} shadow="sm" padding="xl" withBorder>
      <Stack spacing={20}>
        <Title order={3}>{title}</Title>

        {imageSrc && (
          <Box sx={{ maxWidth: 500, margin: "0 auto" }}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              radius="md"
              caption={imageCaption || imageAlt}
            />
          </Box>
        )}

        <Box
          sx={{
            padding: "20px",
            backgroundColor: "transparent",
            borderRadius: "8px",
            "& img": { maxWidth: "100%" },
          }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
      </Stack>
    </Paper>
  );
}
