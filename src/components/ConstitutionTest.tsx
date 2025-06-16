import { useState, useEffect, useRef } from "react";
import {
  Table,
  TextInput,
  Select,
  Button,
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Box,
  Loader,
  NumberInput,
  Progress,
  Card,
  Alert
} from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { Helmet } from 'react-helmet-async';

interface ConstitutionData {
  // 基本信息
  name: string;
  age: number | "";
  gender: string;
  height: number | "";
  weight: number | "";
  
  // 生活习惯
  sleepHours: string;
  exerciseFrequency: string;
  workStress: string;
  dietPreference: string;
  
  // 体质问题 (0-4分制评分)
  fatigue: number;           // 疲劳程度
  coldLimbs: number;         // 手脚冰冷
  heatIntolerance: number;   // 怕热程度
  coldIntolerance: number;   // 怕冷程度
  digestion: number;         // 消化问题
  sleep: number;             // 睡眠质量
  emotion: number;           // 情绪状态
  skinCondition: number;     // 皮肤状况
  breathing: number;         // 呼吸状况
  
  // 中医相关症状
  tongueColor: string;       // 舌质颜色
  tongueCoating: string;     // 舌苔情况
  pulse: string;             // 脉象
  
  // 其他症状
  otherSymptoms: string;
}

const STORAGE_KEY = "constitutionTestData";
const RESPONSE_STORAGE_KEY = "constitutionTestResponse";

// 根据环境确定 API 地址
const getApiUrl = () => {
  // 如果是生产环境（HTTPS），使用 HTTPS API
  if (window.location.protocol === 'https:') {
    return "https://hk.klizz.asia:7777/api"; // 需要后端支持 HTTPS
  }
  // 开发环境使用 HTTP
  return "http://hk.klizz.asia:7777/api";
};

