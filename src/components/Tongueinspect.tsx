import { useState, useEffect, useRef } from "react";
import {
  Image,
  Paper,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Box,
  Loader,
  FileInput,
} from "@mantine/core";
import ReactMarkdown from "react-markdown";

const LOCAL_IMG_PATH = "localImg";
const TONGUE_RESPONSE_KEY = "tongueResponseData";

export function Tongueinspect() {
  const resultRef = useRef<HTMLDivElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string>(() => {
    return localStorage.getItem(LOCAL_IMG_PATH) || "";
  });
  const [response, setResponse] = useState<string>(
    localStorage.getItem(TONGUE_RESPONSE_KEY) || ""
  );

  // 图片预览处理
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // 当图片path保存到localStorage
  useEffect(() => {
    if (imagePath) {
      localStorage.setItem(LOCAL_IMG_PATH, imagePath);
    }
  }, [imagePath]);

  // 当收到响应时滚动到诊断结果
  useEffect(() => {
    if (response && resultRef.current) {
      localStorage.setItem(TONGUE_RESPONSE_KEY, response);
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setResponse("");

    if (!imageFile) {
      setError("请先上传舌苔照片");
      return;
    }

    setLoading(true);

    try {
      // 创建表单数据
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("/api/tongue-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("舌苔图像分析失败");
      }

      // 假设API返回JSON格式为 { "response": string }
      const data = await response.json();
      if (data.response) {
        setSuccess("舌苔分析成功！");
        setResponse(data.response);
        setImagePath(imagePreview || "");
      } else {
        throw new Error("返回数据格式错误");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生错误");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setImagePath("");
    setResponse("");
    setError(null);
    setSuccess(null);
    localStorage.removeItem(LOCAL_IMG_PATH);
    localStorage.removeItem(TONGUE_RESPONSE_KEY);
  };

  return (
    <Stack spacing={30}>
      <Paper shadow="sm" padding="xl" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack spacing={20}>
            <Title order={2} style={{ textAlign: "center" }}>
              舌苔分析
            </Title>

            <FileInput
              required
              label="上传舌苔照片"
              accept="image/png,image/jpeg,image/jpg"
              value={imageFile}
              onChange={setImageFile}
            />

            {imagePreview && (
              <Box sx={{ maxWidth: 500, margin: "0 auto" }}>
                <Image
                  src={imagePreview}
                  alt="舌苔照片预览"
                  radius="md"
                  caption="舌苔照片预览"
                />
              </Box>
            )}

            {error && <Text color="red">{error}</Text>}
            {success && <Text color="green">{success}</Text>}

            <Group position="apart">
              <Button type="submit" loading={loading} disabled={!imageFile}>
                分析舌苔
              </Button>
              <Button
                variant="outline"
                color="gray"
                onClick={clearForm}
                disabled={loading}
              >
                清空
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      {/* 只有存在上次的缓存响应且当前没有新响应时才显示上次诊断结果 */}
      {localStorage.getItem(TONGUE_RESPONSE_KEY) &&
        !loading &&
        !response &&
        localStorage.getItem(LOCAL_IMG_PATH) && (
          <Paper shadow="sm" padding="xl" withBorder>
            <Stack spacing={20}>
              <Title order={3}>上次舌苔分析结果</Title>

              <Box sx={{ maxWidth: 500, margin: "0 auto" }}>
                <Image
                  src={localStorage.getItem(LOCAL_IMG_PATH) || ""}
                  alt="上次舌苔照片"
                  radius="md"
                  caption="上次舌苔照片"
                />
              </Box>

              <Box
                sx={{
                  padding: "20px",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  "& img": { maxWidth: "100%" },
                }}
              >
                <ReactMarkdown>
                  {localStorage.getItem(TONGUE_RESPONSE_KEY) || ""}
                </ReactMarkdown>
              </Box>
            </Stack>
          </Paper>
        )}

      {/* 显示返回的markdown内容 */}
      {(loading || response) && (
        <Paper ref={resultRef} shadow="sm" padding="xl" withBorder>
          <Stack spacing={20}>
            <Title order={3}>舌苔分析结果</Title>

            {imagePreview && !loading && (
              <Box sx={{ maxWidth: 500, margin: "0 auto" }}>
                <Image
                  src={imagePreview}
                  alt="舌苔照片"
                  radius="md"
                  caption="舌苔照片"
                />
              </Box>
            )}

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <Loader />
              </Box>
            ) : (
              <Box
                sx={{
                  padding: "20px",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  "& img": { maxWidth: "100%" },
                }}
              >
                <ReactMarkdown>{response}</ReactMarkdown>
              </Box>
            )}
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
