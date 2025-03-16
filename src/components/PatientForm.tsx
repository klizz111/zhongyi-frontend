import { useState, useEffect, useRef } from "react";
import {
  TextInput,
  Select,
  Textarea,
  Button,
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Box,
  Loader,
} from "@mantine/core";
import ReactMarkdown from "react-markdown";

interface PatientData {
  name: string;
  age: string;
  gender: string;
  maritalStatus: string;
  condition: string;
  // tongue?: ImageData; // 舌苔照片
  medicalHistory: string;
  allergies: string;
}

const STORAGE_KEY = "patientFormData";
const RESONSE_STORRAGE_KEY = "responselocaldata";

export function PatientForm() {
  const resultRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<PatientData>(() => {
    // 从 localStorage 获取缓存的数据
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData
      ? JSON.parse(savedData)
      : {
        name: "",
        age: "",
        gender: "",
        maritalStatus: "",
        condition: "",
        //tongue: "",
        medicalHistory: "",
        allergies: "",
      };
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>(
    // 从 localStorage 获取缓存的响应
    localStorage.getItem(RESONSE_STORRAGE_KEY) || ""
  );

  // 当表单数据改变时保存到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // 当收到响应时滚动到诊断结果
  useEffect(() => {
    if (response && resultRef.current) {
      localStorage.setItem(RESONSE_STORRAGE_KEY, response);
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [response]);

  const formatPatientInfo = (data: PatientData): string => {
    const timestamp = new Date().toLocaleString("zh-CN");
    return `就诊时间：${timestamp}
姓名：${data.name}
年龄：${data.age}
性别：${data.gender}
婚姻状况：${data.maritalStatus}
病情描述：${data.condition}
${data.medicalHistory ? `既往病史：${data.medicalHistory}` : ""}
${data.allergies ? `过敏史：${data.allergies}` : ""}`;
  };

  const clearForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      maritalStatus: "",
      condition: "",
      medicalHistory: "",
      allergies: "",
    });
    localStorage.removeItem(STORAGE_KEY);
    setResponse(""); // 清空响应内容
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setResponse(""); // 清空之前的响应
    localStorage.removeItem(RESONSE_STORRAGE_KEY); // 清除上次缓存的响应

    // 验证必填字段
    if (
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !formData.maritalStatus ||
      !formData.condition
    ) {
      setError("请填写所有必填项");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "/api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: formatPatientInfo(formData),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("提交数据失败");
      }

      // 返回格式为 { "response": string }
      const data = await response.json();
      if (data.response) {
        setSuccess("信息提交成功！");
        setResponse(data.response);
      } else {
        throw new Error("返回数据格式错误");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={30}>
      <Paper shadow="sm" p="xl" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack spacing={20}>
            <Title order={2} style={{ textAlign: "center" }}>
              {" "}
              中医问诊表
            </Title>

            <TextInput
              required
              label="姓名"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="请输入您的姓名"
            />

            <TextInput
              required
              type="number"
              label="年龄"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              placeholder="请输入您的年龄"
            />

            <Select
              required
              label="性别"
              value={formData.gender}
              onChange={(value) =>
                setFormData({ ...formData, gender: value || "" })
              }
              data={[
                { value: "male", label: "男" },
                { value: "female", label: "女" },
                { value: "other", label: "其他" },
              ]}
              placeholder="请选择您的性别"
            />

            <Select
              required
              label="婚姻状况"
              value={formData.maritalStatus}
              onChange={(value) =>
                setFormData({ ...formData, maritalStatus: value || "" })
              }
              data={[
                { value: "single", label: "未婚" },
                { value: "married", label: "已婚" },
                { value: "divorced", label: "离异" },
                { value: "widowed", label: "丧偶" },
              ]}
              placeholder="请选择您的婚姻状况"
            />

            <Textarea
              required
              label="病情描述"
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              placeholder="请描述您当前的症状和病情"
              minRows={3}
            />

            <Textarea
              label="既往病史（选填）"
              value={formData.medicalHistory}
              onChange={(e) =>
                setFormData({ ...formData, medicalHistory: e.target.value })
              }
              placeholder="请输入您的既往病史（如有）"
              minRows={2}
            />

            <Textarea
              label="过敏史（选填）"
              value={formData.allergies}
              onChange={(e) =>
                setFormData({ ...formData, allergies: e.target.value })
              }
              placeholder="请输入您的过敏史（如有）"
              minRows={2}
            />

            {error && <Text color="red">{error}</Text>}
            {success && <Text color="green">{success}</Text>}

            <Group position="apart">
              <Button type="submit" loading={loading}>
                提交
              </Button>
              <Button
                variant="outline"
                color="gray"
                onClick={clearForm}
                disabled={loading}
              >
                清空表单
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      {/* 只有存在上次的缓存响应且当前没有新响应时才显示上次诊断结果 */}
      {localStorage.getItem(RESONSE_STORRAGE_KEY) && !loading && !response && (
        <Paper shadow="sm" p="xl" withBorder>
          <Stack spacing={20}>
            <Title order={3}>上次诊断结果</Title>
            <Box
              sx={{
                padding: "20px",
                backgroundColor: "transparent",
                borderRadius: "8px",
                "& img": { maxWidth: "100%" },
              }}
            >
              <ReactMarkdown>{localStorage.getItem(RESONSE_STORRAGE_KEY) || ""}</ReactMarkdown>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* 显示返回的markdown内容 */}
      {(loading || response) && (
        <Paper ref={resultRef} shadow="sm" p="xl" withBorder>
          <Stack spacing={20}>
            <Title order={3}>诊断结果</Title>
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
