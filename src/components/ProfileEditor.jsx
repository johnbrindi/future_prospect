import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, message, Spin, Modal, Card } from 'antd';
import { UploadOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { updateStudent, uploadStudentAvatar } from '@/services/studentService';

const { Option } = Select;
const { TextArea } = Input;

const ProfileEditor = ({ onClose, profileData, onUpdate }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Predefined skills for selection
  const skillOptions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C#',
    'C++', 'TypeScript', 'AWS', 'Azure', 'GCP', 'Docker',
    'Kubernetes', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL',
    'Machine Learning', 'AI', 'Data Science', 'DevOps', 'UI/UX',
    'Agile', 'Scrum', 'Project Management', 'Communication',
    'Problem Solving', 'Leadership', 'Teamwork'
  ];

  useEffect(() => {
    if (profileData) {
      form.setFieldsValue({
        fullName: profileData.full_name,
        university: profileData.university,
        department: profileData.department,
        bio: profileData.bio,
        graduationYear: profileData.graduation_year,
        skills: profileData.skills || []
      });

      // Set file list for avatar preview if exists
      if (profileData.avatar_url) {
        setFileList([
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: profileData.avatar_url,
          },
        ]);
      }
    }
  }, [profileData, form]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customUploadRequest = async (options) => {
    const { file, onSuccess, onError } = options;

    if (!user) {
      message.error('You must be logged in to upload an avatar');
      onError('Not logged in');
      return;
    }

    try {
      // Use the studentService to upload the avatar
      const result = await uploadStudentAvatar(file, user.id);
      onSuccess(result);

      // Update the fileList with the new avatar URL
      setFileList([
        {
          uid: '-1',
          name: file.name,
          status: 'done',
          url: result.avatarUrl,
        },
      ]);

      message.success('Avatar uploaded successfully');

      // If we have an onUpdate callback, call it with the updated profile
      if (onUpdate) {
        onUpdate(result.student);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      message.error('Failed to upload avatar');
      onError(error);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const onFinish = async (values) => {
    if (!user) {
      message.error('You must be logged in to update your profile');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        full_name: values.fullName,
        university: values.university,
        department: values.department,
        bio: values.bio,
        graduation_year: values.graduationYear,
        skills: values.skills
      };

      const updatedProfile = await updateStudent(user.id, updateData);
      message.success('Profile updated successfully');

      if (onUpdate) {
        onUpdate(updatedProfile);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      title="Edit Profile"
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Spin spinning={loading}>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Profile Picture</div>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    customRequest={customUploadRequest}
                    maxCount={1}
                  >
                    {fileList.length >= 1 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                  <Modal open={previewOpen} title="Preview" footer={null} onCancel={() => setPreviewOpen(false)}>
                    <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>

                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                  <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                  name="university"
                  label="University"
                  rules={[{ required: true, message: 'Please enter your university' }]}
                >
                  <Input placeholder="Enter your university" />
                </Form.Item>

                <Form.Item
                  name="department"
                  label="Department"
                  rules={[{ required: true, message: 'Please enter your department' }]}
                >
                  <Input placeholder="Enter your department" />
                </Form.Item>
              </div>

              <div style={{ flex: 1 }}>
                <Form.Item
                  name="bio"
                  label="Bio"
                >
                  <TextArea
                    placeholder="Tell us about yourself"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                  />
                </Form.Item>

                <Form.Item
                  name="graduationYear"
                  label="Graduation Year"
                >
                  <Input placeholder="Enter your graduation year" />
                </Form.Item>

                <Form.Item
                  name="skills"
                  label="Skills"
                >
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Select or add your skills"
                    optionLabelProp="label"
                  >
                    {skillOptions.map(skill => (
                      <Option key={skill} value={skill} label={skill}>
                        {skill}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>
      </Spin>
    </Modal>
  );
};

// Helper function to get base64 representation of a file
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export default ProfileEditor;