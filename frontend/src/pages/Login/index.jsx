import React from 'react'
import './index.css'
import axios from "axios";
import configs from "../../.configs";
import { useNavigate } from 'react-router-dom'; // quản lý việc navigate sang màn hình khác

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import { message } from 'antd';

function Login() {

    const navigate = useNavigate();
    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            message.error("Please fill in all fields");
            return;
        }
        setLoading(true);
        await axios.post(`${configs.API_URL}/auth/login`, {
            username, password
        })
            .then(res => { //khong co loi chay dong then
                if (res.data?.token) {
                    message.success(res.data.message);
                    localStorage.setItem("token", res.data.token);
                    navigate("/"); //sau khi đăng nhập thì navigave sang màn hình home
                } else {
                    message.error(res.data.message);
                }
            })
            .catch(err => {
                message.error("Login failed!");
                console.log(err);
            }) //co loi chay dong catch
        setLoading(false);
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormLabel>Username</FormLabel>
                        <Input type="email" placeholder="Enter your Username" onChange={(e) => setUsername(e.target.value)} />
                        <FormLabel>Password</FormLabel>
                        <Input type="password" placeholder="Enter your Password" onChange={(e) => setPassword(e.target.value)} />
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Remember me</Checkbox>
                                <Text color={'blue.400'}>Forgot password?</Text>
                            </Stack>
                            <Stack>
                                <Text>Not a member? To request an account, please contact your administrators.</Text>
                            </Stack>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={() => handleLogin()}
                                isLoading={loading}
                                loadingText="Signing in..."
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}

export default Login;