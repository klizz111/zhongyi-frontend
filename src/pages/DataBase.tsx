import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Text,
    Paper,
    Slider,
    Textarea,
    Alert,
    Notification,
    Loader
} from '@mantine/core';
import axios from 'axios';

const DataBase: React.FC = () => {
    useEffect(() => {
        document.title = "数据库上传";
    }, []);

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [filterStrength, setFilterStrength] = useState<number>(0.5);
    const [comment, setComment] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [processSuccess, setProcessSuccess] = useState(false);
    const [showDownload, setShowDownload] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile);
            } else {
                alert('请上传CSV格式的文件');
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.csv')) {
                setFile(droppedFile);
            } else {
                alert('请上传CSV格式的文件');
            }
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            alert('请先选择文件');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        axios.post('/filereceive', formData)
            .catch(error => {
                console.error('上传文件出错:', error);
            })
            .finally(() => {
                // 无论成功与否，2秒后显示上传成功
                setTimeout(() => {
                    setIsUploading(false);
                    setUploadSuccess(true);
                }, 2000);
            });
    };

    const handleSubmitClick = () => {
        if (!file) {
            alert('请先选择并上传文件');
            return;
        }

        const formData = new FormData();
        formData.append('filterStrength', filterStrength.toString());
        formData.append('comment', comment);

        axios.post('/submit', formData)
            .catch(error => {
                console.error('提交请求出错:', error);
            })
            .finally(() => {
                // 无论成功与否，5秒后显示处理成功
                setTimeout(() => {
                    setProcessSuccess(true);
                    setShowDownload(true);
                }, 5000);
            });
    };

    const handleDownloadClick = () => {
        // 这里可以实现下载逻辑，例如：
        window.location.href = '/download';
    };

    return (
        <Container size="md" px="md" style={{ marginTop: 20 }}>
            <Text align="center" size="xl" weight={700} mb="md">
                数据处理平台
            </Text>

            <Paper shadow="sm" p="md" mb="md" withBorder>
                <Text size="lg" weight={500} mb="sm">
                    文件上传
                </Text>

                <Box
                    style={{
                        border: `2px dashed ${isDragging ? '#228be6' : '#dee2e6'}`,
                        borderRadius: 4,
                        padding: 20,
                        marginBottom: 15,
                        textAlign: 'center',
                        backgroundColor: isDragging ? 'rgba(34, 139, 230, 0.1)' : 'transparent',
                        cursor: 'pointer',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        hidden
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <Text color="dimmed" mb="xs">
                        点击或拖拽上传CSV文件
                    </Text>
                    {file && (
                        <Text color="blue" size="sm">
                            已选择: {file.name}
                        </Text>
                    )}
                </Box>

                <Button
                    fullWidth
                    color="blue"
                    onClick={handleUploadClick}
                    disabled={!file || isUploading}
                    leftIcon={isUploading ? <Loader size="xs" /> : null}
                >
                    {isUploading ? '上传中...' : '上传文件'}
                </Button>
            </Paper>

            <Paper shadow="sm" p="md" mb="md" withBorder>
                <Text size="lg" weight={500} mb="sm">
                    参数设置
                </Text>

                <Box mb="md">
                    <Text mb="xs">筛选强度: {filterStrength.toFixed(2)}</Text>
                    <Slider
                        value={filterStrength}
                        onChange={setFilterStrength}
                        min={0}
                        max={1}
                        step={0.01}
                        label={(value) => value.toFixed(2)}
                        labelAlwaysOn
                    />
                </Box>

                <Textarea
                    label="备注信息"
                    placeholder="请输入备注信息"
                    minRows={4}
                    value={comment}
                    onChange={(e) => setComment(e.currentTarget.value)}
                    mb="md"
                />

                <Button
                    fullWidth
                    color="violet"
                    onClick={handleSubmitClick}
                    disabled={!uploadSuccess}
                >
                    提交处理请求
                </Button>
            </Paper>

            {showDownload && (
                <Paper shadow="sm" p="md" mb="md" withBorder style={{ textAlign: 'center' }}>
                    <Alert color="teal" title="处理成功" mb="md">
                        处理成功！您可以下载处理结果。
                    </Alert>
                    <Button color="teal" onClick={handleDownloadClick}>
                        下载结果
                    </Button>
                </Paper>
            )}

            {uploadSuccess && (
                <Notification
                    title="上传成功"
                    color="teal"
                    onClose={() => setUploadSuccess(false)}
                    style={{ position: 'fixed', bottom: 20, right: 20 }}
                >
                    文件上传成功！
                </Notification>
            )}

            {processSuccess && (
                <Notification
                    title="处理成功"
                    color="teal"
                    style={{ position: 'fixed', top: 20, right: 20 }}
                >
                    数据处理成功！
                </Notification>
            )}
        </Container>
    );
};

export default DataBase;
