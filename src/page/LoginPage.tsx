import { useState } from 'react'
import NajotImg from "../assets/images/najot-ta'lim.png";
import Logo from "../assets/images/logo.svg";
import { Button, Form, Input } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useLoginMutation } from '../hooks/useAuth';
import { LoginType } from '../types';

const LoginPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const loginMutation = useLoginMutation()

  // login
  function handleLoginSubmit(values: LoginType) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Tizimga kirildi');
        navigate('/');
      },
      onError: () => toast.error("Parol yoki loginda xatolik")
    })
  }

  return (
    <div className='flex h-[100vh] max-sm:backdrop-blur max-sm:bg-[#000]/20 '>
      <Toaster position='top-center' reverseOrder={false} />
      <img src={NajotImg} className='w-[600px] max-sm:absolute max-sm:w-full h-full object-cover' alt="Najot ta'lim img" width={600} height={"100%"} />
      <div className='pt-[25px] md:pt-[40px] pl-[25px] md:pl-[44px]'>
        <img className='sm:mb-[120px] mb-[60px]' src={Logo} alt="Najot ta'lim Logo icon" width={202} height={41} />
        <div className='md:w-[380px] w-[300px] max-sm:absolute inset-0 max-sm:m-auto max-sm:h-[370px] p-[16px] max-sm:p-4 max-sm:bg-white rounded-lg'>
          <h2 className='sm:text-[32px] text-[24px] leading-[48px] mb-4'>Tizimga kirish</h2>
          <Form

            name="authentication"
            layout="vertical"
            style={{ width: "100%", }}
            onFinish={handleLoginSubmit}
          >
            <Form.Item label="Login" name="login" rules={[{ required: true, message: "Login kiriting!" }]}>
              <Input autoComplete='off' size='large' placeholder='Loginni kiriting' type='text' />
            </Form.Item>
            <Form.Item label="Parol" name="password" rules={[{ required: true, message: "Parol kiriting!" }]}>
              <Input
                autoComplete='off'
                size="large"
                placeholder='Parolni kiriting'
                type={showPassword ? 'text' : 'password'}
                suffix={
                  showPassword ? (
                    <EyeOutlined onClick={() => setShowPassword((prev) => !prev)} />
                  ) : (
                    <EyeInvisibleOutlined onClick={() => setShowPassword((prev) => !prev)} />
                  )
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                style={{ width: "100%" }}
                type="primary"
                className="btn mt-4 bg-[#0EB182] hover:!bg-[#0EB182]/80"
                htmlType="submit"
                loading={loginMutation.isPending}
              >
                Kirish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