export function ConstitutionTest() {
  useEffect(() => {
    document.title = "体质测试";
  }, []);

  const resultRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ConstitutionData>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {
      name: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      sleepHours: "",
      exerciseFrequency: "",
      workStress: "",
      dietPreference: "",
      fatigue: 0,
      coldLimbs: 0,
      heatIntolerance: 0,
      coldIntolerance: 0,
      digestion: 0,
      sleep: 0,
      emotion: 0,
      skinCondition: 0,
      breathing: 0,
      tongueColor: "",
      tongueCoating: "",
      pulse: "",
      otherSymptoms: ""
    };
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>(
    localStorage.getItem(RESPONSE_STORAGE_KEY) || ""
  );

  // 当表单数据改变时保存到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // 当收到响应时滚动到结果区域
  useEffect(() => {
    if (response && resultRef.current) {
      localStorage.setItem(RESPONSE_STORAGE_KEY, response);
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [response]);

  const formatConstitutionInfo = (data: ConstitutionData): string => {
    const timestamp = new Date().toLocaleString("zh-CN");
    const bmi = data.height && data.weight ? 
      (Number(data.weight) / Math.pow(Number(data.height) / 100, 2)).toFixed(1) : "未知";
    
    return `体质测试时间：${timestamp}

基本信息：
姓名：${data.name}
年龄：${data.age}岁
性别：${data.gender}
身高：${data.height}cm
体重：${data.weight}kg
BMI：${bmi}

生活习惯：
睡眠时间：${data.sleepHours}
运动频率：${data.exerciseFrequency}
工作压力：${data.workStress}
饮食偏好：${data.dietPreference}

体质症状评分（0-4分）：
疲劳程度：${data.fatigue}分
手脚冰冷：${data.coldLimbs}分
怕热程度：${data.heatIntolerance}分
怕冷程度：${data.coldIntolerance}分
消化问题：${data.digestion}分
睡眠质量：${data.sleep}分
情绪状态：${data.emotion}分
皮肤状况：${data.skinCondition}分
呼吸状况：${data.breathing}分

中医相关：
舌质颜色：${data.tongueColor}
舌苔情况：${data.tongueCoating}
脉象：${data.pulse}

其他症状：${data.otherSymptoms || "无"}`;
  };

  const clearForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      sleepHours: "",
      exerciseFrequency: "",
      workStress: "",
      dietPreference: "",
      fatigue: 0,
      coldLimbs: 0,
      heatIntolerance: 0,
      coldIntolerance: 0,
      digestion: 0,
      sleep: 0,
      emotion: 0,
      skinCondition: 0,
      breathing: 0,
      tongueColor: "",
      tongueCoating: "",
      pulse: "",
      otherSymptoms: ""
    });
    localStorage.removeItem(STORAGE_KEY);
    setResponse("");
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setResponse("");
    localStorage.removeItem(RESPONSE_STORAGE_KEY);

    // 验证必填字段
    if (!formData.name || !formData.age || !formData.gender || !formData.height || !formData.weight) {
      setError("请填写所有基本信息");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: formatConstitutionInfo(formData),
        }),
      });

      if (!response.ok) {
        throw new Error("提交数据失败");
      }

      const data = await response.json();
      if (data.response) {
        setSuccess("体质测试完成！");
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

  const getProgressValue = () => {
    return Math.round((currentStep / 4) * 100);
  };

  const symptomItems = [
    { key: 'fatigue', label: '疲劳程度', description: '容易疲倦、精力不足' },
    { key: 'coldLimbs', label: '手脚冰冷', description: '手脚经常感到寒冷' },
    { key: 'heatIntolerance', label: '怕热程度', description: '不耐受炎热环境' },
    { key: 'coldIntolerance', label: '怕冷程度', description: '不耐受寒冷环境' },
    { key: 'digestion', label: '消化问题', description: '腹胀、腹泻、便秘等' },
    { key: 'sleep', label: '睡眠质量', description: '失眠、多梦、易醒等' },
    { key: 'emotion', label: '情绪状态', description: '焦虑、抑郁、易怒等' },
    { key: 'skinCondition', label: '皮肤状况', description: '干燥、过敏、湿疹等' },
    { key: 'breathing', label: '呼吸状况', description: '气短、胸闷等' }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card withBorder p="md">
            <Title order={4} mb="md">基本信息</Title>
            <Table>
              <tbody>
                <tr>
                  <td width="120px"><Text weight={500}>姓名 *</Text></td>
                  <td>
                    <TextInput
                      placeholder="请输入您的姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>年龄 *</Text></td>
                  <td>
                    <NumberInput
                      placeholder="请输入年龄"
                      value={formData.age}
                      onChange={(value) => setFormData({ ...formData, age: value || "" })}
                      min={1}
                      max={120}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>性别 *</Text></td>
                  <td>
                    <Select
                      placeholder="请选择性别"
                      value={formData.gender}
                      onChange={(value) => setFormData({ ...formData, gender: value || "" })}
                      data={[
                        { value: "男", label: "男" },
                        { value: "女", label: "女" }
                      ]}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>身高 *</Text></td>
                  <td>
                    <NumberInput
                      placeholder="请输入身高(cm)"
                      value={formData.height}
                      onChange={(value) => setFormData({ ...formData, height: value || "" })}
                      min={100}
                      max={250}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>体重 *</Text></td>
                  <td>
                    <NumberInput
                      placeholder="请输入体重(kg)"
                      value={formData.weight}
                      onChange={(value) => setFormData({ ...formData, weight: value || "" })}
                      min={30}
                      max={200}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        );

      case 2:
        return (
          <Card withBorder p="md">
            <Title order={4} mb="md">生活习惯</Title>
            <Table>
              <tbody>
                <tr>
                  <td width="120px"><Text weight={500}>睡眠时间</Text></td>
                  <td>
                    <Select
                      placeholder="每天睡眠时间"
                      value={formData.sleepHours}
                      onChange={(value) => setFormData({ ...formData, sleepHours: value || "" })}
                      data={[
                        { value: "少于6小时", label: "少于6小时" },
                        { value: "6-7小时", label: "6-7小时" },
                        { value: "7-8小时", label: "7-8小时" },
                        { value: "8-9小时", label: "8-9小时" },
                        { value: "超过9小时", label: "超过9小时" }
                      ]}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>运动频率</Text></td>
                  <td>
                    <Select
                      placeholder="请选择运动频率"
                      value={formData.exerciseFrequency}
                      onChange={(value) => setFormData({ ...formData, exerciseFrequency: value || "" })}
                      data={[
                        { value: "几乎不运动", label: "几乎不运动" },
                        { value: "偶尔运动", label: "偶尔运动" },
                        { value: "每周1-2次", label: "每周1-2次" },
                        { value: "每周3-4次", label: "每周3-4次" },
                        { value: "每天运动", label: "每天运动" }
                      ]}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>工作压力</Text></td>
                  <td>
                    <Select
                      placeholder="请选择工作压力程度"
                      value={formData.workStress}
                      onChange={(value) => setFormData({ ...formData, workStress: value || "" })}
                      data={[
                        { value: "很轻松", label: "很轻松" },
                        { value: "一般", label: "一般" },
                        { value: "较大", label: "较大" },
                        { value: "很大", label: "很大" },
                        { value: "极大", label: "极大" }
                      ]}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>饮食偏好</Text></td>
                  <td>
                    <Select
                      placeholder="请选择饮食偏好"
                      value={formData.dietPreference}
                      onChange={(value) => setFormData({ ...formData, dietPreference: value || "" })}
                      data={[
                        { value: "偏爱热食", label: "偏爱热食" },
                        { value: "偏爱凉食", label: "偏爱凉食" },
                        { value: "重口味", label: "重口味" },
                        { value: "清淡", label: "清淡" },
                        { value: "均衡", label: "均衡" }
                      ]}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        );

      case 3:
        return (
          <Card withBorder p="md">
            <Title order={4} mb="md">体质症状评分</Title>
            <Text size="sm" color="dimmed" mb="md">
              请根据您的实际情况进行评分：0分=没有，1分=轻微，2分=一般，3分=明显，4分=严重
            </Text>
            <Table>
              <tbody>
                {symptomItems.map((item) => (
                  <tr key={item.key}>
                    <td width="120px">
                      <Box>
                        <Text weight={500}>{item.label}</Text>
                        <Text size="xs" color="dimmed">{item.description}</Text>
                      </Box>
                    </td>
                    <td>
                      <Group spacing="xs">
                        {[0, 1, 2, 3, 4].map((score) => (
                          <Button
                            key={score}
                            size="xs"
                            variant={formData[item.key as keyof ConstitutionData] === score ? "filled" : "outline"}
                            onClick={() => setFormData({ ...formData, [item.key]: score })}
                          >
                            {score}
                          </Button>
                        ))}
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        );

      case 4:
        return (
          <Card withBorder p="md">
            <Title order={4} mb="md">中医相关信息</Title>
            <Table>
              <tbody>
                <tr>
                  <td width="120px"><Text weight={500}>舌质颜色</Text></td>
                  <td>
                    <Select
                      placeholder="请选择舌质颜色"
                      value={formData.tongueColor}
                      onChange={(value) => setFormData({ ...formData, tongueColor: value || "" })}
                      data={[
                        { value: "淡红", label: "淡红" },
                        { value: "红", label: "红" },
                        { value: "深红", label: "深红" },
                        { value: "淡白", label: "淡白" },
                        { value: "紫红", label: "紫红" },
                        { value: "不清楚", label: "不清楚" }
                      ]}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>舌苔情况</Text></td>
                  <td>
                    <Select
                      placeholder="请选择舌苔情况"
                      value={formData.tongueCoating}
                      onChange={(value) => setFormData({ ...formData, tongueCoating: value || "" })}
                      data={[
                        { value: "薄白", label: "薄白" },
                        { value: "厚白", label: "厚白" },
                        { value: "薄黄", label: "薄黄" },
                        { value: "厚黄", label: "厚黄" },
                        { value: "无苔", label: "无苔" },
                        { value: "不清楚", label: "不清楚" }
                      ]}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>脉象</Text></td>
                  <td>
                    <Select
                      placeholder="请选择脉象特点"
                      value={formData.pulse}
                      onChange={(value) => setFormData({ ...formData, pulse: value || "" })}
                      data={[
                        { value: "平和", label: "平和" },
                        { value: "浮", label: "浮" },
                        { value: "沉", label: "沉" },
                        { value: "细", label: "细" },
                        { value: "数", label: "数（快）" },
                        { value: "迟", label: "迟（慢）" },
                        { value: "不清楚", label: "不清楚" }
                      ]}
                    />
                  </td>
                </tr>
                <tr>
                  <td><Text weight={500}>其他症状</Text></td>
                  <td>
                    <TextInput
                      placeholder="请描述其他不适症状（可选）"
                      value={formData.otherSymptoms}
                      onChange={(e) => setFormData({ ...formData, otherSymptoms: e.target.value })}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>体质测试</title>
      </Helmet>
      
      <Stack spacing={30}>
        <Paper shadow="sm" p="xl" withBorder>
          <Stack spacing={20}>
            <Title order={2} style={{ textAlign: "center" }}>
              中医体质测试
            </Title>
            
            <Text size="sm" color="dimmed" style={{ textAlign: "center" }}>
              通过科学的体质评估，为您提供个性化的养生建议
            </Text>

            {/* 进度条 */}
            <Box>
              <Group position="apart" mb="xs">
                <Text size="sm" weight={500}>测试进度</Text>
                <Text size="sm" color="dimmed">{currentStep}/4</Text>
              </Group>
              <Progress value={getProgressValue()} size="lg" radius="xl" />
            </Box>

            {/* 步骤内容 */}
            {renderStepContent()}

            {/* 导航按钮 */}
            <Group position="apart">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                上一步
              </Button>
              
              <Group>
                {currentStep < 4 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  >
                    下一步
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!formData.name || !formData.age || !formData.gender}
                  >
                    开始分析
                  </Button>
                )}
              </Group>
            </Group>

            {error && <Alert color="red" title="错误">{error}</Alert>}
            {success && <Alert color="green" title="成功">{success}</Alert>}

            {/* 清空表单按钮 */}
            <Group position="center">
              <Button
                variant="subtle"
                color="gray"
                onClick={clearForm}
                disabled={loading}
              >
                重新测试
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* 显示上次测试结果 */}
        {localStorage.getItem(RESPONSE_STORAGE_KEY) && !loading && !response && (
          <Paper shadow="sm" p="xl" withBorder>
            <Stack spacing={20}>
              <Title order={3}>上次体质测试结果</Title>
              <Box
                sx={{
                  padding: "20px",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  "& img": { maxWidth: "100%" },
                }}
              >
                <ReactMarkdown>{localStorage.getItem(RESPONSE_STORAGE_KEY) || ""}</ReactMarkdown>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* 显示测试结果 */}
        {(loading || response) && (
          <Paper ref={resultRef} shadow="sm" p="xl" withBorder>
            <Stack spacing={20}>
              <Title order={3}>🌟 体质分析结果</Title>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px",
                  }}
                >
                  <Loader size="lg" mb="md" />
                  <Text>正在分析您的体质特征...</Text>
                  <Text size="sm" color="dimmed" mt="xs">根据中医理论为您制定个性化养生方案</Text>
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
    </>
  );
}